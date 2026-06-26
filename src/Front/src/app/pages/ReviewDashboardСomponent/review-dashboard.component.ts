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
      'ACADEMIC_DEPARTMENT': 'Учебный отдел',
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
    const role = this.getCurrentRole();
    const status = this.activeSubTab();
    this.approvalService.fetchTasks(role, status).subscribe({
      next: (data) => console.log('Задачи успешно загружены:', data),
      error: (err) => console.error('Ошибка загрузки задач:', err)
    });
  }

// Единая точка перехода к согласованию
  openTaskReview(task: CamundaTask): void {
    const role = this.getCurrentRole();
    let path = '';

    if (role === 'LIBRARIAN') {
      path = '/syllabus/review/librarian';
    }
    // Теперь направляем методиста на тот же компонент, что и Academic Department
    else if (role === 'METHODOLOGIST' || role === 'ACADEMIC_DEPARTMENT' || role === 'DEANERY') {
      path = '/syllabus/review/academic';
    }

    if (path) {
      const syllabusId = task.syllabusId;

      if (!syllabusId) {
        console.error('Ошибка: у задачи отсутствует syllabusId', task);
        alert('Ошибка: не удалось определить ID документа для согласования.');
        return;
      }

      this.router.navigate([path, syllabusId], {
        queryParams: {
          taskId: task.id,
          taskDefinitionKey: task.taskDefinitionKey
        }
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
