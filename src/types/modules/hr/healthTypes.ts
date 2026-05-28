export interface FileInfo {
  id: string | number;
  uuid?: string;
  name: string;
  source: string;
  uploadDate: string;
  category: string;
  status: string | number;
  description?: string;
  purpose?: string;
  categoryId?: number;
  created_date?: string;
  tags?: string[];
  file?: File | null;
  newFileName?: string;
}

export interface SectionData {
  description: string;
  files: FileInfo[];
}

export interface Sites{
   id: string; 
   name: string 
}

export interface HealthCheckupFormData {
  employeeInfo: {
    name: string;
    role: string;
    department: string; 
    lastSubmittedDate: string;
  };
  eyeTest: SectionData;
  communicableDisease: SectionData;
  vaccinations: SectionData;
}

export const initialFormData: HealthCheckupFormData = {
  employeeInfo: {
    name: "Employee name",
    role: "Role",
    department: "Department",
    lastSubmittedDate: "Last Submitted Date",
  },
  eyeTest: {
    description: "",
    files: [],
  },
  communicableDisease: {
    description: "",
    files: [],
  },
  vaccinations: {
    description: "",
    files: [],
  },
};

export interface HealthCheckupResponse {
  health_checkup_id: number;
  last_submitted_date: string;
  employee_department_id: number;
  employee_role_id: number;
  employee_role_name?: string;
  eye_test_description: string | null;
  communicable_disease_description: string | null;
  vaccinations_description: string | null;
  eye_test_supporting_document: FileInfo[];
  communicable_disease_supporting_document: FileInfo[];
  vaccination_supporting_document: FileInfo[];
  status: number;
  employee_name: string;
}

export interface DepartmentResponse {
  department_id: number;
  department_name: string;
  status: number;
}

export interface DocumentStructure {
  documents_to_create: File[];
  documents_to_delete: string[];
  create_meta_data: Record<string, any>;
  update_meta_data: Record<string, any>;
  local_files_to_delete: string[];
}

export interface HealthCheckupDeclarationProps {
  mode: "add" | "edit";
  id?: string;
}

export type UploadSections = 'eyeTest' | 'communicableDisease' | 'vaccinations';

export interface SectionConfig {
  key: keyof Omit<HealthCheckupFormData, 'employeeInfo'>;
  header: string;
  errorKey: string;
  fieldName: string;
  tableName: string;
}
