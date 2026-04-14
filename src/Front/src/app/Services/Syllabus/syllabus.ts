
import {LibraryBook} from '../Library/Library';

export interface Syllabus {
  id?: number;
  academicProgramCode: string;
  academicProgramTitle: string;
  courseCycle: string;
  finalAssessment: string;
  goals: string;
  courseDescription: string;
  coursePolicy: string;
  literature: LibraryBook[];
  examinationTopics: string;
}
