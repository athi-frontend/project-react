import { FormData } from '@/types/modules/hr/candidateEvaluation'

export const DEFAULT_FORM_DATA: FormData = {
  name: '',
  recruitmentId: '',
  role: '',
  interviewDate: '',
  educationJd: '',
  actualEducation: '',
  experienceJd: '',
  actualExperience: '',
  interviewedBy: [],
  status: '',
  comments: '',
  documents:[]
}

 export const isAnyLoading = (apiLoading: boolean, draftLoading: boolean) => { return apiLoading || draftLoading }
