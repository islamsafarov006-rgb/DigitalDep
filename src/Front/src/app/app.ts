import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs';
import {SidebarComponent} from './pages/sidebar/sidebar-component';
import {AuthService} from './Services/AuthService/AuthService';
import {HeaderComponent} from './pages/app-header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // Публичная переменная для шаблона
  public showSidebar: boolean = false;

  constructor() {
    // Используем effect, чтобы следить за изменениями пользователя в AuthService
    effect(() => {
      // Как только пользователь в сигнале меняется (логин/логхаут), обновляем видимость
      this.updateSidebarVisibility();
    });
  }

  ngOnInit() {
    // Следим за сменой страниц
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSidebarVisibility();
    });
  }

  private updateSidebarVisibility() {
    const currentUrl = this.router.url;
    const authPages = ['/login', '/register', '/'];

    // ПРОВЕРКА 1: Мы НЕ на странице входа
    const isNotAuthPage = !authPages.includes(currentUrl);

    // ПРОВЕРКА 2: Токен есть в localStorage (используем твой ключ auth_token)
    const hasToken = !!localStorage.getItem('auth_token');

    this.showSidebar = isNotAuthPage && hasToken;
  }


}
