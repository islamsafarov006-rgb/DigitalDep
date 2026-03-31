import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header-card">
      <div class="user-profile">
        @if (authService.currentUser()) {
          <div class="user-avatar">
            {{ authService.currentUser()?.fio?.charAt(0) }}
          </div>
          <div class="user-details">
            <h1>{{ authService.currentUser()?.fio }}</h1>
            <span class="code-badge">{{ authService.currentUser()?.position }}</span>
          </div>
        } @else {
          <h1>Цифровая кафедра</h1>
        }
      </div>

      @if (authService.currentUser()) {
        <button type="button" class="logout-link" (click)="logout()">
          <span class="icon">🚪</span> Выйти
        </button>
      }
    </header>
  `,
  styleUrl: './header.component.scss' // Перенесите сюда стили хедера
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
