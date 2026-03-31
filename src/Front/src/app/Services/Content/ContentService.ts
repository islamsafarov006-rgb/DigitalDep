import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {GradingPolicy, WeeklyTopic} from './GradingPolicyAndWeeklyTopic';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  saveWeeklyPlan(topics: WeeklyTopic[]): Observable<WeeklyTopic[]> {
    return this.http.post<WeeklyTopic[]>(`${this.apiUrl}/weekly-topics/batch`, topics);
  }

  saveGradingPolicy(policy: GradingPolicy): Observable<GradingPolicy> {
    return this.http.post<GradingPolicy>(`${this.apiUrl}/grading-policies`, policy);
  }
}
