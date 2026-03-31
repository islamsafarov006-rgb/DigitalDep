import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SyllabusDocument, DocumentStatus } from './Document';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/documents`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SyllabusDocument[]> {
    return this.http.get<SyllabusDocument[]>(this.apiUrl);
  }

  getById(id: number): Observable<SyllabusDocument> {
    return this.http.get<SyllabusDocument>(`${this.apiUrl}/${id}`);
  }

  getByFilter(deptId: number, status: DocumentStatus): Observable<SyllabusDocument[]> {
    const params = new HttpParams()
      .set('deptId', deptId.toString())
      .set('status', status);
    return this.http.get<SyllabusDocument[]>(`${this.apiUrl}/filter`, { params });
  }

  save(document: SyllabusDocument): Observable<SyllabusDocument> {
    return this.http.post<SyllabusDocument>(this.apiUrl, document);
  }

  updateStatus(id: number, status: DocumentStatus): Observable<SyllabusDocument> {
    return this.http.patch<SyllabusDocument>(`${this.apiUrl}/${id}/status`, null, {
      params: { status }
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
