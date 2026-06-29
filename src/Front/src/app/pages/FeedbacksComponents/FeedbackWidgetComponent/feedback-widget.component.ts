import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/AuthService/AuthService';
import { FeedbackService } from '../../../Services/FeedbackService/FeedbackService';

@Component({
  selector: 'app-feedback-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback-widget.component.html',
  styleUrls: ['./feedback-widget.component.scss']
})
export class FeedbackWidgetComponent {
  private feedbackService = inject(FeedbackService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isOpen = signal(false);
  isSubmitting = signal(false);

  messageText = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  toggleWidget() {
    this.isOpen.update(v => !v);
    if (!this.isOpen()) {
      this.resetForm();
    }
  }

  // 🌟 ФИЧА: Переход на страницу истории по роуту
  navigateToHistory() {
    this.isOpen.set(false);
    this.router.navigate(['/feedback-history']);
  }

  // 🌟 ФИЧА: Перехват Ctrl+V для автоматической вставки скриншота
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.isOpen()) return;

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // Создаем валидный File объект с расширением
          this.selectedFile = new File([file], `pasted-screenshot-${Date.now()}.png`, { type: 'image/png' });
          this.createImagePreview(this.selectedFile);
          break;
        }
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.createImagePreview(file);
    }
  }

  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeScreenshot() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

    submitFeedback() {
      if (!this.messageText.trim()) return;

      this.isSubmitting.set(true);

      const userName = this.authService.getCurrentUserName() || 'Преподаватель';
      const userEmail = this.authService.getCurrentUserEmail() || 'user@muit.kz';

      console.log('Отправка фидбека начата...', { userName, userEmail, text: this.messageText });

      this.feedbackService.sendFeedback(userName, userEmail, this.messageText, this.selectedFile).subscribe({
        next: (response) => {
          console.log('Бэкенд успешно ответил:', response);
          this.handleSuccess();
        },
        error: (err) => {
          console.error('Ошибка при отправке фидбека на бэкенд:', err);
          alert('Не удалось отправить фидбек. Проверьте консоль бэкенда.');
          this.isSubmitting.set(false);
        },
        complete: () => {
          console.log('Поток RxJS завершен (complete)');
          // Если next не сработал из-за пустого тела ответа, подстрахуем тут:
          if (this.isSubmitting()) {
            this.handleSuccess();
          }
        }
      });
    }

  private handleSuccess() {
      alert('Спасибо! Ваш фидбек отправлен.');
      this.resetForm();
      this.isOpen.set(false);
    }
  private resetForm() {
    this.messageText = '';
    this.selectedFile = null;
    this.imagePreview = null;
    this.isSubmitting.set(false);
  }
}
