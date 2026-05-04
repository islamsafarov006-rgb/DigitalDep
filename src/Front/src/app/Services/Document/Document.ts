import { User } from '../User/User';
import { Syllabus } from '../Syllabus/syllabus';
import { Department } from '../Department/department';

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

export interface PaymentDetail { // Убрал 's', чтобы совпадало с Java Entity
  id?: number;
  staffLoad: number;
  hourlyLoad: number;
}

export interface WeeklyTopic {
  id?: number;
  topicName: string; // добавьте поля согласно вашей Java WeeklyTopic Entity
  hours?: number;
}

export interface SyllabusDocument {
  id?: number;
  discipline: Discipline; // Убрал опциональность, так как в БД nullable=false
  status: DocumentStatus;
  academicYear: string;
  semester: number;
  author?: User;

  // Дочерние объекты
  syllabus?: Syllabus;
  academicLoads?: AcademicLoad[];
  paymentDetails?: PaymentDetail[];
  weeklyTopics?: WeeklyTopic[];
}
