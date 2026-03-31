import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Department, Faculty} from './FacultyAndDep';


@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/faculties`);
  }

  getDepartmentsByFaculty(facultyId: number): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments/faculty/${facultyId}`);
  }
}
