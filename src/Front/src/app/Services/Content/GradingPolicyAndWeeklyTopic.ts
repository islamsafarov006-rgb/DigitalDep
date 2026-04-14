export interface WeeklyTopic {
  id?: number;
  documentId?: number;
  weekNumber: number;
  lectureTopic: string;
  practiceTopic: string;
  srspTopic: string;
  spzTopic: string;
  hours?: number;
  references?: string;
  reportingForm?: string;
  deadline?: string;
}

export interface GradingPolicy {
  id?: number;
  firstAttestationWeight: number;
  secondAttestationWeight: number;
  finalExamWeight: number;
  attendancePolicy: string;
  documentId: number;
}
