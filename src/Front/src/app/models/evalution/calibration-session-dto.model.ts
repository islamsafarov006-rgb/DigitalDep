export interface CalibrationSessionAppeal {
    employeeId: number;
    fullName: string;
    departmentKz: string;
    departmentRu: string;
    positionRu: string;
    positionKz: string;
    appealId: number;
    type: string;
    year: number;
    quarter: number;
    createdDate: Date;
    status: string;
}

export enum CalibrationRole {
    CHAIRMAN = "CHAIRMAN",
    SECRETARY = "SECRETARY",
    MEMBER = "MEMBER"
}

export enum CalibrationStatus {
    DRAFT = "DRAFT",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}

export interface EmployeeEvaluationCalibrationSessionMemberDto {
    memberUserId: number;
    role: CalibrationRole;
}

export interface EmployeeEvaluationCalibrationSessionCreateDto {
    orgId: number;
    orderId: number;
    sessionDate: string;
    sessionTime: string;
    members: EmployeeEvaluationCalibrationSessionMemberDto[];
    appeals: number[];
}

export interface EmployeeEvaluationCalibrationSessionUpdateDto {
    sessionDate: string;
    sessionTime: string;
    members: EmployeeEvaluationCalibrationSessionMemberDto[];
    appealIds: number[];
}

export interface EmployeeEvaluationCalibrationSessionDto {
    id: number;
    orgId: number;
    orderId: number;
    status: CalibrationStatus;
    sessionDate: string;
    sessionTime: string;
    members: EmployeeEvaluationCalibrationSessionMemberDto[];
    appeals: CalibrationSessionAppeal;
}
