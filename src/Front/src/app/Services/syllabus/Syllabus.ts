
import {User} from '../User/User';
import {CourseVolume} from '../CourseVolume/CourseVolume';
import {Department} from '../Department/department';

export type DocumentStatus = 'DRAFT' | 'PENDING' | 'SIGNED' | 'REJECTED';

export interface Discipline {
  id?: number;
  name: string;
  courseCode: string;
  creditsEcts: number;
  department?: Department;
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
}
