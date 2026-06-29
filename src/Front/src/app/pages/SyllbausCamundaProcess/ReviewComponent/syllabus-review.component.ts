import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-syllabus-review',
  templateUrl: './syllabus-review.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./syllabus-review.component.scss']
})
export class SyllabusReviewComponent implements OnInit {
  syllabus: any; // Замените на вашу модель Syllabus
  taskId: string = '';
  comment: string = '';

  private authService = inject(AuthService);

  constructor(
    private route: ActivatedRoute,
    private service: SyllabusProcessService,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('taskId')!;
  }

  submit(approved: boolean) {
    if (!approved && !this.comment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    const userRole = this.authService.getCurrentRole(); // Получаем роль (например, 'ACADEMIC_DEPARTMENT', 'LIBRARIAN' и т.д.)
    const approverName = this.authService.getCurrentUserName();

    // Динамически определяем переменную процесса и путь редиректа
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

      // Вот здесь проверяем роль Завкафа
      case 'ACADEMIC_DEPARTMENT':
      case 'HEAD_OF_DEPARTMENT': // на случай, если прилетит подмененная строка
        return { variableName: 'headApproved', redirectUrl: '/approval-dashboard' };

      // Вот здесь проверяем роль Декана
      case 'DEANERY':
        return { variableName: 'deanApproved', redirectUrl: '/approval-dashboard' };

      default:
        return { variableName: 'libApproved', redirectUrl: '/approval-dashboard' };
    }
  }
}
