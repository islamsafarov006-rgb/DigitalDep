import { Component, Input, Output, EventEmitter, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, map, of, combineLatest } from 'rxjs'; // 🌟 Импортируем combineLatest
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
      // 🌟 ИСПРАВЛЕНО: Используем combineLatest вместо forkJoin, так как потоки роута не завершаются сами
      combineLatest({
        params: this.route.paramMap.pipe(map(p => p.get('id'))),
        queryParams: this.route.queryParamMap.pipe(map(q => q.get('taskId')))
      }).subscribe({
        next: ({ params, queryParams }) => {
          const syllabusId = params;
          const taskId = queryParams;

          if (!syllabusId) {
            this.errorMessage.set('Не удалось определить ID силлабуса из URL (параметр :id отсутствует).');
            this.isLoading.set(false);
            return;
          }

          if (!taskId) {
            this.errorMessage.set('Не удалось определить ID задачи из URL (query-параметр ?taskId отсутствует).');
            this.isLoading.set(false);
            return;
          }

          this.loadTaskFromServer(taskId, syllabusId);
        },
        error: (err) => {
          this.errorMessage.set('Ошибка инициализации параметров маршрута: ' + err.message);
          this.isLoading.set(false);
        }
      });
    }
  }

  private loadTaskFromServer(taskId: string, syllabusId: string): void {
    const role = this.authService.getCurrentRole();
    this.isLoading.set(true);

    this.approvalService.fetchTasks(role, 'active').subscribe({
      next: (tasks: CamundaTask[]) => {
        let found = tasks.find(t => t.id === taskId);

        if (!found && role === 'ACADEMIC_DEPARTMENT') {
          this.approvalService.fetchTasks('METHODOLOGIST', 'active').subscribe({
            next: (altTasks) => {
              found = altTasks.find(t => t.id === taskId);
              if (found) {
                this.resolvedTask.set(found);
                this.loadBySyllabusId(syllabusId);
              } else {
                this.errorMessage.set(`Задача ${taskId} не найдена в списках для ACADEMIC_DEPARTMENT и METHODOLOGIST.`);
                this.isLoading.set(false);
              }
            },
            error: () => {
              this.errorMessage.set(`Задача ${taskId} не найдена для роли: ${role}.`);
              this.isLoading.set(false);
            }
          });
          return;
        }

        if (!found) {
          this.errorMessage.set(`Задача ${taskId} не найдена в списке задач для роли: ${role}.`);
          this.isLoading.set(false);
          return;
        }

        this.resolvedTask.set(found);
        this.loadBySyllabusId(syllabusId);
      },
      error: (err: any) => {
        this.errorMessage.set('Ошибка при загрузке задач из сервиса: ' + (err.message || err));
        this.isLoading.set(false);
      }
    });
  }

  private loadBySyllabusId(syllabusId: string | undefined): void {
    if (!syllabusId) {
      this.errorMessage.set('syllabusId отсутствует в задаче.');
      this.isLoading.set(false);
      return;
    }

    const numericSyllabusId = Number(syllabusId);
    if (isNaN(numericSyllabusId)) {
      this.errorMessage.set(`syllabusId "${syllabusId}" не является числом.`);
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);

    // Шаг 1: Сначала получаем сам документ по ID силлабуса
    this.docService.getById(numericSyllabusId).subscribe({
      next: (documentData) => {
        this.doc.set(documentData);

        // Извлекаем правильный documentId с бэкенда.
        // Если у вас корневой объект — это Document, то его ID берем из documentData.id
        const documentId = documentData?.id;

        if (!documentId) {
          console.error('ID документа не найден в ответе сервера:', documentData);
          this.errorMessage.set('Ошибка данных: Не удалось определить ID документа для загрузки тем.');
          this.isLoading.set(false);
          return;
        }

        // Шаг 2: Теперь параллельно загружаем темы (по documentId) и политику (по syllabusId)
        forkJoin({
          policy: this.contentService.getGradingPolicy(numericSyllabusId).pipe(
            catchError((err) => {
              console.error('Ошибка загрузки политики оценивания:', err);
              return of(null);
            })
          ),
          topics: this.contentService.getWeeklyTopics(documentId).pipe( // 🌟 Передаем именно documentId!
            catchError((err) => {
              console.error('Ошибка загрузки еженедельного плана:', err);
              return of([]);
            })
          )
        })
          .pipe(finalize(() => this.isLoading.set(false)))
          .subscribe({
            next: (res) => {
              // Записываем политику оценивания
              if (res.policy && Array.isArray(res.policy)) {
                this.gradingPolicy.set(res.policy[0] || null);
              } else {
                this.gradingPolicy.set(res.policy);
              }

              // Проверяем структуру пришедших тем
              const rawTopics = res.topics ?? [];
              if (rawTopics.length > 0 && ('assignmentName' in rawTopics[0])) {
                console.error('🚨 Сервер всё равно вернул политику вместо тем. Проверьте контроллер /weekly-topics/document/ на бэке!');
                this.errorMessage.set('Ошибка сервера: критическое смещение данных (версии структуры не совпадают).');
                this.weeklyTopics.set([]);
                return;
              }

              // Сортируем темы по неделям
              const sorted = [...rawTopics].sort((a, b) => (a.weekNumber || 0) - (b.weekNumber || 0));
              this.weeklyTopics.set(sorted);
            },
            error: (err) => {
              this.errorMessage.set('Ошибка выполнения параллельных запросов данных контента: ' + err.message);
            }
          });
      },
      error: (err: any) => {
        this.errorMessage.set('Ошибка при загрузке основного документа: ' + (err.message || err));
        this.isLoading.set(false);
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
