export interface Faculty {
  id?: number;
  name: string;
}

export interface Department {
  id?: number;
  name: string;
  facultyId?: number;
  faculty?: Faculty;
}
