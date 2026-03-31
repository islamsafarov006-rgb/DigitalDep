import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    TranslocoModule
  ],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss'
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly translocoService = inject(TranslocoService);

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  changeLanguage(lang: string) {
    this.translocoService.setActiveLang(lang);
  }

  getActiveLang(): string {
    return this.translocoService.getActiveLang();
  }
}
