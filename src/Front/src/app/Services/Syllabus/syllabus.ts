import { LibraryBook } from '../Library/Library';
import { AssessmentCriterion } from '../Document/Document';

export interface Syllabus {
  id?: number;
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
