// API Response Types
export interface ProjectTypeModule {
  project_type_id: number[]
  module_name: string
}

export interface ProjectTypeModuleResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: ProjectTypeModule[]
}

export interface UserTaskStatus {
  status_id: number
  status_name: string
  assigned_date: string | null
}

export interface TaskTransition {
  project_name: string
  task_name: string
  user_task_status: UserTaskStatus
  task_url?: string
}

export interface TaskTransitionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: TaskTransition[]
}

export interface TaskTransitionRequestPayload {
  project_type_id: number[]
  user_id: number | null
}

export interface CombinedTaskData {
  module_name: string
  project_type_ids: number[]
  tasks: TaskTransition[]
}

export interface CombinedTaskResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: CombinedTaskData[]
}

// UI Component Types
export interface UserData {
  id: number
  sno: number
  task: string
  projectName: string
  moduleName: string
  taskDescription: string
  assignedDate: string | null
  status: string
}

export interface ControlBarProps {
  currentPage: number
  currentPageTitle: string
  allPages: string[]
  onPageChange: (page: number) => void
  onSearchChange?: (value: string) => void
  searchValue?: string
  disabled?: boolean
}
