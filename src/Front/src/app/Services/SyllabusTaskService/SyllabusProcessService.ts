import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CamundaTask {
  id: string;
  name: string;
  assignee: string | null;
  createTime: string | null;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  syllabusId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SyllabusProcessService {
  private apiUrl = 'https://hence-mediterranean-person-forming.trycloudflare.com/api/v1/syllabus-process';

  constructor(private http: HttpClient) {}

  /**
   * Запуск процесса Camunda для силлабуса
   */
  startProcess(syllabusId: string, initiator: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/start`, null, {
      params: { syllabusId, initiator },
      responseType: 'text'
    });
  }

  /**
   * Получение списка задач по роли (Методолог, Библиотекарь, Декан)
   */
  getTasksByRole(role: string): Observable<CamundaTask[]> {
    return this.http.get<CamundaTask[]>(`${this.apiUrl}/tasks/role/${role}`);
  }

  /**
   * Получение персональных задач доработки для конкретного преподавателя
   */
  getTasksByTeacher(teacherName: string): Observable<CamundaTask[]> {
    return this.http.get<CamundaTask[]>(`${this.apiUrl}/tasks/teacher/${teacherName}`);
  }

  /**
   * Вынесение решения по задаче проверки (Одобрено / Отклонено)
   * * @param taskId        ID задачи Camunda
   * @param variableName  имя переменной процесса: 'libApproved' | 'academicApproved' | 'headApproved' | 'deanApproved'
   * @param isApproved    решение
   * @param reviewerId    ID/Имя текущего проверяющего (соответствует бэкенду)
   * @param comment       комментарий (особенно важен при отказе)
   */
  reviewTask(
    taskId: string,
    variableName: string,
    isApproved: boolean,
    reviewerId: string, // Переименовали approverName -> reviewerId
    comment: string = ''
  ): Observable<string> {
    return this.http.post(`${this.apiUrl}/tasks/${taskId}/review`, null, {
      params: {
        variableName,
        isApproved: String(isApproved),
        reviewerId, // Теперь ключ точно совпадает с @RequestParam String reviewerId на бэке
        comment
      },
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
}
