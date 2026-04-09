import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import {AuthService} from './Services/AuthService/AuthService';
import {HeaderComponent} from './pages/app-header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);


  public showSidebar: boolean = false;

  constructor() {

    effect(() => {

      this.updateSidebarVisibility();
    });
  }

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSidebarVisibility();
    });
  }

  private updateSidebarVisibility() {
    const currentUrl = this.router.url;
    // Убираем '/', если после входа пользователь попадает на корень
    const authPages = ['/login', '/register'];

    const isAuthPage = authPages.some(page => currentUrl.startsWith(page));

    // Проверяем токен или состояние из сервиса
    const hasToken = !!localStorage.getItem('auth_token');

    // Хедер показываем, если это НЕ страница авторизации И у нас есть токен
    this.showSidebar = !isAuthPage && hasToken;
  }


}
