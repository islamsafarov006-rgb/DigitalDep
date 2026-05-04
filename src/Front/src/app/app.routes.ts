import { Routes } from '@angular/router';
import { authGuard } from './authGuard';
import { MainPageComponent } from './pages/main-page/main-page.component';

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
  {
    path: 'syllabus/:id/variables',
    loadComponent: () => import('./pages/syllabus-component/syllabus-variables-component/syllabus-variables.component')
      .then(m => m.SyllabusVariablesComponent)
  },
  {
    path: 'teacher-data',
    loadComponent: () => import('./pages/teacher-data-component/teacher-data.component').then(m => m.TeacherDataComponent),
    canActivate: [authGuard]
  },
  {
    path: 'syllabus',
    loadComponent: () => import('./pages/syllabus-component/discipline-editor.component').then(m => m.DisciplineEditorComponent),
    canActivate: [authGuard]
  },

  {
    path: 'create-disciplines',
    loadComponent: () => import('./pages/discipline-form/discipline-form.component').then(m => m.DisciplineFormComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];

