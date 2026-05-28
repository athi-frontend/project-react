
import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface InstallationItem {
  id?:number
  installation_procedure_id: number;
  step_counter: string;
  type: string;
  status: string;
}

export interface InstallationProcedure {
  project_id: number;
  // installation_procedure_id: number;
  type: string;
  tools: string[];
  equipment: string[];
  skills: string[];
  safety_and_precautions: string;
  description: string;
  uploadedFile: File[] | FileDocument[];
  documents: File[] | FileDocument[];
}