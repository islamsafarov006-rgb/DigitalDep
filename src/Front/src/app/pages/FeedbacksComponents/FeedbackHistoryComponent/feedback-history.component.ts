import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../../Services/AuthService/AuthService';
import {FeedbackHistoryItem, FeedbackService} from '../../../Services/FeedbackService/FeedbackService';

@Component({
  selector: 'app-feedback-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-history.component.html',
  styleUrls: ['./feedback-history.component.scss']
})
export class FeedbackHistoryComponent implements OnInit {
  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);

  historyList = signal<FeedbackHistoryItem[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    const email = this.authService.getCurrentUserEmail() || '';
    if (!email) {
      this.isLoading.set(false);
      return;
    }

    this.feedbackService.getHistory(email).subscribe({
      next: (data) => {
        // Сортируем: новые обращения будут вверху страницы
        const sortedData = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.historyList.set(sortedData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Ошибка загрузки фидбеков:', err);
        this.isLoading.set(false);
      }
    });
  }
}
