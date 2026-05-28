'use client'
import React, { useState } from 'react'
import { Box } from '@mui/material'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { DataTable } from '@/components/ui'
import { CommonInlineStyles } from '@/styles/common'
import { Skill } from '@/types/modules/hr/trainingEvaluation'
import { 
  MAGICSAVECONSTANT, 
  STATUS_LABELS, 
  DEFAULT_DASH, 
  ELEMENT_TYPE_STRING,
  ID,
  DATA_DELETE
} from '@/constants/modules/hr/trainingEvaluation'
import { NUMBERMAP } from '@/constants/common'
import { trainingEvaluationStyles } from '@/styles/modules/hr/trainingEvaluation'

interface TrainingEvaluationRowProps {
  row: any
  rowIndex: number
  selectedRow: Skill | undefined
  formData: any
  isEditMode: boolean
  expandedColumns: any[]
  getSkillWithContext: (
    skill: Skill,
    skillIdx: number,
    row: any,
    selectedRow: Skill | undefined,
    formData: any,
    isEditMode: boolean
  ) => any
}

const TrainingEvaluationRow: React.FC<TrainingEvaluationRowProps> = ({
  row,
  rowIndex,
  selectedRow,
  formData,
  isEditMode,
  expandedColumns,
  getSkillWithContext
}) => {
  const [open, setOpen] = useState(false)

  const firstName = row.attendee_first_name ?? row.first_name
  const lastName = row.attendee_last_name ?? row.last_name
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : DEFAULT_DASH
  const status = row.status
  const statusText = status ? STATUS_LABELS.VALID:STATUS_LABELS.INVALID

  return (
    <React.Fragment>
      <TableRow sx={trainingEvaluationStyles.tableRow}>
        <TableCell component="th" scope="row">
          <div>
            <input
              type={ELEMENT_TYPE_STRING}
              data-is-grid={MAGICSAVECONSTANT.TRUE}
              value={row.hr_attendee_id ?? ""}
              readOnly
              style={CommonInlineStyles.displayNone}
            />
            {rowIndex + NUMBERMAP.ONE}
          </div>
        </TableCell>
        <TableCell>{fullName}</TableCell>
        <TableCell>{row.role_name ?? DEFAULT_DASH}</TableCell>
        <TableCell>{row.department_name ?? DEFAULT_DASH}</TableCell>
        <TableCell>{statusText}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={trainingEvaluationStyles.expandedTableCell} colSpan={NUMBERMAP.SIX}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={trainingEvaluationStyles.collapseBox}>
              <DataTable
                rows={row.skills.map((skill: any, skillIdx: number) => 
                  getSkillWithContext(skill, skillIdx, row, selectedRow, isEditMode)
                )}
                columns={expandedColumns}
                IdField={ID}
                customClassName={DATA_DELETE}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default TrainingEvaluationRow 