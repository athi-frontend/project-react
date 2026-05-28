/**
 * Risk Details Modal Component for mitigation matrix
 * Classification: Confidential
 */
'use client'
import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { DataGridTable } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import ClickableCellRenderer from './ClickableCellRenderer'
import { ButtonContainer, StyledButton } from '@/styles/components/ui/button'
import { MITIGATION_MATRIX_CONSTANTS } from '@/constants/modules/risk-management/mitigationMatrix'
import { NUMBERMAP } from '@/constants/common'
import { RiskDetailsModalProps } from '@/types/modules/risk-management/mitigationMatrix'
import { CommonModalScroll } from '@/styles/common'

const RiskDetailsModal: React.FC<RiskDetailsModalProps> = ({
  open,
  onClose,
  selectedRiskDetails,
  isRiskDetailsLoading,
  onHazardLinkClick,
  onRiskLinkClick,
}) => {
  /**
   * Description: Create modal columns for risk details table
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @returns Array of GridColDef objects for modal table
   */
  const createModalColumns = (): GridColDef[] => [
    {
      field: MITIGATION_MATRIX_CONSTANTS.RISK_CODE_FIELD,
      headerName: MITIGATION_MATRIX_CONSTANTS.RISK_CODE_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <ClickableCellRenderer
          field={MITIGATION_MATRIX_CONSTANTS.RISK_CODE_FIELD}
          value={params.value}
          onHazardLinkClick={onHazardLinkClick}
          onRiskLinkClick={onRiskLinkClick}
          rowData={params.row}
        />
      ),
    },
    {
      field: MITIGATION_MATRIX_CONSTANTS.RISK_TITLE_FIELD,
      headerName: MITIGATION_MATRIX_CONSTANTS.RISK_TITLE_HEADER,
      flex: NUMBERMAP.HALF
    },
    {
      field: MITIGATION_MATRIX_CONSTANTS.HAZARD_CODE_FIELD,
      headerName: MITIGATION_MATRIX_CONSTANTS.HAZARD_CODE_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <ClickableCellRenderer
          field={MITIGATION_MATRIX_CONSTANTS.HAZARD_CODE_FIELD}
          value={params.value}
          onHazardLinkClick={onHazardLinkClick}
          onRiskLinkClick={onRiskLinkClick}
          rowData={params.row}
        />
      ),
    },
  ]

  const columnsModal = createModalColumns()

  return (
    <CommonModal
      title={MITIGATION_MATRIX_CONSTANTS.RISK_DETAILS_TITLE}
      onClose={onClose}
      open={open}
    >
      <CommonModalScroll>
        <DataGridTable
          rows={selectedRiskDetails}
          columns={columnsModal}
          idField={MITIGATION_MATRIX_CONSTANTS.MODAL_ID_FIELD}
          hideFooter
          loading={isRiskDetailsLoading}
        />
      <ButtonContainer>
        <StyledButton
          variant={MITIGATION_MATRIX_CONSTANTS.CONTAINED_VARIANT}
          onClick={onClose}
        >
          {MITIGATION_MATRIX_CONSTANTS.CLOSE_BUTTON}
        </StyledButton>
      </ButtonContainer>
      </CommonModalScroll>
    </CommonModal>
  )
}

export default RiskDetailsModal
