import { User } from '../User/User';
import { CourseVolume } from '../CourseVolume/CourseVolume';
import {Department} from '../Department/department';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SIGNED = 'SIGNED'
}

export interface Discipline {
  id?: number;
  name: string;
  courseCode: string;
  creditsEcts: number;
  department?: Department;
}

export interface AcademicLoad {
  id?: number;
  discipline: string;
  studentGroup: string;
  totalStreams: string;
  lectureHours: number;
  practiceHours: number;
  labHours: number;
  totalHours: number;
}

export interface PaymentDetails {
  id?: number;
  staffLoad: number;
  hourlyLoad: number;
}

export interface SyllabusDocument {
  id?: number;
  discipline?: Discipline;
  disciplineId?: number;
  status: DocumentStatus;
  academicYear: string;
  semester: number;
  description?: string;
  goals: string;
  courseCycle?: string;
  finalAssessment?: string;
  author?: User;
  courseVolume?: CourseVolume;
  weeklyTopics?: any[];

  academicLoads?: AcademicLoad[];
  paymentDetails?: PaymentDetails[];
}
