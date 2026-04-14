import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GradingPolicy, WeeklyTopic } from './GradingPolicyAndWeeklyTopic';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}


  getWeeklyTopics(documentId: number): Observable<WeeklyTopic[]> {
    return this.http.get<WeeklyTopic[]>(`${this.apiUrl}/weekly-topics/document/${documentId}`);
  }

  saveWeeklyPlan(topics: WeeklyTopic[]): Observable<WeeklyTopic[]> {
    return this.http.post<WeeklyTopic[]>(`${this.apiUrl}/weekly-topics/batch`, topics);
  }

  updateTopic(id: number, topic: WeeklyTopic): Observable<WeeklyTopic> {
    return this.http.put<WeeklyTopic>(`${this.apiUrl}/weekly-topics/${id}`, topic);
  }

  updateTopicDetails(id: number, topic: WeeklyTopic): Observable<WeeklyTopic> {
    return this.http.put<WeeklyTopic>(`${this.apiUrl}/weekly-topics/${id}/details`, topic);
  }

  getGradingPolicy(documentId: number): Observable<GradingPolicy> {
    return this.http.get<GradingPolicy>(`${this.apiUrl}/grading-policies/document/${documentId}`);
  }

  saveGradingPolicy(policy: GradingPolicy): Observable<GradingPolicy> {
    return this.http.post<GradingPolicy>(`${this.apiUrl}/grading-policies`, policy);
  }
}
