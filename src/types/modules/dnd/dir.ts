
export interface PopupFormProps {
  open: boolean;
  onSave: (data: DesignInputFormData) => void;
  onClose: () => void;
  initialData?: DesignInputFormData;
  projectId?: number;
}

export interface DesignInputFormData {
  isUnambiguous: string;
  isverified: string;
  isRetested: string;
  isCompleted: string;
  dirConfict: string[];
  conflictRemarks: string;
  verifiableRemarks: string;
  completeRemarks: string;
}
