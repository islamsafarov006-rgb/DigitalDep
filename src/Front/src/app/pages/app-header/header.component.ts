import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationEnd, Router, RouterModule} from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { TranslocoService } from '@jsverse/transloco';
import { MatFormField } from '@angular/material/form-field'; // Исправлен импорт
import { MatOption, MatSelect, MatSelectTrigger } from '@angular/material/select';
import {filter} from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatFormField, MatSelect, MatOption, MatSelectTrigger],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private translocoService = inject(TranslocoService);
  private authService = inject(AuthService);

  user = this.authService.currentUser();

  readonly languages = [
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'kk', flag: '🇰🇿', name: 'Қазақша' },
    { code: 'en', flag: '🇺🇸', name: 'English' }
  ];
  isVisible = true
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const hiddenRoutes = ['/login', '/register'];
      this.isVisible = !hiddenRoutes.includes(this.router.url);
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLanguage(langCode: string) {
    this.translocoService.setActiveLang(langCode);
  }

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }

  // Тот самый недостающий метод
  getActiveLangFlag(): string {
    const currentCode = this.getActiveLang();
    const lang = this.languages.find(l => l.code === currentCode);
    return lang ? lang.flag : '🌐';
  }
}
