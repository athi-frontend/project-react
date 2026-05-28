export interface CheckListItem {
  applicable_specification_id: number
  specification_name: string
  is_adequate: number
  adequacy_report_id: number,
  remarks: string
  is_dir_conflict?: number | null
  conflicting_dir_id?: number[]
  conflict_remarks?: string | null
  is_dir_unambiguous?: number | null
  unambiguous_remarks?: string | null
  is_dir_verifiable?: number | null
  verifiable_remarks?: string | null
  is_dir_complete?: number | null
  complete_remarks?: string | null
  is_dir_retested?: number | null
}

