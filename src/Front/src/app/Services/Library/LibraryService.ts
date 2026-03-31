import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import {LibraryBook} from './Library';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private apiUrl = `${environment.apiUrl}/library`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<LibraryBook[]> {
    return this.http.get<LibraryBook[]>(this.apiUrl);
  }

  search(query: string): Observable<LibraryBook[]> {
    return this.http.get<LibraryBook[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }

  addToDatabase(book: LibraryBook): Observable<LibraryBook> {
    return this.http.post<LibraryBook>(this.apiUrl, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
