export interface ClauseApplicabilityData {
  project_applicable_clause_id: string
  id: string; 
  clause_name: string;
  task_description: string;
  completion_status: string; 
  conductedby: string; 
  user_id: string; 
  assign_to?: number;
  is_checked: number
}