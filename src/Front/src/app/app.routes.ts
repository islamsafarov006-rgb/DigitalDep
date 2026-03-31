import { Routes } from '@angular/router';
import { authGuard } from './authGuard';

export const routes: Routes = [
  {
    path: 'register',
    // Исправлена опечатка в названии файла .componen -> .component
    loadComponent: () => import('./pages/register-component/register.componen').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-component/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'teacher-data',
    // Путь к твоему новому компоненту, который мы создали
    loadComponent: () => import('./pages/teacher-data-component/teacher-data.component').then(m => m.TeacherDataComponent),
    canActivate: [authGuard] // Страница будет доступна только после логина
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/syllabus-component/syllabus-editor.component').then(m => m.SyllabusEditorComponent),
    canActivate: [authGuard] // Защита от неавторизованных
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**', // Обработка несуществующих путей (404)
    redirectTo: 'login'
  }
];
