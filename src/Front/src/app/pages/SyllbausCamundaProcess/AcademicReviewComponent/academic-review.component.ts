import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {catchError, finalize, forkJoin, map, of} from 'rxjs';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { ContentService } from '../../../Services/Content/ContentService';
import {GradingPolicyRow, WeeklyTopic} from '../../../Services/Content/GradingPolicyAndWeeklyTopic';
import { CamundaTask, SyllabusApprovalService } from '../../../Services/SyllabusApprovalService/SyllabusApprovalService';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-academic-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './academic-review.component.html',
  styleUrl: './academic-review.component.scss'
})
export class AcademicReviewComponent implements OnInit {
  @Input() task: CamundaTask | null = null;
  @Output() complete = new EventEmitter<any>();

  private processService = inject(SyllabusProcessService);
  private approvalService = inject(SyllabusApprovalService);
  private docService = inject(DocumentService);
  private contentService = inject(ContentService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  doc = signal<SyllabusDocument | null>(null);
  gradingPolicy = signal<GradingPolicyRow | null>(null);
  weeklyTopics = signal<WeeklyTopic[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  comment = '';

  private resolvedTask = signal<CamundaTask | null>(null);
  syllabus = computed(() => this.doc()?.syllabus ?? null);

  ngOnInit(): void {
    if (this.task) {
      // Открыт как дочерний компонент — task пришёл через @Input
      this.resolvedTask.set(this.task);
      this.loadBySyllabusId(this.task.syllabusId);
    } else {
      // Открыт через роутер: :id в маршруте — это syllabusId, taskId — в queryParams
      const syllabusId = this.route.snapshot.paramMap.get('id');
      const taskId = this.route.snapshot.queryParamMap.get('taskId');

      if (!syllabusId) {
        this.errorMessage.set('Не удалось определить ID силлабуса из URL.');
        this.isLoading.set(false);
        return;
      }

      if (!taskId) {
        this.errorMessage.set('Не удалось определить ID задачи из URL.');
        this.isLoading.set(false);
        return;
      }

      this.loadTaskFromServer(taskId, syllabusId);
    }
  }

  private loadTaskFromServer(taskId: string, syllabusId: string): void {
    const role = this.authService.getCurrentRole();

    this.approvalService.fetchTasks(role, 'active').subscribe({
      next: (tasks: CamundaTask[]) => {
        const found = tasks.find(t => t.id === taskId);

        if (!found) {
          this.errorMessage.set(`Задача ${taskId} не найдена в списке задач для роли: ${role}.`);
          return;
        }

        this.resolvedTask.set(found);
      },
      error: (err: any) => {
        this.errorMessage.set('Ошибка при загрузке задач из сервиса: ' + (err.message || err));
      }
    });

    // Документ грузим независимо от резолва задачи
    this.loadBySyllabusId(syllabusId);
  }

  private loadBySyllabusId(syllabusId: string | undefined): void {
    if (!syllabusId) {
      this.errorMessage.set('syllabusId отсутствует в задаче.');
      this.isLoading.set(false);
      return;
    }

    const numericId = Number(syllabusId);
    if (isNaN(numericId)) {
      this.errorMessage.set(`syllabusId "${syllabusId}" не является числом.`);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    forkJoin({
      document: this.docService.getById(numericId),
      // Извлекаем первый элемент из массива прямо в потоке
      policy: this.contentService.getGradingPolicy(numericId).pipe(
        map(rows => (rows && rows.length > 0 ? rows[0] : null)),
        catchError(() => of(null))
      ),
      topics: this.contentService.getWeeklyTopics(numericId).pipe(
        catchError(() => of([]))
      )
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (res) => {
        this.doc.set(res.document);
        this.gradingPolicy.set(res.policy); // Теперь типы совпадают!

        const sorted = (res.topics ?? [])
          .sort((a, b) => a.weekNumber - b.weekNumber);
        this.weeklyTopics.set(sorted);
      },
      error: (err: any) => {
        this.errorMessage.set('Ошибка при загрузке документа: ' + (err.message || err));
      }
    });
  }
  submit(approved: boolean): void {
    const currentTask = this.resolvedTask();
    if (!currentTask) {
      alert('Задача не загружена.');
      return;
    }
    if (!approved && !this.comment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    this.isSubmitting.set(true);

    const approverName = this.authService.getCurrentUserName();
    const variableName = currentTask.taskDefinitionKey === 'Task_HeadOfDepartment'
      ? 'headApproved'
      : 'academicApproved';

    this.processService.reviewTask(currentTask.id, variableName, approved, approverName, this.comment)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          alert(approved ? 'Силлабус одобрен!' : 'Силлабус отправлен на доработку.');
          if (this.task) {
            this.complete.emit({ taskId: currentTask.id, approved, comment: this.comment });
          } else {
            this.router.navigate(['/approval-dashboard']);
          }
        },
        error: (err: any) => {
          alert('Ошибка при отправке решения: ' + (err.message || err));
        }
      });
  }

  get currentTask(): CamundaTask | null {
    return this.resolvedTask();
  }
}
