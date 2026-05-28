export interface RegulationWorkflowActionData {
  context_id?: number;
  context_type?: string;
  new_status_id?: number;
  comment?: string;
  menu_id?: number;
  [key: string]: any;
}

export interface RegulationWorkflowActionResponse {
  code: number;
  message: string;
  data: any;
  success: boolean;
}
