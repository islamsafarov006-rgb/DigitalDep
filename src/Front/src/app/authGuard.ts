import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    // Токен есть — пропускаем пользователя
    return true;
  } else {
    // Токена нет — перенаправляем на логин
    router.navigate(['/login']);
    return false;
  }
};
