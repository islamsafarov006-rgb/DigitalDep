import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Department} from './Department/department';



export interface Discipline {
  id?: number;
  name: string;
  courseCode: string;
  creditsEcts: number;
  department?: Department;

  // Поля автозаполнения часов
  defaultLectures?: number;
  defaultPractice?: number;
  defaultSiw?: number;
  defaultSiwt?: number;

  // Рекомендованные параметры
  recommendedCourse?: number;
  recommendedSemester?: number;
}


@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  // Замени URL на свой рабочий адрес бэкенда, если он отличается
  private readonly apiUrl = 'http://localhost:8080/api/disciplines';

  constructor(private http: HttpClient) {}

  /**
   * GET /api/disciplines
   * Получить полный список всех дисциплин (используется для нашего выпадающего списка)
   */
  getAllDisciplines(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.apiUrl);
  }

  /**
   * GET /api/disciplines/{id}
   * Получить дисциплину по её ID
   */
  getDisciplineById(id: number): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.apiUrl}/${id}`);
  }

  /**
   * GET /api/disciplines/department/{departmentId}
   * Получить список дисциплин, закрепленных за конкретной кафедрой
   */
  getDisciplinesByDepartment(departmentId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  /**
   * GET /api/disciplines/code/{code}
   * Найти дисциплину по её уникальному коду (например, CSA301)
   */
  getDisciplineByCode(code: string): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.apiUrl}/code/${code}`);
  }

  /**
   * POST /api/disciplines
   * Создать или обновить (если передан id) дисциплину в справочнике
   */
  saveDiscipline(discipline: Discipline): Observable<Discipline> {
    return this.http.post<Discipline>(this.apiUrl, discipline);
  }

  /**
   * DELETE /api/disciplines/{id}
   * Удалить дисциплину из справочника по ID
   */
  deleteDiscipline(id: number): Observable<void> {
    return this.http.delete<void>(`${`${this.apiUrl}/${id}`}`);
  }
}
