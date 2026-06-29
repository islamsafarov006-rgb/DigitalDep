import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import {CamundaTask, SyllabusApprovalService} from '../../Services/SyllabusApprovalService/SyllabusApprovalService';

@Component({
  selector: 'app-review-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-dashboard.component.html',
  styleUrls: ['./review-dashboard.component.scss']
})
export class ReviewDashboardComponent implements OnInit {
  private approvalService = inject(SyllabusApprovalService);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeSubTab = signal<string>('active');
  tasksList = this.approvalService.tasksList;
  isTasksLoading = this.approvalService.isLoading;

  // Распознавание всех актуальных ролей
  getCurrentRole(): string {
    const roles = ['ADMIN', 'TEACHER', 'LIBRARIAN', 'METHODOLOGIST', 'ACADEMIC_DEPARTMENT', 'DEANERY'];
    for (const role of roles) {
      if (this.authService.hasRole([role])) return role;
    }
    return 'GUEST';
  }

  // Человекочитаемые названия
  getRoleLabel(): string {
    const role = this.getCurrentRole();
    const labels: Record<string, string> = {
      'ADMIN': 'Администратор',
      'TEACHER': 'Преподаватель',
      'LIBRARIAN': 'Библиотекарь',
      'METHODOLOGIST': 'Методист',
      'ACADEMIC_DEPARTMENT': 'Заведующий кафедрой',
      'DEANERY': 'Деканат',
      'GUEST': 'Гость'
    };
    return labels[role] || 'Гость';
  }

  ngOnInit(): void {
    console.log('Текущая роль:', this.getCurrentRole());
    this.loadTasks();
  }

  setSubTab(tab: string): void {
    this.activeSubTab.set(tab);
    this.loadTasks();
  }

  loadTasks(): void {
    let role = this.getCurrentRole();
    const status = this.activeSubTab();

    // Если зашел Завкаф (у которого в БД роль ACADEMIC_DEPARTMENT),
    // меняем отправляемую роль на ту, которую ждет бэк/Camunda для этого шага
    if (role === 'ACADEMIC_DEPARTMENT') {
      role = 'HEAD_OF_DEPARTMENT'; // или 'TEACHER' / смотря какая группа в BPMN
    }

    this.approvalService.fetchTasks(role, status).subscribe({
      next: (data) => console.log('Задачи успешно загружены:', data),
      error: (err) => console.error('Ошибка загрузки задач:', err)
    });
  }

  openTaskReview(task: CamundaTask): void {
    let role = this.getCurrentRole();
    let path = '';

    const syllabusId = task.syllabusId;
    if (!syllabusId) {
      console.error('Ошибка: у задачи отсутствует syllabusId', task);
      alert('Ошибка: не удалось определить ID документа.');
      return;
    }

    // 1. Финальный шаг для преподавателя (загрузка скана)
    if (task.taskDefinitionKey === 'Task_UploadSigned' || role === 'TEACHER') {
      this.router.navigate(['/signed-document', syllabusId], {
        queryParams: { taskId: task.id }
      });
      return;
    }

    // Подмена роли для соответствия бизнес-логике
    if (role === 'ACADEMIC_DEPARTMENT') {
      role = 'HEAD_OF_DEPARTMENT';
    }

    // 2. Определение пути на основе роли
    if (role === 'LIBRARIAN') {
      path = '/syllabus/review/librarian';
    }
    else if (role === 'METHODOLOGIST') {
      path = '/syllabus/review/academic';
    }
    // 🌟 Завкаф и Декан теперь используют новые роуты, ведущие на DeanReviewComponent
    else if (role === 'HEAD_OF_DEPARTMENT') {
      path = '/syllabus/review/head';
    }
    else if (role === 'DEANERY') {
      path = '/syllabus/review/dean';
    }

    if (path) {
      // Перенаправляем на DeanReviewComponent: путь /:id + queryParams с taskId
      this.router.navigate([path, syllabusId], {
        queryParams: { taskId: task.id }
      });
    } else {
      alert('У вас нет прав для доступа к этому разделу');
    }
  }

  openTaskFix(task: CamundaTask): void {
    this.router.navigate(['/syllabus/edit', task.processInstanceId], {
      queryParams: { taskId: task.id }
    });
  }
}
