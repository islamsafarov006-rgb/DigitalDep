export enum AppealStatus {
    DRAFT = 'DRAFT',
    APPROVED = 'APPROVED',
    SIGNED = 'SIGNED',
    WAITING_CALIBRATION = 'WAITING_CALIBRATION',
    IN_CALIBRATION = 'IN_CALIBRATION',
    CALIBRATED = 'CALIBRATED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

export interface AppealStatusUpdateRequest {
    status: AppealStatus;
}

export interface EmployeeEvaluationAppealDto {
    id?: number;

    sessionId: number;
    employeeId: number;

    status: AppealStatus;
    type: 'B';

    resolverId?: number | null;
    resolvedAt?: string | null;

    resolverCommentRu?: string | null;
    resolverCommentKz?: string | null;

    orgId: number;
    orderId?: number | null;

    createdBy: number;

    createdDate?: string;
    modifiedDate?: string | null;

    appealItems: EmployeeEvaluationAppealItemDto[];
}

export interface EmployeeEvaluationAppealItemDto {
    id?: number;

    appealId?: number;
    detailId: number;

    reasonComment: string;

    originalRating?: number | null;
    originalComment?: string | null;

    requestedRating?: number | null;

    createdDate?: string;
}

export interface EmployeeEvaluationAppealCreateRequest {
    sessionId: number;
    employeeId: number;
    orgId: number;
    createdBy: number;

    type: 'B';

    decisionCommentKz: string,
    decisionCommentRu: string,
    orderId: number,

    appealItems: EmployeeEvaluationAppealItemCreateRequest[];
}

export interface EmployeeEvaluationAppealItemCreateRequest {
    detailId: number;
    reasonComment: string;
}
