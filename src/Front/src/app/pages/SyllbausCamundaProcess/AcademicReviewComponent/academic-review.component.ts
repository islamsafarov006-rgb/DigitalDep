import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, map, of } from 'rxjs';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { ContentService } from '../../../Services/Content/ContentService';
import { GradingPolicyRow, WeeklyTopic } from '../../../Services/Content/GradingPolicyAndWeeklyTopic';
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
      this.resolvedTask.set(this.task);
      this.loadBySyllabusId(this.task.syllabusId);
    } else {
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

    // 🌟 Запрашиваем задачи для текущей роли
    this.approvalService.fetchTasks(role, 'active').subscribe({
      next: (tasks: CamundaTask[]) => {
        let found = tasks.find(t => t.id === taskId);

        // 🌟 ФОЛБЭК: Если завкаф (ACADEMIC_DEPARTMENT) не нашёл задачу в своём пуле напрямую,
        // но у него есть доступ, либо задача упала в пограничный статус — пробуем запросить
        // через смежную техническую группу, чтобы не блокировать интерфейс.
        if (!found && role === 'ACADEMIC_DEPARTMENT') {
          this.approvalService.fetchTasks('METHODOLOGIST', 'active').subscribe({
            next: (altTasks) => {
              found = altTasks.find(t => t.id === taskId);
              if (found) {
                this.resolvedTask.set(found);
              } else {
                this.errorMessage.set(`Задача ${taskId} не найдена в списках для ACADEMIC_DEPARTMENT и METHODOLOGIST.`);
              }
            },
            error: () => this.errorMessage.set(`Задача ${taskId} не найдена для роли: ${role}.`)
          });
          return;
        }

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
        this.gradingPolicy.set(res.policy);

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

    // Проверяем как по ключу таски, так и по роли на всякий случай
    const isHeadTask = currentTask.taskDefinitionKey === 'Task_HeadOfDepartment' ||
      this.authService.getCurrentRole() === 'ACADEMIC_DEPARTMENT';

    const variableName = isHeadTask ? 'headApproved' : 'academicApproved';

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
