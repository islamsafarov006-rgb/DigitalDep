import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'https://hence-mediterranean-person-forming.trycloudflare.com/api/auth';

  currentUser = signal<any>(null);

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  login(credentials: { iin: string, password: string }) {
    return this.http.post(`${this.API_URL}/login`, credentials, { responseType: 'text' })
      .pipe(
        tap(token => {
          localStorage.setItem('auth_token', token);
          this.decodeToken(token);
        })
      );
  }

  getCurrentRole(): string {
    const user = this.currentUser();
    return user?.role ? user.role.toString().trim().toUpperCase() : 'GUEST';
  }

  getCurrentUserName(): string {
    const user = this.currentUser();
    return user?.fio ?? 'Неизвестный пользователь';
  }

  // 🌟 ДОБАВЛЕНО: Метод извлечения почты из сохраненного JWT-токена
  getCurrentUserEmail(): string {
    const user = this.currentUser();
    return user?.email ?? 'no-email@muit.edu.kz';
  }

  hasRole(allowedRoles: string[]): boolean {
    const user = this.currentUser();
    if (!user || !user.role) return false;
    const cleanRole = user.role.toString().trim().toUpperCase();
    const cleanAllowedRoles = allowedRoles.map(role => role.trim().toUpperCase());
    return cleanAllowedRoles.includes(cleanRole);
  }

  private restoreSession() {
    const token = localStorage.getItem('auth_token');
    if (token) this.decodeToken(token);
  }

  private decodeToken(token: string) {
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      this.currentUser.set(JSON.parse(jsonPayload));
    } catch (e) {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.currentUser.set(null);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData);
  }

  getAllTeachers(): Observable<any[]> {
    return this.http.get<any[]>('https://hence-mediterranean-person-forming.trycloudflare.com/api/users/teachers');
  }
}
