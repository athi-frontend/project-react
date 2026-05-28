'use client'
import React, { useEffect, useState } from 'react'
import DataTable from '@/components/ui/data-table/DataTable'
import Link from 'next/link'
import { Grid2 } from '@mui/material'
import { Label, ButtonGroup } from '@/components/ui'
import {
  PROJECT_STAGES_TABLE_COLUMNS,
  TABLE_HEADERS,
  LABELS,
  STAGE_ROUTES,
} from '@/constants/modules/dnd/stageService'
import { StyledTableContainer,InlineStyles } from '@/styles/modules/dnd/stageStyles'
import {
  ColumnDefinition,
  ProjectStageResponse,
  ProjectStagesFormData,
  VerificationPlanFormData,
} from '@/types/modules/dnd/stageTypes'
import ProjectStagesModal from '@/components/modules/dnd/project-stages/ProjectStageModal'
import { useProjectStagesData } from '@/hooks/modules/dnd/useProjectStages'
import {
  ID_FIELD,
  STAGE,
  ADD,
  ACTIVE,
  INACTIVE,
  STATUS,
  TYPE_OF_STAGE,
  LABEL,
} from '@/constants/modules/dnd/projectStages'
import AddIcon from '@mui/icons-material/Add'
import { useParams } from 'next/navigation'
import { NUMBERMAP } from '@/constants/common'


export default function ProjectStagesPage() {
  const params = useParams()
  const projectId = Number(params.id)
  const [tableData, setTableData] = useState<ProjectStageResponse[]>([])
  const [open, setOpen] = useState(false)
  const [projectStagesData, setProjectStagesData] =
    useState<ProjectStagesFormData>({
      stage: '',
      typeOfStage: '',
      numberOfStages: '',
    })

  const { data: stagesResponse } = useProjectStagesData(projectId)

  const columns: ColumnDefinition[] = [
    {
      field: PROJECT_STAGES_TABLE_COLUMNS.STAGE_ORDER,
      headerName: TABLE_HEADERS.SERIAL_NO,
      width: NUMBERMAP.TWOHUNDRED,
      renderCell: (params) => params.value,
    },
    {
      field: STAGE,
      headerName: TABLE_HEADERS.STAGE_NAME,
      width: NUMBERMAP.THREEHUNDRED,
      renderCell: (params) => (
        <Link
          href={`${STAGE_ROUTES.STAGE_DETAIL}/${params.value.toLowerCase()}/${params.row.project_stage_order_id}`}
          style={InlineStyles.linkStyle}
        >
          {params.value + ' ' + params.row.stage_number}
        </Link>
      ),
    },
    {
      field: TYPE_OF_STAGE,
      headerName: TABLE_HEADERS.TYPE_OF_STAGE,
      width: NUMBERMAP.THREEHUNDRED,
      renderCell: () => LABEL,
    },
    {
      field: STATUS,
      headerName: TABLE_HEADERS.STATUS_OF_STAGE,
      width: NUMBERMAP.TWOHUNDRED,
      renderCell: (params) => (
        <span
          style={
            params.value === 1
              ? InlineStyles.statusActive
              : InlineStyles.statusInactive
          }
        >
          {params.value === 1 ? ACTIVE : INACTIVE}
        </span>
      ),
    },
  ]

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleSave = (data: VerificationPlanFormData | undefined) => {
    if (data) {
      setProjectStagesData(data)
    } else {
      setProjectStagesData({ stage: '', typeOfStage: '', numberOfStages: '' })
    }
    setOpen(false)
  }

  useEffect(() => {
    if (stagesResponse?.data) {
      setTableData(stagesResponse?.data)
    }
  }, [stagesResponse])

  return (
    <StyledTableContainer>
      <Grid2 container>
        <Grid2 size={{ md: NUMBERMAP.SIX }} sx={InlineStyles.gridItem}>
          <Label title={LABELS.PROJECT_STAGES} />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.SIX }}>
          <ButtonGroup
            buttons={[
              {
                label: ADD,
                icon: <AddIcon />,
                onClick: () => {
                  handleOpen()
                },
              },
            ]}
          />
        </Grid2>
      </Grid2>
      <DataTable
        rows={tableData}
        columns={columns}
        pagination
        IdField={ID_FIELD}
        checkbox={false}
      />
      <ProjectStagesModal
        open={open}
        onClose={handleClose}
        projectId={projectId}
        onSave={handleSave}
        initialData={projectStagesData}
      />
    </StyledTableContainer>
  )
}
