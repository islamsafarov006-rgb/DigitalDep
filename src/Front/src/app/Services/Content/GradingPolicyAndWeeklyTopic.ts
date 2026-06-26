export interface WeeklyTopic {
  id?: number;
  documentId?: number;
  document?: { id: number };
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

export interface GradingPolicyRow {
  id?: number;
  period: string;
  assignmentName: string;
  subItem: boolean;
  bold: boolean;
  score: number | null;
  total: number | null;
  sortOrder: number;
}
