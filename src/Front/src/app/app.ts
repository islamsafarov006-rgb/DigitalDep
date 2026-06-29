import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './Services/AuthService/AuthService';
import { HeaderComponent } from './pages/AppHeaderComponent/header.component';
import {FeedbackWidgetComponent} from './pages/FeedbacksComponents/FeedbackWidgetComponent/feedback-widget.component';
// 🌟 Импортируй свой виджет (проверь и скорректируй путь к файлу, если нужно)

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FeedbackWidgetComponent // 🌟 Добавили в импорты
  ],
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
    const authPages = ['/login', '/register'];
    const isAuthPage = authPages.some(page => currentUrl.startsWith(page));
    const hasToken = !!localStorage.getItem('auth_token');
    this.showSidebar = !isAuthPage && hasToken;
  }
}
