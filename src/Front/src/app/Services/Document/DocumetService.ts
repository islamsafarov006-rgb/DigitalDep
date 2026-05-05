import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SyllabusDocument, DocumentStatus } from './Document';
import { environment } from '../../../environments/environment';
import { WeeklyTopic } from '../Content/GradingPolicyAndWeeklyTopic';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/documents`;


  getById(id: number): Observable<SyllabusDocument> {
    return this.http.get<SyllabusDocument>(`${this.apiUrl}/${id}`);
  }

  saveDiscipline(document: SyllabusDocument): Observable<SyllabusDocument> {
    return this.http.post<SyllabusDocument>(`${this.apiUrl}/discipline`, document);
  }

  updateWeeklyTopics(id: number, topics: WeeklyTopic[]): Observable<SyllabusDocument> {
    return this.http.put<SyllabusDocument>(`${this.apiUrl}/${id}/weekly-topics`, topics);
  }

  updateStatus(id: number, status: DocumentStatus): Observable<SyllabusDocument> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<SyllabusDocument>(`${this.apiUrl}/${id}/status`, {}, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<SyllabusDocument[]> {
    return this.http.get<SyllabusDocument[]>(`${this.apiUrl}/my`);
  }
  exportToWord(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/export`, {
      responseType: 'blob'
    });
  }


  downloadSyllabus(id: number, fileName: string = 'syllabus.docx'): void {
    this.exportToWord(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Ошибка при скачивании файла', err)
    });
  }
}
