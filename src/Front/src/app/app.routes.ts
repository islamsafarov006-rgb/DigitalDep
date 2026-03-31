import { Routes } from '@angular/router';
import { authGuard } from './authGuard';

export const routes: Routes = [
  {
    path: 'register',

    loadComponent: () => import('./pages/register-component/register.componen').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'teacher-data',

    loadComponent: () => import('./pages/teacher-data-component/teacher-data.component').then(m => m.TeacherDataComponent),
    canActivate: [authGuard]
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/syllabus-component/syllabus-editor.component').then(m => m.SyllabusEditorComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
