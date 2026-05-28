/**
 Classification : Confidential
**/

export interface ValidationDocument {
  id: number;
  document: string;
}

export interface FormState {
  data: {
    validationPlanDetails: string;
    purposeOfValidation: string;
    numberOfUnits: string;
    periodOfUsage: string;
    unitConfiguration: string;
    functionInvolved: string;
    validationPlaces: any;
    validationDocuments: any;
    basicModel: string;
  };
  errors: {
    validationPlanDetails: string;
    purposeOfValidation: string;
    numberOfUnits: string;
    periodOfUsage: string;
    unitConfiguration: string;
    functionInvolved: string;
    validationPlaces: string;
    validationDocuments: string;
    basicModel: string;
    feedbackFilesError: string;
  };
}

export interface FileMetaData {
  fileName: string;
  source: string;
  date_of_upload: string;
  categoryId: number;
  purpose: string;
  file_status: number;
  tags: string[];
  file_type: 'supporting_document' | 'feedback';
}

export interface FileUpdateMetaData {
  fileName: string;
  source: string;
  date_of_upload: string;
  categoryId: number;
  purpose: string;
  file_status: number;
  tags: string[];
}

export interface Rows{ id: number; name: string }
