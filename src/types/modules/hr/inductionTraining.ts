export interface InductionTrainingResponse {
  topic_id: number;
  topic: string;
  status: number;
  induction_training_topic_supporting_files: number | null;
  supporting_files_id: number | null;
  induction_id: number | null;
  conducted_by: number | null;
  conducted_on: string | null;
  is_complete: number | null;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  nickName: string;
  status: number;
  contact: Array<{
    contact_id: number;
    contact_type: string;
    contact: string;
  }>;
  roles: Array<{
    role_Id: number;
    role_name: string | null;
  }>;
  department_id: number;
  department_name: string;
  designation_id?: number;
  designation_name?: string;
  service_group_id?: number;
  service_group_name?: string;
  responsibility_id: number;
  responsibility: string;
}