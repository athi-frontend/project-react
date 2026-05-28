// Common types used across regulation modules

// Meta info types for workflow action control
export interface ActionControl {
  formId: number;
  menuId: number;
  formName: string;
  formType: string;
  permissions: Array<{
    action: string;
    trigger_status_id?: number;
  }>;
}

export interface TaskInfo {
  task_comments: Array<{
    id: number;
    comment: string;
    created_by: string;
    created_at: string;
  }>;
  reviewer_list: Array<{
    user_id: number;
    first_name: string;
    last_name: string;
    full_name: string;
  }>;
}

export interface MetaInfo {
  action_control: ActionControl;
  task_info: TaskInfo;
}
