export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  METHODOLOGIST = 'METHODOLOGIST',
  DEAN = 'DEAN'
}

export interface User {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  position: string;
  iin: string;
  role: UserRole;
  departmentId?: number;


}
