import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CamundaTask {
  id: string;
  name: string;
  assignee: string | null;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  createTime: string;
}

export interface TaskVariables {
  syllabusId: string;
  initiator?: string;
  libApproved?: boolean;
  academicApproved?: boolean;
  headApproved?: boolean;
  deanApproved?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SyllabusTaskService {
  private readonly http = inject(HttpClient);
  // 🌟 Обновили базовый URL на префикс твоего нового контроллера
  private readonly apiUrl = `${environment.apiUrl}/v1/syllabus-process`;

  /**
   * Получение задач по роли (для дашбордов согласования)
   * Ожидает Enum-строку (например, 'LIBRARIAN', 'DEANERY', 'METHODOLOGIST')
   */
  getTasksByRole(role: string): Observable<CamundaTask[]> {
    return this.http.get<CamundaTask[]>(`${this.apiUrl}/tasks/role/${role}`);
  }

  /**
   * Получение персональных задач доработки для преподавателя
   */
  getTeacherTasks(teacherName: string): Observable<CamundaTask[]> {
    return this.http.get<CamundaTask[]>(`${this.apiUrl}/tasks/teacher/${teacherName}`);
  }

  /**
   * Вынесение решения по задаче проверки (Одобрено / Отклонено)
   * Соответствует новой сигнатуре бэкенда с 5 параметрами через @RequestParam
   */
  reviewTask(
    taskId: string,
    variableName: string,
    isApproved: boolean,
    comment: string,
    reviewerId: string
  ): Observable<string> {
    // Формируем query-параметры (?variableName=...&isApproved=...)
    const params = new HttpParams()
      .set('variableName', variableName)
      .set('isApproved', isApproved.toString())
      .set('comment', comment)
      .set('reviewerId', reviewerId);

    // Отправляем POST запрос. Текстовый ответ обрабатываем как text
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/review`, null, {
      params,
      responseType: 'text'
    });
  }

  /**
   * Завершение таски исправления преподавателем
   */
  completeFix(taskId: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/fix-complete`, null, {
      responseType: 'text'
    });
  }

  /**
   * Запуск процесса Camunda для силлабуса
   */
  startProcess(syllabusId: string, initiator: string): Observable<string> {
    const params = new HttpParams()
      .set('syllabusId', syllabusId)
      .set('initiator', initiator);

    return this.http.post(`${this.apiUrl}/start`, null, {
      params,
      responseType: 'text'
    });
  }

  /**
   * Переменные таски (Если эндпоинт генерации /variables остался в основном контроллере документов,
   * оставь путь `${environment.apiUrl}/documents/${id}/variables`, как у тебя в роутах Angular)
   */
  getTaskVariables(taskId: string): Observable<TaskVariables> {
    return this.http.get<TaskVariables>(`${environment.apiUrl}/tasks/${taskId}/variables`);
  }
}
