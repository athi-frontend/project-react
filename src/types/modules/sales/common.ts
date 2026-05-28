/**
 * Common types for Sales module
 * Classification: Confidential
 */

export interface ActionControl {
  formId?: number;
  menuId?: number;
  formName?: string;
  formType?: string;
  permissions: Array<{ action: string; trigger_status_id?: number }>;
}

export interface TaskComment {
  comment: string;
  date: string;
  ref_id: number | null;
  comment_type: string | null;
  comment_order: number | null;
  user_id: number;
  firstName: string;
  lastName: string;
}

export interface Reviewer {
  user_id: number;
  first_name: string;
  last_name: string;
}

export interface TaskInfo {
  task_comments: Array<TaskComment>;
  reviewer_list: Array<Reviewer>;
  task_id?: number;
}

export interface MetaInfo {
  action_control?: ActionControl;
  task_info?: TaskInfo;
}

