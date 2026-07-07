import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface CamundaTask {
  id: string;
  name: string;
  processInstanceId: string;
  taskDefinitionKey: string;
  syllabusId?: string;
  createTime?: string;
  endTime?: string;
  disciplineName?: string;
  teacherName?: string;
  variables?: Record<string, any>;
}

@Injectable({
  providedIn: 'root'
})
export class SyllabusApprovalService {
  private http = inject(HttpClient);

  // Базовый URL до SyllabusApprovalController
  private readonly apiUrl = 'http://localhost:8080/api/syllabus/tasks';

  // Сигналы для хранения глобального состояния задач
  tasksList = signal<CamundaTask[]>([]);
  isLoading = signal<boolean>(false);

  /**
   * Загружает задачи с бэкенда по роли пользователя и статусу вкладки.
   * Автоматически обновляет реактивные сигналы состояния.
   */
  fetchTasks(role: string, status: string): Observable<CamundaTask[]> {
    this.isLoading.set(true);

    const params = new HttpParams()
      .set('role', role)
      .set('status', status);

    return this.http.get<CamundaTask[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (tasks) => {
          this.tasksList.set(tasks);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Ошибка при получении задач из Camunda:', err);
          this.tasksList.set([]); // Очищаем список при ошибке
          this.isLoading.set(false);
        }
      })
    );
  }

  /**
   * Метод для завершения/согласования задачи (User Task) в Camunda.
   */
  completeTask(taskId: string, variables: Record<string, any>): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${taskId}/complete`, variables);
  }
}
