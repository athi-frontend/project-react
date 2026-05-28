/**
 * Hazard Identification Tool Types
 * Classification: Confidential
 */

export type HazardIdentificationToolDropdownItem = {
  id: number
  hazard_identification_tool: string
  status: number
}

export type HazardIdentificationToolUpsertRequest = {
  project_id: number
  tool_list: number[]
  description: string
}

export type HazardIdentificationToolProjectTool = {
  ref_id: number
  hazard_identification_tool_character: string
}