import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { CamundaTask, SyllabusApprovalService } from '../../Services/SyllabusApprovalService/SyllabusApprovalService';

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

  getCurrentRole(): string {
    const roles = ['ADMIN', 'TEACHER', 'LIBRARIAN', 'METHODOLOGIST', 'ACADEMIC_DEPARTMENT', 'DEANERY'];
    for (const role of roles) {
      if (this.authService.hasRole([role])) return role;
    }
    return 'GUEST';
  }

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
    const role = this.getCurrentRole();
    const status = this.activeSubTab();

    this.approvalService.fetchTasks(role, status).subscribe({
      next: (data) => console.log(`Задачи успешно загружены для роли ${role}:`, data),
      error: (err) => console.error('Ошибка загрузки задач:', err)
    });
  }

  // 🌟 Хелпер для безопасного извлечения названия дисциплины из переменных Camunda
  getDisciplineName(task: CamundaTask): string {
    if (task.variables && task.variables['disciplineName']) {
      return task.variables['disciplineName'].value || task.variables['disciplineName'];
    }
    return '—';
  }

  // 🌟 Хелпер для безопасного извлечения имени преподавателя из переменных Camunda
  getTeacherName(task: CamundaTask): string {
    if (task.variables && task.variables['teacherName']) {
      return task.variables['teacherName'].value || task.variables['teacherName'];
    }
    if (task.variables && task.variables['author']) {
      return task.variables['author'].value || task.variables['author'];
    }
    return '—';
  }

  openTaskReview(task: CamundaTask): void {
    const role = this.getCurrentRole();
    const syllabusId = task.syllabusId;

    if (!syllabusId) {
      console.error('Ошибка: у задачи отсутствует syllabusId', task);
      alert('Ошибка: не удалось определить ID документа.');
      return;
    }

    if (task.taskDefinitionKey === 'Task_UploadSigned' || role === 'TEACHER') {
      this.router.navigate(['/signed-document', syllabusId], {
        queryParams: { taskId: task.id }
      });
      return;
    }

    if (role === 'LIBRARIAN') {
      this.router.navigate(['/syllabus/review/librarian', task.id], {
        queryParams: { syllabusId: syllabusId }
      });
    }
    else if (role === 'METHODOLOGIST') {
      this.router.navigate(['/syllabus', syllabusId, 'review'], {
        queryParams: { taskId: task.id }
      });
    }
    else if (role === 'ACADEMIC_DEPARTMENT') {
      this.router.navigate(['/syllabus/review/head', syllabusId], {
        queryParams: { taskId: task.id }
      });
    }
    else if (role === 'DEANERY') {
      this.router.navigate(['/syllabus/review/dean', syllabusId], {
        queryParams: { taskId: task.id }
      });
    }
    else {
      alert('У вашей роли нет прав доступа к экспертизе этого типа.');
    }
  }

  openTaskFix(task: CamundaTask): void {
    this.router.navigate(['/syllabus/edit', task.processInstanceId], {
      queryParams: { taskId: task.id }
    });
  }
}
