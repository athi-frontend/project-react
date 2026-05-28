/**
 * Clickable Cell Renderer Component for mitigation matrix
 * Classification: Confidential
 */
'use client'
import React from 'react'
import { Typography } from '@mui/material'
import { MITIGATION_MATRIX_CONSTANTS } from '@/constants/modules/risk-management/mitigationMatrix'
import { downloadStyles } from '@/styles/modules/dnd/acknowledgmentTransfer'
import { ClickableCellRendererProps } from '@/types/modules/risk-management/mitigationMatrix'

const ClickableCellRenderer: React.FC<ClickableCellRendererProps> = ({
  field,
  value,
  onHazardLinkClick,
  onRiskLinkClick,
  rowData,
}) => {
  const handleClick = () => {
    if (field === MITIGATION_MATRIX_CONSTANTS.HAZARD_CODE_FIELD) {
      // For hazard code, expand the hazard
      onHazardLinkClick(rowData.hazard_id, rowData.subcategory_applicability_id)
    } else if (field === MITIGATION_MATRIX_CONSTANTS.RISK_CODE_FIELD) {
      // For risk code, expand both hazard and risk
      onRiskLinkClick(
        rowData.hazard_id,
        rowData.risk_id,
        rowData.subcategory_applicability_id
      )
    } else {
      // Fallback for other fields
      onHazardLinkClick(undefined, rowData.subcategory_applicability_id)
    }
  }

  return (
    <Typography sx={downloadStyles.title} onClick={handleClick}>
      {value}
    </Typography>
  )
}

export default ClickableCellRenderer
