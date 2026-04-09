export interface WeeklyTopic {
  weekNumber: number;
  lecture: string;
  practice: string;
  srsp: string;
  spz: string;
}
export interface GradingPolicy {
  id?: number;
  firstAttestationWeight: number;
  secondAttestationWeight: number;
  finalExamWeight: number;
  attendancePolicy: string;
  documentId: number;
}
