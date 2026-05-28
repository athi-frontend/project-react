export interface VendorWorkflowActionData {
  context_id?: number;
  context_type?: string;
  new_status_id?: number;
  comment?: string;
  menu_id?: number;
  [key: string]: any;
}

export interface VendorWorkflowActionResponse {
  code: number;
  message: string;
  data: any;
  success: boolean;
}

