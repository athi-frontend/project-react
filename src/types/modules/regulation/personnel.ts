export interface PersonnelData {
  organization_site_id?: number
  organization_chart?: string
  personnel_profile_summary?: string
  training_arragement_outline?: string
  health_requirements?: string
  personnel_hygeine_requirement?: string
}

export interface PersonnelResponse {
  data: PersonnelData[]
}

export interface PersonnelPayload extends PersonnelData {
  organization_site_id: number
} 