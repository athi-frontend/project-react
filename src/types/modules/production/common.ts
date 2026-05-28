/**
 * Production Common Types
 * Classification: Confidential
 */

/**
 * Jigs Type Item
 */
export interface JigsTypeItem {
  jigs_type_id: number
  jigs_type_name: string
  status: number
}

/**
 * Jigs Type Response
 */
export interface JigsTypeResponse {
  data: JigsTypeItem[]
}

