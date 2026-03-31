import {Faculty} from '../organization/Faculty';

export interface Department {
  id: number;
  nameRu: string;
  nameKk: string;
  nameEn: string;
  facultyId?: number;
  faculty?: Faculty;
}


