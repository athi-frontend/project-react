/**
 * Classification : Confidential
 **/

export interface JigValidationDetail {
  id: string
  sno: number
  acceptanceCriteria: string
  expectedResult: string
  testObservation: string
  result: string
}

export interface JigsFixtureValidation {
  id: string
  jigType: string
  jigNo: string
  jigName: string
  status: string
  lastValidate?: string
  procedureOfValidation?: string
  scopeOfApplication?: string
  dateOfValidation?: string
  jigValidations: JigValidationDetail[]
}

export interface JigsFixtureValidationFormProps {
  validations: JigsFixtureValidation[]
  onValidationsChange: (validations: JigsFixtureValidation[]) => void
  assemblyPartItemDetailId?: number
  upsertMutation?: any
  isLoadingReports?: boolean
}



export interface AcceptanceCriteriaDetailItem {
  acceptance_criteria_id: number;
  acceptance_criteria: string;
  expected_result: string;
  status_id: number;
  status: string;
  status_slug: string;
}

export interface JigFixtureValidationItem { 
  jig_fixture_validation_id: number;
  jig_type_id: number;
  jig_type: string;
  status_id: number;
  status: string;
  status_slug: string;
  acceptance_criteria_detail?: AcceptanceCriteriaDetailItem[];
}

export interface JigFixtureValidationListResponse {
  data: JigFixtureValidationItem[];
}

export interface JigFixtureValidationByIdResponse {
  data: JigFixtureValidationItem[];
}

export interface AcceptanceCriteriaItem {
  id: string
  acceptance_criteria: string
  expected_result: string
  status: string
  status_id?: string
  acceptance_criteria_id?: number | string
}

export interface MainFormData {
  jigsType: string
  status: string
}

export interface AcceptanceCriteriaFormData {
  acceptanceCriteria: string
  expectedResult: string
  status: string
}

export interface MainFormErrors {
  jigsType?: string
  status?: string
  acceptanceCriteriaList?: string
}

export interface AcceptanceCriteriaFormErrors {
  acceptanceCriteria?: string
  expectedResult?: string
  status?: string
}

export interface JigsAndFixtureFormProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  projectId: number
  editId?: number | null
}

export interface AcceptanceCriteriaDetail {
  acceptance_criteria_id?: number
  acceptance_criteria: string
  expected_result: string
  status: number
}

export interface JigFixtureValidationUpsertRequest {
  jig_fixture_validation_id?: number
  project_id: number
  jig_type_id: number
  acceptance_criteria_detail: AcceptanceCriteriaDetail[]
  status: number
}

export interface JigFixtureValidationUpsertResponse {
  data: JigFixtureValidationItem
  message?: string
}
export interface StatusApiResponse {
  status_id: number;
  status_name: string;
}
