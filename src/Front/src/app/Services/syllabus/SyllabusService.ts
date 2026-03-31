import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {Discipline, DocumentStatus, SyllabusDocument} from './Syllabus';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SyllabusDocument[]> {
    return this.http.get<SyllabusDocument[]>(`${this.apiUrl}/documents`);
  }

  getById(id: number): Observable<SyllabusDocument> {
    return this.http.get<SyllabusDocument>(`${this.apiUrl}/documents/${id}`);
  }

  save(doc: SyllabusDocument): Observable<SyllabusDocument> {
    return this.http.post<SyllabusDocument>(`${this.apiUrl}/documents`, doc);
  }

  updateStatus(id: number, status: DocumentStatus): Observable<SyllabusDocument> {
    return this.http.patch<SyllabusDocument>(`${this.apiUrl}/documents/${id}/status`, null, {
      params: { status }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/documents/${id}`);
  }

  getByFilter(deptId: number, status: DocumentStatus): Observable<SyllabusDocument[]> {
    const params = new HttpParams()
      .set('deptId', deptId.toString())
      .set('status', status);
    return this.http.get<SyllabusDocument[]>(`${this.apiUrl}/documents/filter`, { params });
  }

  getDisciplinesByDept(deptId: number): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(`${this.apiUrl}/disciplines/department/${deptId}`);
  }
}


