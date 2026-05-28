/**
 * Classification : Confidential
 **/
import { MetaInfo } from './common'

export interface OtherHazardAPI {
  sub_category_id: number
  sub_category: string
  status: number
  created_date?: string
  modified_date?: string
}

export interface OtherHazardUpsertPayload {
  project_id: number | null
  question: string
  sub_category_id?: number | null
  status : number
}

export interface OtherHazardRow {
  id: number
  sub_category: string
  status?: number
  created_date?: string
  modified_date?: string
}

export interface OtherHazardListResponse {
  data: OtherHazardAPI[]
  meta_info?: MetaInfo
}

export interface OtherHazardFetchResponse {
  data: OtherHazardAPI[]
  meta_info?: MetaInfo
}

export interface OtherHazardListQueryKey {
  queryKey: [string, number]
}
