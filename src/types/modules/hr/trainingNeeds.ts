import { FileDocument } from "@/types/components/ui/fileUploadV3";

export interface TrainingNeedsList {
  training_needs_id: number ;
  skill_name: string;
  target_date: Date;
  creation_date: Date;
  created_by: string;
  status: number;
  source: string
}

export interface TrainingNeedsForm{
  skill: string;
  source: string;
  employee: string[];
  dateOfJoining: string;
  uploadedFile: File[] | FileDocument[];
}


export interface FormErrors {
  skill?: string;
  source?: string;
  employee?: string;
  dateOfJoining?: string;
}