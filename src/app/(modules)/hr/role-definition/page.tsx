'use client'
import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import {
  TABLE_HEADERS,
  TABLE_FIELDS,
  ID_FIELD_LABEL,
  COMPETENCY_LIST_TITLE,
  PATH_MAIN,
  ROUTE_PATHS,
  DATA_SOURCE_NAMES,
  DATA_FIELD_NAMES,
  CONTAINER_ID_FOR_SKILL,
  UPDATE,
  DATA_GRID_DELETE_CLASS,
  ROLE_DEF_ID,
  S_NO,
} from '@/constants/modules/hr/roleDefinition'
import { useGetCompetencySkills } from '@/hooks/modules/hr/useRoleDefinition'
import { NUMBERMAP } from '@/constants/common'
import { useRouter } from 'next/navigation'
import magicSaveConstants from '@/constants/magicSave'
import { magicGridRowSave } from '@/lib/utils/magicSave'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  PageContainer,
} from '@/styles/modules/dnd/competencySkill'
import StatusTypography from '@/components/ui/status/ToggleStatus'
const {
  IN_ACTIVE_STATUS,
  DELETE_ALERT,
  SUCCESS_ALERT,
  FAILED_ALERT,
} = COMMON_CONSTANTS

interface CompetencyRow {
  [ID_FIELD_LABEL]: number | string
  [TABLE_FIELDS.STATUS_FIELD]: number
  [TABLE_FIELDS.ROLES_FIELD]: string
  [TABLE_FIELDS.TYPES_OF_EMPLOYMENT_FIELD]: string
  role_id?: string
  fk_eqms_roles_lk_id?: string | number
  sno: number | string
  [key: string]: any
}

/**
*Classification : Confidential
**/

const CompetencySkillsPage: React.FC = () => {
  const { data: competencyData, isLoading, refetch } = useGetCompetencySkills()
  const router = useRouter()

  const handleAddNew = () => {
    router.push(PATH_MAIN)
  }

  useEffect(() => {
    refetch()
  }, [])

  const handleDelete = async (
    e: React.MouseEvent,
    data: { [key: string]: string | number }
  ) => {
    const currentTarget = e.currentTarget
    const result = await showActionAlert(DELETE_ALERT)
    if (result.isConfirmed) {
      const target = currentTarget

      const newStatus = IN_ACTIVE_STATUS

      target.setAttribute(magicSaveConstants.DATA_STATUS, String(newStatus))

      if ('value' in target) {
        target.value = newStatus
      }
      magicSaveDelete(target, data.role_definition_id as number)
    }
  }
  const magicSaveDelete = async (currentTarget: number, competencySkillId: number) => {
    const formId = CONTAINER_ID_FOR_SKILL
    const response = await magicGridRowSave({
      containerID: formId,
      scopedEvents: currentTarget,
      eventClass: DATA_GRID_DELETE_CLASS,
      dataframeworkOperatorType: UPDATE,
      dataframeworkOtherParamsBag: {},
      keys: {
        eqms_hr_role_definition: {
          id: competencySkillId,
        },
        eqms_hr_role_definition_skill_level_mapper: {
          id: competencySkillId,
        },
      },
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
    })
    if (
      response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      showActionAlert(SUCCESS_ALERT)
    } else {
      showActionAlert(FAILED_ALERT)
    }
    refetch()
  }

  const columns = [
    {
      field: S_NO,
      headerName: TABLE_HEADERS.SERIAL_NUMBER
    },
    {
      field: TABLE_FIELDS.ROLES_FIELD,
      headerName: TABLE_HEADERS.ROLE,
      flex: NUMBERMAP.ONE
    },
    {
      field: TABLE_FIELDS.TYPES_OF_EMPLOYMENT_FIELD,
      headerName: TABLE_HEADERS.TYPE_OF_EMPLOYMENT,
      flex: NUMBERMAP.ONE
    },
    {
      field: TABLE_FIELDS.STATUS_FIELD,
      headerName: TABLE_HEADERS.STATUS,
      renderCell: (params) => (
        <StatusTypography value={params.value} />
      ),
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_FIELDS.ACTION_FIELD,
      headerName: TABLE_HEADERS.ACTION,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: { row: CompetencyRow }) => {

        return (
          <Box  className="data-grid-delete">
             <ActionButton
              dataSourceName={DATA_SOURCE_NAMES.COMPETENCY_SKILL}
              dataFieldName={DATA_FIELD_NAMES.STATUS}
              dataStatus={params.row[TABLE_FIELDS.STATUS_FIELD]}
              value={params.row[TABLE_FIELDS.STATUS_FIELD]}
              disabled={!params.row.status}
              onDelete={(e: React.MouseEvent<HTMLButtonElement>) => handleDelete(e, params.row)}
              onEdit={() => {
                const roleId =
                  params.row.fk_eqms_roles_lk_id?.toString() ??
                  params.row.role_id
                if (!roleId) {
                  showActionAlert(FAILED_ALERT)
                  return
                }
                router.push(ROUTE_PATHS.getCompetencyByRoleId(roleId))
              }} />
          </Box>

        )
      },
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={COMPETENCY_LIST_TITLE}
        pathName={ROUTE_PATHS.createCompetency}
        Table={
          <DataTable
            rows={competencyData?.data ?? []}
            columns={columns}
            IdField={ROLE_DEF_ID}
            checkbox={false}
            loading={isLoading}
            customClassName={magicSaveConstants.CUSTOM_CLASS_NAME}
          />
        }
        onAddNew={handleAddNew}
      />
    </PageContainer>
  )
}

export default CompetencySkillsPage