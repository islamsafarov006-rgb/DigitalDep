import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Syllabus} from './syllabus';

@Injectable({
  providedIn: 'root'
})
export class SyllabusService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/syllabus';

  getAll(): Observable<Syllabus[]> {
    return this.http.get<Syllabus[]>(this.baseUrl);
  }

  getById(id: number): Observable<Syllabus> {
    return this.http.get<Syllabus>(`${this.baseUrl}/${id}`);
  }

  create(syllabus: Syllabus): Observable<Syllabus> {
    return this.http.post<Syllabus>(this.baseUrl, syllabus);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
