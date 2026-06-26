import { Router, Routes } from '@angular/router';
import { authGuard } from './authGuard';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { AuthService } from './Services/AuthService/AuthService';
import { ReviewDashboardComponent } from './pages/ReviewDashboardСomponent/review-dashboard.component';
import { LibrarianReviewComponent } from './pages/SyllbausCamundaProcess/LibrarianReviewComponent/Librarian review.component';
import { DeanReviewComponent } from './pages/SyllbausCamundaProcess/DeanReviewComponent/dean-review.component';
import { inject } from '@angular/core';
import { AcademicReviewComponent } from './pages/SyllbausCamundaProcess/AcademicReviewComponent/academic-review.component';
import { TeachersDisciplinesComponent } from './pages/TeachersDisciplinesСomponent/teachers-disciplines.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-component/register.componen').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'main-page',
    component: MainPageComponent,
    canActivate: [authGuard]
  },

  // Маршруты для согласования
  {
    path: 'syllabus/review/librarian/:id',
    component: LibrarianReviewComponent
  },
  {
    path: 'syllabus/review/dean/:id',
    component: DeanReviewComponent
  },
  {
    path: 'syllabus/review/academic/:id',
    component: AcademicReviewComponent
  },
  {
    path: 'syllabus/:id/variables',
    loadComponent: () => import('./pages/SyllbausCamundaProcess/syllabus-variables-component/syllabus-variables.component')
      .then(m => m.SyllabusVariablesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/discipline-editor-component/discipline-editor.component')
      .then(m => m.DisciplineEditorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'approval-dashboard',
    component: ReviewDashboardComponent
  },

  // Панель управления (Management)
  {
    path: 'management/assign',
    loadComponent: () => import('./pages/assign-hours/assign-hours.component').then(m => m.AssignHoursComponent),
    canActivate: [authGuard, () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.hasRole(['ADMIN'])) return true;
      router.navigate(['/main-page']);
      return false;
    }]
  },
  // 🌟 ПЕРЕНЕСЛИ СЮДА: Теперь роут находится выше, чем '**', и защищен проверкой на роль ADMIN
  {
    path: 'management/teachers-disciplines',
    component: TeachersDisciplinesComponent,
    canActivate: [authGuard, () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.hasRole(['ADMIN'])) return true;
      router.navigate(['/main-page']);
      return false;
    }]
  },

  { path: '**', redirectTo: 'login' }
];
