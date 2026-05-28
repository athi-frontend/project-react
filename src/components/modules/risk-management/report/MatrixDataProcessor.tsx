/**
 * Matrix Data Processor Hook for mitigation matrix
 * Classification: Confidential
 */
'use client'
import { useState, useEffect, useMemo } from 'react'
import { NUMBERMAP } from '@/constants/common'
import {
  MatrixCell,
  MatrixDataProcessorProps,
  SeverityLevel,
} from '@/types/modules/risk-management/mitigationMatrix'
import { PROBABILITY_LEVELS, SEVERITY_LEVELS } from '@/constants/modules/risk-management/mitigationMatrix'

export const useMatrixDataProcessor = ({
  apiResponse,
  isMatrixLoading,
}: MatrixDataProcessorProps) => {
  // Severity columns state management
  const [severityColumns, setSeverityColumns] = useState<SeverityLevel[]>([])

  // Handle initial loading state and set default headers
  useEffect(() => {
    // Set constant-based headers during loading
    if (isMatrixLoading) {
      setSeverityColumns([...SEVERITY_LEVELS].sort((a,b) => a.column - b.column).map(sev => ({ id: sev.id, name: sev.key.replace('-', ' - '), column: sev.column })));
      return
    }
    // Always use constant-based severity columns
    setSeverityColumns(SEVERITY_LEVELS.map(sev => ({id: sev.id, name: sev.key.replace('-', ' - '), column: sev.column})));
  }, [apiResponse, isMatrixLoading])

  /**
   * Description: Extract unique probability levels from API response
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @returns Sorted array of unique probability levels
   */
  const getConstantProbabilityLevels = () => {
    return [...PROBABILITY_LEVELS]
      .sort((a, b) => a.order - b.order)
      .map(prob => ({
        template_id: prob.id,
        level_name: prob.key.replace('-', ' - '),
        row: prob.row,
        order: prob.order
      }));
  }

  /**
   * Description: Find cell data for a specific row and severity level
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param rowIndex - The row index (0-based)
   * @param severityTemplateId - The severity level template ID
   * @returns MatrixCell data or undefined if not found
   */
  const findCellData = (
    rowIndex: number,
    severityTemplateId: number
  ): MatrixCell | undefined => {
    if (!apiResponse) return undefined

    const foundCell = apiResponse.find(
      (c) =>
        c.row === rowIndex &&
        c.severity_level.template_id === severityTemplateId
    )
    return foundCell
  }

  /**
   * Description: Create cells for a specific row based on severity levels
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @param severityLevels - Array of severity level objects
   * @param rowIndex - The row index (0-based)
   * @returns Object with cell data keyed by column identifier
   */
  const createRowCells = (
    severityLevels: SeverityLevel[],
    rowIndex: number
  ): { [key: string]: MatrixCell } => {
    const cells: { [key: string]: MatrixCell } = {}

    severityLevels.forEach((sevLevel) => {
      // Use id property from severityColumns state (which contains template_id)
      const templateId = sevLevel.id ?? sevLevel.template_id
      if (templateId !== undefined && templateId !== null) {
        const cell = findCellData(rowIndex, templateId)
        if (cell) {
          cells[`col_${templateId}`] = cell
        }
      }
    })

    return cells
  }

  /**
   * Description: Create complete matrix data from API response
   * Author: Harsithiga B
   * Created: 29-09-2025
   * Modified:
   * Classification: Confidential
   * @returns Array of RiskMatrixRow objects
   */
  const createMatrixData = () => {
    const probabilityLevels = getConstantProbabilityLevels()
    const severityLevels = severityColumns;

    return probabilityLevels.map((probLevel) => ({
      id: probLevel.row,
      probabilitySeverity: probLevel.level_name, // always correct order/label
      order: probLevel.order,
      cells: createRowCells(severityLevels, probLevel.row),
    }))
  }

  // Memoize matrix data to prevent unnecessary recalculations
  const matrixData = useMemo(() => {
    if (!apiResponse || apiResponse.length === NUMBERMAP.ZERO) {
      return []
    }

    return createMatrixData()
  }, [apiResponse, severityColumns])

  return {
    severityColumns,
    matrixData,
    findCellData,
  }
}
