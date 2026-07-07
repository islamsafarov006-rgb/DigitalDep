import { Router, Routes } from '@angular/router';
import { authGuard } from './authGuard';
import { MainPageComponent } from './pages/MainPageComponent/main-page.component';
import { AuthService } from './Services/AuthService/AuthService';
import { ReviewDashboardComponent } from './pages/ReviewDashboardСomponent/review-dashboard.component';
import { inject } from '@angular/core';
import { TeachersDisciplinesComponent } from './pages/TeachersDisciplinesСomponent/teachers-disciplines.component';
import { SignedDocumentComponent } from './pages/SyllbausCamundaProcess/SignedDocumentСomponent/signed-document.component';
import { SyllabusReviewComponent } from './pages/SyllbausCamundaProcess/ReviewComponent/syllabus-review.component';
import { DeanReviewComponent } from './pages/SyllbausCamundaProcess/DeanReviewComponent/dean-review.component';
import {LibrarianReviewComponent} from './pages/SyllbausCamundaProcess/LibrarianReviewComponent/Librarian review.component';
import {FeedbackHistoryComponent} from './pages/FeedbacksComponents/FeedbackHistoryComponent/feedback-history.component';
import {TeacherDataComponent} from './pages/TeacherDataComponent/teacher-data.component';
import {
  AcademicReviewComponent
} from './pages/SyllbausCamundaProcess/AcademicReviewComponent/academic-review.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./pages/RegisterComponent/register.componen').then(m => m.RegisterComponent)
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
  {
    path: 'teacher-data',
    component: TeacherDataComponent,
    canActivate: [authGuard]
  },

  {
    path: 'syllabus/review/librarian/:taskId',
    component: LibrarianReviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'syllabus/:id/review', //  Теперь совпадает с .paramMap.get('id')
    component: AcademicReviewComponent
  },
  {
    path: 'syllabus/review/head/:id',
    component: DeanReviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'syllabus/review/dean/:id',
    component: DeanReviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'syllabus/:id/variables',
    loadComponent: () => import('./pages/SyllbausCamundaProcess/SyllabusVariablesComponent/syllabus-variables.component')
      .then(m => m.SyllabusVariablesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/DisciplineEditorComponent/discipline-editor.component')
      .then(m => m.DisciplineEditorComponent),
    canActivate: [authGuard]
  },
  {
    path: 'feedback-history',
    component: FeedbackHistoryComponent
  },
  {
    path: 'approval-dashboard',
    component: ReviewDashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'signed-document/:id',
    component: SignedDocumentComponent,
    canActivate: [authGuard]
  },

  {
    path: 'management/assign',
    loadComponent: () => import('./pages/AssignHoursComponent/assign-hours.component').then(m => m.AssignHoursComponent),
    canActivate: [authGuard, () => {
      const authService = inject(AuthService);
      const router = inject(Router);
      if (authService.hasRole(['ADMIN'])) return true;
      router.navigate(['/main-page']);
      return false;
    }]
  },
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
