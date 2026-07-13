import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeedbackHistoryItem {
  id: number;
  message: string;
  screenshotUrl: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private http = inject(HttpClient);
  private apiUrl = 'https://hence-mediterranean-person-forming.trycloudflare.com/api/feedback';

  sendFeedback(name: string, email: string, message: string, file: File | null): Observable<any> {
    const formData = new FormData();

    // Ключи должны строго совпадать с именами в @RequestPart на бэкенде!
    formData.append('userName', name);
    formData.append('userEmail', email);
    formData.append('message', message);

    if (file) {
      formData.append('file', file); // 🌟 Ключ 'file' совпадает с @RequestPart(value = "file")
    }

    // Обязательно возвращаем как JSON, так как бэкенд теперь возвращает Map.of("status", "...")
    return this.http.post(this.apiUrl, formData);
  }

  getHistory(email: string): Observable<FeedbackHistoryItem[]> {
    return this.http.get<FeedbackHistoryItem[]>(`${this.apiUrl}/history?email=${email}`);
  }
}

