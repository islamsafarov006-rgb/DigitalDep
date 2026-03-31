import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';

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

  private restoreSession() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.decodeToken(token);
    }
  }

  private decodeToken(token: string) {
    try {
      const payloadBase64 = token.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded = JSON.parse(jsonPayload);
      this.currentUser.set(decoded);
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
}


