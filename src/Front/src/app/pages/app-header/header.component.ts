import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import {TranslocoService} from '@jsverse/transloco';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h2>Digital Department</h2>
      </div>

      <div class="header-right">
        <div class="lang-switcher">
          <button
            *ngFor="let lang of languages"
            type="button"
            class="lang-item"
            [class.active]="getActiveLang() === lang.code"
            (click)="changeLanguage(lang.code)">
            <span class="flag">{{ lang.flag }}</span>
            <span class="code">{{ lang.label }}</span>
          </button>
        </div>

        <div class="user-profile">
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  private translocoService = inject(TranslocoService);
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  readonly languages = [
    { code: 'ru', label: 'RU', flag: '🇷🇺' },
    { code: 'kk', label: 'KZ', flag: '🇰🇿' },
    { code: 'en', label: 'EN', flag: '🇺🇸' }
  ];

  changeLanguage(langCode: string) {
    this.translocoService.setActiveLang(langCode);
  }

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }
}
