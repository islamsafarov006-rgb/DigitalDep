import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {GradingPolicyRow, WeeklyTopic} from './GradingPolicyAndWeeklyTopic';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}


  getWeeklyTopics(documentId: number): Observable<WeeklyTopic[]> {
    return this.http.get<WeeklyTopic[]>(`${this.apiUrl}/weekly-topics/document/${documentId}`);
  }

  saveWeeklyPlan(topics: WeeklyTopic[]): Observable<WeeklyTopic[]> {
    const payload = topics.map(t => ({
      ...t,
      document: { id: t.documentId }
    }));
    return this.http.post<WeeklyTopic[]>(`${this.apiUrl}/weekly-topics/batch`, payload);
  }

  updateTopic(id: number, topic: WeeklyTopic): Observable<WeeklyTopic> {
    return this.http.put<WeeklyTopic>(`${this.apiUrl}/weekly-topics/${id}`, topic);
  }

  updateTopicDetails(id: number, topic: WeeklyTopic): Observable<WeeklyTopic> {
    return this.http.put<WeeklyTopic>(`${this.apiUrl}/weekly-topics/${id}/details`, topic);
  }

  getGradingPolicy(syllabusId: number): Observable<GradingPolicyRow[]> {
    return this.http.get<GradingPolicyRow[]>(
      `${this.apiUrl}/grading-policies/syllabus/${syllabusId}`
    );
  }

  saveGradingPolicy(syllabusId: number, rows: GradingPolicyRow[]): Observable<GradingPolicyRow[]> {
    return this.http.post<GradingPolicyRow[]>(
      `${this.apiUrl}/grading-policies/syllabus/${syllabusId}`, rows
    );
  }
}
