import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {CourseVolume} from './CourseVolume';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CourseVolumeService {
  private apiUrl = `${environment.apiUrl}/course/value`;

  constructor(private http: HttpClient) {}


  getByDocumentId(docId: number): Observable<CourseVolume> {
    return this.http.get<CourseVolume>(`${this.apiUrl}/document/${docId}`);
  }

  save(volume: CourseVolume): Observable<CourseVolume> {
    return this.http.post<CourseVolume>(this.apiUrl, volume);
  }

  getAll(): Observable<CourseVolume[]> {
    return this.http.get<CourseVolume[]>(`${this.apiUrl}/all`);
  }
}
