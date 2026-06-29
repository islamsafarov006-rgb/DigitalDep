import { Component, inject, OnInit, computed, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { TranslocoService } from '@jsverse/transloco';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private translocoService = inject(TranslocoService);
  private authService = inject(AuthService);

  user = computed(() => this.authService.currentUser());

  userAvatarLetter = computed(() => {
    const fio = this.user()?.fio;
    return fio ? fio.charAt(0).toUpperCase() : 'U';
  });

  readonly languages = [
    { code: 'ru', flag: '🇷🇺', name: 'Русский' },
    { code: 'kk', flag: '🇰🇿', name: 'Қазақша' },
    { code: 'en', flag: '🇺🇸', name: 'English' }
  ];

  isVisible = signal(true);
  langMenuOpen = false;

  // Безопасное закрытие дропдауна при клике в любое другое место экрана
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lang-dropdown')) {
      this.langMenuOpen = false;
    }
  }

  ngOnInit() {
    this.updateVisibility(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateVisibility(event.urlAfterRedirects);
    });
  }

  private updateVisibility(url: string) {
    const hiddenRoutes = ['/login', '/register'];
    this.isVisible.set(!hiddenRoutes.some(route => url.startsWith(route)));
  }

  openFeedback() {
    this.router.navigate(['/feedback-history']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeLanguage(langCode: string) {
    this.translocoService.setActiveLang(langCode);
    this.langMenuOpen = false;
  }

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }

  getActiveLangFlag(): string {
    const currentCode = this.getActiveLang();
    const lang = this.languages.find(l => l.code === currentCode);
    return lang ? lang.flag : '🌐';
  }
}
