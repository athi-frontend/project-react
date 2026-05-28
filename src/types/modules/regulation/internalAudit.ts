export interface InternalAuditSelfInspectionPayload {
  organization_site_id: number;
  internal_audit_description: string;
}

export interface InternalAuditSelfInspectionResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  data: InternalAuditSelfInspectionPayload[];
} 