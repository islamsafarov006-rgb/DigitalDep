import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignedDocumentService {
  private http = inject(HttpClient);

  // Базовый URL. Если у вас используется Interceptor, который сам подставляет /api,
  // то оставьте здесь пустую строку '' или относительный путь.
  private readonly apiUrl = 'https://hence-mediterranean-person-forming.trycloudflare.com/api/signed-documents';

  /**
   * Скачать сгенерированный PDF документ силлабуса
   */
  downloadPdf(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download-pdf/${documentId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Загрузить отсканированный документ с печатями (MultipartFile)
   */
  uploadScan(documentId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<void>(`${this.apiUrl}/upload/${documentId}`, formData);
  }

  /**
   * Скачать ранее загруженный подписанный скан
   */
  downloadScan(documentId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/scan/${documentId}`, {
      responseType: 'blob'
    });
  }

  /**
   * Хелпер для скачивания Blob-файла в браузере
   */
  saveFileFromBlob(blob: Blob, defaultFileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = defaultFileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
