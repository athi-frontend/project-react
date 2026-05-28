/**
 * Matrix Table Component for mitigation matrix
 * Classification: Confidential
 */
'use client'
import React, { useMemo } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { DataGridTable } from '@/components/ui'
import { PADDING20 } from '@/styles/modules/risk-management/riskAssessmentMatrix'
import {
  CountCell,
  CustomCellStyles,
  ProbabilityCell,
} from '@/styles/modules/risk-management/mitigationMatrix'
import { NUMBERMAP } from '@/constants/common'
import { MatrixTableProps } from '@/types/modules/risk-management/mitigationMatrix'
import { PROBABILITY_LEVELS, MITIGATION_MATRIX_CONSTANTS } from '@/constants/modules/risk-management/mitigationMatrix'

const MatrixTable: React.FC<MatrixTableProps> = ({
  matrixData,
  severityColumns,
  isMatrixLoading,
  onCountClick,
}) => {
  /**
   * Description: Render cell with count and color based on acceptability
   * Author: Harsithiga B
   * Created: 09-10-2025
   * Modified:
   * Classification: Confidential
   * @param params - Grid cell parameters
   * @returns JSX element for the cell
   */
  const renderSwitchCell = (params: GridRenderCellParams) => {
    const cellData = params.row.cells[params.field]
    if (!cellData) return null

    const count = cellData.count ?? NUMBERMAP.ZERO
    const isClickable = count > NUMBERMAP.ZERO
    const isAcceptable = cellData.is_acceptable === NUMBERMAP.ONE

    return (
      <CountCell
        isClickable={isClickable}
        onClick={() => onCountClick(params.id as string, params.field, count)}
        isAcceptable={isAcceptable}
      >
        {count}
      </CountCell>
    )
  }

  /**
   * Description: Create severity level column definition
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param sevLevel - Severity level object
   * @returns GridColDef for severity column
   */
  const createSeverityColumn = (sevLevel: any): GridColDef => {
    // Use id property from severityColumns state (which contains template_id)
    const templateId = sevLevel.id ?? sevLevel.template_id ?? sevLevel.column
    return {
      field: `${MITIGATION_MATRIX_CONSTANTS.COLUMN_PREFIX}${templateId}`,
      headerName: sevLevel.name,
      flex: NUMBERMAP.ONE,
      headerAlign: 'center',
      align: 'center',
      renderCell: renderSwitchCell,
    }
  }

  /**
   * Description: Create probability severity column definition
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @returns GridColDef for probability column
   */
  const createProbabilityColumn = (): GridColDef => {
    return {
      field: MITIGATION_MATRIX_CONSTANTS.PROBABILITY_SEVERITY_FIELD,
      headerName: MITIGATION_MATRIX_CONSTANTS.PROBABILITY_SEVERITY_HEADER,
      flex: NUMBERMAP.ONE,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => {
        // Always fetch probability name from official PROBABILITY_LEVELS order if matrixData contains fallback
        const orderedProbs = [...PROBABILITY_LEVELS].sort((a, b) => a.order - b.order);
        const foundConstant = orderedProbs[(params.row.order ?? params.row.id) - 1];
        const displayName = foundConstant ? foundConstant.key.replace('-', ' - ') : (params.value ?? '');
        return <ProbabilityCell title={displayName}>
          {displayName}
        </ProbabilityCell>
      }
    }
  }

  /**
   * Description: Define columns for risk matrix dynamically
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @returns Array of GridColDef objects
   */
  const createColumns = (): GridColDef[] => {
    // Use severity columns from state (either dummy or real)
    if (!severityColumns || severityColumns.length === NUMBERMAP.ZERO) {
      return []
    }

    const probabilityColumn = createProbabilityColumn()
    const severityColumnsDefs = severityColumns.map(createSeverityColumn)

    return [probabilityColumn, ...severityColumnsDefs]
  }

  // Memoize columns to prevent unnecessary recalculations
  const columns = useMemo(() => createColumns(), [severityColumns])

  const isLoading = () => {
    return !!isMatrixLoading
  }

  return (
    <Box sx={PADDING20}>
      <DataGridTable
        rows={matrixData}
        customCellStyles={CustomCellStyles}
        columns={columns}
        idField={MITIGATION_MATRIX_CONSTANTS.MATRIX_ID_FIELD}
        hideFooter
        showColumnLines
        loading={isLoading()}
      />
    </Box>
  )
}

export default MatrixTable
