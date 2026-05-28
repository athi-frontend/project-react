/**
 *Classification : Confidential
 **/
'use client'
import React, { useState, useEffect } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box, Tooltip, useTheme } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataGridTable, ToggleSwitch, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { CenteredContainer } from '@/styles/common'
import {
  TooltipContent,
  TooltipCombinationText,
  TooltipStatusText,
  getTooltipStyles,
  getTooltipArrowStyles,
  PADDING20,
  PROBABILITY_CELL_STYLES,
} from '@/styles/modules/risk-management/riskAssessmentMatrix'
import {
  RiskMatrixRow,
  RiskMatrixCell,
  RiskAssessmentMatrixPayload,
} from '@/types/modules/risk-management/riskAssessmentMatrix'
import {
  RISK_MATRIX_CONSTANTS,
} from '@/constants/modules/risk-management/riskAssessmentMatrix'
import { PROBABILITY_LEVELS, SEVERITY_LEVELS } from '@/constants/modules/risk-management/mitigationMatrix'
import {
  processButtonsWithPermissions,
  QUERYCONSTANTS,
} from '@/lib/utils/common'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import {
  useGetRiskMatrix,
  usePostRiskMatrix,
} from '@/hooks/modules/risk-management/useRiskAssessmentMatrix'
import { APPLICABILITY_ROUTES } from '@/constants/modules/risk-management/applicability'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import GlobalLoader from '@/components/shared/LoadingSpinner'

const RiskAssessmentMatrix: React.FC = () => {
  /**
   * Function Name: createSeverityColumns
   * Params: None
   * Description: Creates severity column configuration from SEVERITY_LEVELS
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const createSeverityColumns = () => {
    return SEVERITY_LEVELS.map((sev) => ({
      id: sev.id,
      name: sev.key.replace('-', ' - '),
      column: sev.column,
    }))
  }

  const [matrixData, setMatrixData] = useState<RiskMatrixRow[]>([])
  const [severityColumns, setSeverityColumns] = useState<
    { id: number; name: string; column: number }[]
  >(createSeverityColumns())
  const params = useParams()
  const router = useRouter()
  const projectId = Number(params.id)
  const theme = useTheme()

  // API hooks
  const { data: apiData, isLoading } = useGetRiskMatrix(projectId)
  const { mutate: postRiskMatrix, isPending } = usePostRiskMatrix()

  /**
   * Function Name: getToggleValue
   * Params: cell (RiskMatrixCell | undefined)
   * Description: Calculates toggle value from cell data, using actual_value if available, otherwise reference_value
   * Author: Harsithiga B
   * Created: 2026-01-10
   * Modified:
   * Classification: Confidential
   */
  const getToggleValue = (cell: RiskMatrixCell | undefined): boolean => {
    if (!cell) {
      return false
    }

    if (cell.actual_value !== null) {
      return cell.actual_value === NUMBERMAP.ONE
    }

    return cell.reference_value === NUMBERMAP.ONE
  }

  /**
   * Function Name: addSeverityColumnsToRow
   * Params: rowData (RiskMatrixRow), rowCells (RiskMatrixCell[]), sortedSeverityLevels (array)
   * Description: Adds severity columns to a matrix row with toggle state logic
   * Author: Harsithiga B
   * Created: 2026-01-10
   * Modified:
   * Classification: Confidential
   */
  const addSeverityColumnsToRow = (
    rowData: RiskMatrixRow,
    rowCells: RiskMatrixCell[],
    sortedSeverityLevels: Array<typeof SEVERITY_LEVELS[number]>
  ): void => {
    sortedSeverityLevels.forEach((sev) => {
      const cell = rowCells.find((c) => c.column === sev.column)
      const columnKey = `severity_${sev.column}`
      const toggleValue = getToggleValue(cell)

      rowData[columnKey] = toggleValue
      rowData[`${columnKey}_count`] = NUMBERMAP.ZERO
    })
  }

  /**
   * Function Name: transformMatrixData
   * Params: data (RiskMatrixCell[])
   * Description: Transforms API data to matrix format, groups by row, and generates severity columns
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const transformMatrixData = (data: RiskMatrixCell[]) => {
    if (!data || !Array.isArray(data) || data.length === NUMBERMAP.ZERO) {
      return []
    }

    // Sort probability and severity levels once at the beginning
    const sortedProbabilityLevels = [...PROBABILITY_LEVELS].sort(
      (a, b) => a.order - b.order
    )
    const sortedSeverityLevels = [...SEVERITY_LEVELS].sort(
      (a, b) => a.column - b.column
    )

    // Transform data to matrix rows using PROBABILITY_LEVELS and SEVERITY_LEVELS
    const matrixRows: RiskMatrixRow[] = sortedProbabilityLevels.map((prob) => {
      const rowCells = data.filter((cell) => cell.row === prob.row)
      const rowData: RiskMatrixRow = {
        id: prob.row,
        probabilityLevel: prob.key.replace('-', ' - '),
      }
      addSeverityColumnsToRow(rowData, rowCells, sortedSeverityLevels)

      return rowData
    })

    // Use SEVERITY_LEVELS as columns
    return {
      matrixRows,
      severityColumns: createSeverityColumns(),
    }
  }

  // Complex data initialization effect - Handles API data transformation and state updates
  // This effect runs when API data changes and transforms it into matrix format
  useEffect(() => {
    // Set constant-based headers during loading
    if (isLoading) {
      setSeverityColumns(createSeverityColumns())
      return
    }

    // Only process data if API data is available
    if (!apiData?.data) {
      return
    }

    // Complex data transformation - Convert flat API response to matrix structure
    const result = transformMatrixData(apiData?.data)

    // Defensive programming - Check if transformation was successful before updating state
    if (result && 'matrixRows' in result) {
      setMatrixData(result.matrixRows)
      setSeverityColumns(result.severityColumns)
    }
  }, [apiData, isLoading])

  /**
   * Function Name: handleSwitchChange
   * Params: rowId (string), field (string), checked (boolean)
   * Description: Handles toggle switch state changes for individual matrix cells
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const handleSwitchChange = (
    rowId: string,
    field: string,
    checked: boolean
  ) => {
    // Optimized state update - avoid unnecessary string conversions
    const targetRowId = Number(rowId)
    setMatrixData((prevData) => {
      return prevData.map((row) =>
        row.id === targetRowId ? { ...row, [field]: checked } : row
      )
    })
  }

  /**
   * Function Name: renderSwitchCell
   * Params: params (GridRenderCellParams)
   * Description: Renders toggle switch component for matrix cells with disabled state handling
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const renderSwitchCell = (params: GridRenderCellParams) => {
    // Extract probability and severity level names for tooltip
    const probabilityLevel = params.row.probabilityLevel
    const severityLevel = params.colDef.headerName
    const tooltipText = `${probabilityLevel} x ${severityLevel}`
    const statusText = params.value
      ? RISK_MATRIX_CONSTANTS.ACCEPTABLE_STATUS
      : RISK_MATRIX_CONSTANTS.NOT_ACCEPTABLE_STATUS

    return (
      <CenteredContainer>
        <Tooltip
          title={
            <TooltipContent>
              <TooltipCombinationText>{tooltipText}</TooltipCombinationText>
              <TooltipStatusText>{statusText}</TooltipStatusText>
            </TooltipContent>
          }
          arrow
          placement="top"
          slotProps={{
            tooltip: {
              sx: getTooltipStyles(theme),
            },
            arrow: {
              sx: getTooltipArrowStyles(theme),
            },
          }}
        >
          <Box>
            <ToggleSwitch
              checked={params.value}
              disabled={!hasEditPermission}
              onChange={(checked) =>
                handleSwitchChange(params.id as string, params.field, checked)
              }
            />
          </Box>
        </Tooltip>
      </CenteredContainer>
    )
  }

  /**
   * Function Name: generateRequestBody
   * Params: None
   * Description: Generates request body for save action with only valid mappings based on current toggle states
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified: 2025-09-17
   * Classification: Confidential
   */
  const generateRequestBody = (): RiskAssessmentMatrixPayload => {
    // Create lookup map for quick access to matrix row data by row ID
    // This prevents nested loops and improves performance for large datasets
    const matrixDataMap = new Map(matrixData.map((row) => [row.id, row]))

    // Map all cells to matrix mappings since template IDs are always present
    const matrixMappings = apiData.data.map((cell: RiskMatrixCell) => {
      // Quick lookup instead of searching through array for better performance
      const matrixRow = matrixDataMap.get(cell.row)
      const columnKey = `severity_${cell.column}`

      // Complex toggle state resolution - Get current toggle state from matrix data
      // Falls back to false if row not found (defensive programming)
      const currentToggleState = matrixRow?.[columnKey] ?? false

      return {
        probability_template_id: cell.probability_level.template_id,
        severity_template_id: cell.severity_level.template_id,
        is_acceptable: currentToggleState ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
      }
    })

    return {
      project_id: projectId,
      matrix_mappings: matrixMappings,
    }
  }

  /**
   * Function Name: handleSave
   * Params: None
   * Description: Handles save action by generating and sending request body
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified: 2025-09-17
   * Classification: Confidential
   */
  const handleSave = () => {
    // Don't make API call if no data is available
    if (
      !apiData?.data ||
      !Array.isArray(apiData.data) ||
      apiData.data.length === NUMBERMAP.ZERO
    ) {
      return
    }

    // Complex request body generation - Creates API payload with valid mappings only
    const requestBody = generateRequestBody()

    // Use destructured mutate function for API call
    postRiskMatrix(requestBody)
  }

  /**
   * Function Name: handleCancel
   * Params: None
   * Description: Handles cancel action by redirecting to risk management page
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const handleCancel = () => {
    // Simple redirect logic - Navigate back to risk management main page
    router.push(APPLICABILITY_ROUTES.RISK_MANAGEMENT)
  }

  const permissions =
    apiData?.meta_info?.action_control?.permissions ?? []

  const actionHandlers: Record<string, (id: number) => void> = {
    [BUTTON_LABEL.CANCEL]: () => handleCancel(),
    [BUTTON_LABEL.SAVE]: () => handleSave(),
  }

  const { buttons: buttonDetails, hasEditPermission } =
    processButtonsWithPermissions(permissions, actionHandlers, isPending)

  useEffect(() => {
    if (!isLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON as 'error',
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isLoading])

  /**
   * Function Name: generateColumns
   * Params: None
   * Description: Generates dynamic columns for the risk assessment matrix data grid
   * Author: Harsithiga B
   * Created: 2025-09-15
   * Modified:
   * Classification: Confidential
   */
  const generateColumns = () => {
    // Use severity columns from state (either dummy or real)
    if (!severityColumns || severityColumns.length === NUMBERMAP.ZERO) {
      return []
    }
    // Base column configuration for probability levels
    const baseColumns: GridColDef[] = [
      {
        field: RISK_MATRIX_CONSTANTS.PROBABILITY_FIELD,
        headerName: RISK_MATRIX_CONSTANTS.PROBABILITY_HEADER_NAME,
        flex: NUMBERMAP.ONE,
        headerAlign: 'center',
        align: 'left',
        renderCell: (params: GridRenderCellParams) => (
          <Box sx={PROBABILITY_CELL_STYLES} title={params.value}>
            {params.value}
          </Box>
        ),
      },
    ]

    // Complex dynamic column generation - Creates columns based on severity levels
    // Uses map to transform severity data into DataGrid column definitions
    const severityCols: GridColDef[] = severityColumns.map(
      (severity: { id: number; name: string; column: number }) => ({
        field: `severity_${severity.column}`, // Dynamic field naming based on column number
        headerName: severity.name,
        flex: NUMBERMAP.ONE,
        headerAlign: 'center',
        renderCell: renderSwitchCell, // Custom renderer for toggle switches
      })
    )

    // Complex array concatenation - Combines base and dynamic columns
    return [...baseColumns, ...severityCols]
  }

  return (
    <PageContainer>
      <GlobalLoader loading={isPending} />
      <CommonSharedTale
        title={RISK_MATRIX_CONSTANTS.HEADER_TITLE}
        Table={
          <Box sx={PADDING20}>
            <DataGridTable
              rows={matrixData}
              columns={generateColumns()}
              loading={isLoading}
              hideFooter
              showColumnLines
            />
            <RiskNavigationButtonGroup
              projectId={projectId}
              buttons={buttonDetails ?? []}
            />
          </Box>
        }
      />
    </PageContainer>
  )
}

export default RiskAssessmentMatrix
