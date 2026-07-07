import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { DocumentService } from '../../../Services/Document/DocumetService'; // 🌟 Подключаем сервис документов
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // 🌟 Обязательно для *ngIf
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-syllabus-review',
  standalone: true, // Убедитесь, что компонент standalone
  templateUrl: './syllabus-review.component.html',
  styleUrls: ['./syllabus-review.component.scss'],
  imports: [
    FormsModule,
    CommonModule // 🌟 Добавлено для корректной работы шаблона
  ]
})
export class SyllabusReviewComponent implements OnInit {
  syllabus: any = null; // Инициализируем как null
  taskId: string = '';
  comment: string = '';

  private authService = inject(AuthService);
  private docService = inject(DocumentService); // 🌟 Внедряем сервис для получения данных силлабуса
  private route = inject(ActivatedRoute);
  private service = inject(SyllabusProcessService);
  private router = inject(Router);

  ngOnInit() {
    // 1. Извлекаем taskId
    this.taskId = this.route.snapshot.paramMap.get('taskId') || '';

    // 2. 🌟 Пытаемся вытащить ID силлабуса (из queryParams или из параметров пути, смотря как у вас настроен роут)
    // Если вы передаете его как /syllabus/review/librarian/:taskId, то силлабус можно узнать из таски
    // или передать через queryParams (?syllabusId=...).
    // Для примера вытащим из queryParams:
    const syllabusId = this.route.snapshot.queryParamMap.get('syllabusId');

    if (syllabusId) {
      this.loadSyllabusData(Number(syllabusId));
    } else {
      // Фолбэк: если ID не пришел напрямую, делаем заглушку, чтобы не падало,
      // либо хардкодим тестовый объект для проверки интерфейса:
      this.syllabus = { goals: 'Загрузка целей недоступна: отсутствует ID силлабуса в URL' };
    }
  }

  private loadSyllabusData(id: number) {
    this.docService.getById(id).subscribe({
      next: (res) => {
        // Вытаскиваем связь syllabus из пришедшего документа
        this.syllabus = res.syllabus || { goals: 'У данного документа нет заполненного силлабуса' };
      },
      error: (err) => {
        console.error('Не удалось загрузить силлабус:', err);
        this.syllabus = { goals: 'Ошибка при загрузке данных с сервера' };
      }
    });
  }

  submit(approved: boolean) {
    if (!approved && !this.comment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    const userRole = this.authService.getCurrentRole();
    const approverName = this.authService.getCurrentUserName();
    const config = this.getReviewConfigByRole(userRole);

    this.service.reviewTask(this.taskId, config.variableName, approved, approverName, this.comment).subscribe({
      next: () => {
        this.router.navigate([config.redirectUrl]);
      },
      error: (err) => {
        console.error('Ошибка при отправке решения:', err);
        alert(err.error?.message || 'Произошла ошибка при отправке решения.');
      }
    });
  }

  private getReviewConfigByRole(role: string): { variableName: string, redirectUrl: string } {
    const upperRole = role ? role.toUpperCase() : '';
    switch (upperRole) {
      case 'LIBRARIAN':
        return { variableName: 'libApproved', redirectUrl: '/approval-dashboard' };
      case 'METHODOLOGIST':
        return { variableName: 'academicApproved', redirectUrl: '/approval-dashboard' };
      case 'ACADEMIC_DEPARTMENT':
      case 'HEAD_OF_DEPARTMENT':
        return { variableName: 'headApproved', redirectUrl: '/approval-dashboard' };
      case 'DEANERY':
        return { variableName: 'deanApproved', redirectUrl: '/approval-dashboard' };
      default:
        return { variableName: 'libApproved', redirectUrl: '/approval-dashboard' };
    }
  }
}
