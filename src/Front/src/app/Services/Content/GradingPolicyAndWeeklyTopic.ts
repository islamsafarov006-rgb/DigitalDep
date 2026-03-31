export interface WeeklyTopic {
  id?: number;
  weekNumber: number;
  lectureTopic: string;
  practiceTopic: string;
  documentId: number;
}

export interface GradingPolicy {
  id?: number;
  firstAttestationWeight: number;
  secondAttestationWeight: number;
  finalExamWeight: number;
  attendancePolicy: string;
  documentId: number;
}
