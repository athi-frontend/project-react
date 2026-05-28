import { NUMBERMAP } from "@/constants/common"


export const ERRORS = {
  TRAINING_TITLE_ERROR: 'Title of Training is required',
  DATE_ERROR: 'Date is Required',
  MODE_OF_TRAINING_ERROR: 'Mode of Training is required',
  NAME_OF_TRAINING_ERROR: 'Name of Trainer is required',
  COMPENTENCY_TRAINER_ERROR: 'Competency of Trainer is required',
  AT_LEAST_ONE_ATTENDEE: 'At least one attendee is required.',
  AT_LEAST_ONE_SKILL: 'At least one skill is required.',
}
export const NAME_CONSTANT='Name'
export const FIELDS = {
  S_NO: 'sno',
  TITLE: 'title',
  DATE: 'date_of_training',
  FULL_NAME: 'fullName',
  LOCATION: 'location',
  ACTION: 'action',
}

export const TITLE = 'Training Schedule'
export const LABEL = 'Title of Training*'
export const DATE = 'Date*'
export const MODE_OF_TRAINING = 'Mode of Training*'

export const API_ENDPOINTS = {
  FETCH_ALL: 'api/v1/hrcs/training-schedule/all',
  FETCH_SCHEDULE_BY_ID: (scheduleId: number) => `api/v1/hrcs/training-schedule/${scheduleId}`,
}

export const FILE_SECTION_TABLES = {
  training_documents: 'eqms_hr_training_materials_supporting_file',
  certificate_documents: 'eqms_hr_training_certificate_supporting_file',
}

export const DELETE_CLASS = '.data-grid-delete'

export const HEADER_NAME = {
  TITLE_TRAINING: 'Title of Training',
  DATE_TRAINING: 'Training Date',
  NAME_OF_TRAINER: 'Name of Trainer',
  LOCATION: 'Location',
  ACTION: 'Actions',
  SNO: 'S.No',
}

export const CLASS_NAME = 'data-grid-delete'
export const TITLE_OF_TRAINING = 'Training Schedule'
export const CONTAINER_ID = 'HR_TRAINING_SCHEDULE'
export const ID_FIELD = 'id'

export const ROUTER_PATH = {
  EDIT_LIST: '/hr/training-schedule/',
  CREATE_PATH: '/hr/training-schedule/create',
}

export const DATA_SOURCE_NAME = {
  TRAINING_SCHEDULE: 'eqms_hr_training_schedule',
  TRAINING_ATTENDEE:'eqms_hr_training_attendee',
  TRAINING_SKILL:'eqms_hr_training_skill'
}

export const DATA_FIELD_NAME = {
  STATUS: 'status',
}

export const PLACE_HOLDERS = {
  TRAINING: 'Enter Title of Training',
  MODE: 'Enter Mode of Training',
  TRAINER: 'Select Trainer',
  COMPETENCY: 'Enter Competency',
  TRAINING_MATERIALS: 'Enter Training Materials',
  LOCATION: 'Enter Location',
  ATTENDEE: 'Select Attendee',
  SKILL: 'Select Skill',
   ATTENDEES     :"Select Attendee"
}
export const ATTENDEES='Attendees*'
export const SKILL='Skills*'
export const DEFAULT_FORM = {
    title: '',
    date_of_training: null,
    mode: '',
    trainer: '',
    competency: '',
    training: '',
    Location: '',
    skills:'',
    attendee:'',
    isEvaluated: NUMBERMAP.ZERO
}
export const DEFAULT_ATTENDEE = { id: null, name: '', Department: '', employeeId: '' }
export const TRAINING_DOCUMENTS='training_documents'
export const CERTIFICATE_DOCUMENTS='certificate_documents'
export const CERTIFICATE_ERR ='certificateFileError'
export const SUPPORT_ERR ='supportingFileError'
export const EDIT_SKILL='Edit Skill'
export const ADD_SKILL='Add Skill'
export const DELETE='delete'
export const TRAINER='trainer'
export const DATA_FIELD_NAMES={
  SKILL:'fk_eqms_hr_skill_master_id',
  TITLE:'title',
  DATE_TRAINING:'date_of_training',
  MODE_TRAINING:'mode_of_training',
  EMPLOYEE_ID_FIELD:'fk_eqms_organization_employee_id',
  COMPETENCY_TRAINING  :'trainer_competency',
  TRAINING_MATERIALS:'training_materials',
  LOCATION_FIELD:'location',
  ORGANIZATION_ID:'fk_eqms_organization_employee_id',
  SKILL_MASTER:'fk_eqms_hr_skill_master_id',
  COMPETENCY:'trainer_competency'
  }
  export const KEY_FIELDS={
    SKILL_ID_KEY:"skill_id",
    ID:"id",
  }
  export const VALUE_FIELDS={
    EMPLOYEE:"employee_name"
  }
  export const TRAIN_NAME='training'
export const MODE='mode'
 export const COMPETENCY_NAME ='competency'
 export const LOCATION_NAME='Location'
export const DEPARTMENT_LABEL='Department'
export const CREATE='create'
export const DATE_CHANGE='date_of_training'
export const DAY_CHANGE='day'
export const TEXT="text"
export const TRUE="true"
export const ATTENDEE_FIELD={
  SERIAL:'sno',
  NAME:'name',
  SKILL_NAME:'skill_name'
}
export const ATTENDEE_HEADERS={
  NAME:'name',
  S_NO_HEADER:'S.No',
  SKILL_NAME_ID:'Skill Name',
  SKILL_NAME_POPUP: 'Name*'
}
export const LABELS={
  NAME_TRAINER:"Name of Trainer*",
  COMPETENCY:'Competency of Trainer',
   TRAINING_MATERIALS:"Training Materials",
   ATTENDEE:"Name*",
   COMPETENCY_CERTIFICATES: "Competency Certificates",
   TRAINING_MATERIALS_CERTIFICATES: "Training Materials",
}
export const BUTTON_LABELS={
  CANCEL:'Cancel',
  SAVE:'Save'
}
export const EDIT_ATTENDEE='Edit Attendee'
export const ADD_ATTENDEE='Add Attendee'
export const CONTAINED='contained'
export const DATE_FORMATTER='YYYY-MM-DD'

export const TRAINING_SCHEDULE_QUERY_KEY={
  LIST:"training_schedule",
  SCHEDULE_ID:"schedule_id",
}

export const TRAINING_SCHEDULE_FILE_HEADERS={
  COMPETENCY_CERTIFICATES: "Competency Certificates",
  TRAINING_MATERIALS: "Training Materials"
}

export const TRAINING_EVALUATED_SCHEDULE={
  ALERT_TITLE: 'Something Went Wrong!',
  TRAINING_EVALUATED_ALERT: 'Training Evaluation for this schedule is already completed',
  ERROR_ICON: 'error'
}