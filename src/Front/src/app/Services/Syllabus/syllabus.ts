import { LibraryBook } from '../Library/Library';
import { AssessmentCriterion } from '../Document/Document';

export interface Syllabus {
  id?: number;
  status?: string;
  approvalRound?: number;

  // Данные согласования (бэкенд)
  librarianDecision?: string;
  librarianApprover?: string;
  librarianComments?: string;
  librarianDecidedAt?: string;

  academicDecision?: string;
  academicApprover?: string;
  academicComments?: string;
  academicDecidedAt?: string;

  headDecision?: string;
  headApprover?: string;
  headComments?: string;
  headDecidedAt?: string;

  deanDecision?: string;
  deanApprover?: string;
  deanComments?: string;
  deanDecidedAt?: string;

  // Основные поля
  academicProgramCode: string;
  academicProgramTitle: string;
  courseCycle: string;
  finalAssessment: string;
  numberOfCredits: number;
  groupOfAcademicPrograms: string;
  goals: string;
  objectives: string;
  learningOutcomes: string;
  courseDescription: string;
  coursePolicy: string;
  literature: LibraryBook[];
  assessmentCriteria: AssessmentCriterion[];
  examinationTopics: string;
}
