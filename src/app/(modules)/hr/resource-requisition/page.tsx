'use client'
import React, { useEffect } from 'react'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer } from '@/styles/common'
import { useRecruitments } from '@/hooks/modules/hr/useResourceRequistion'
import { useRouter } from 'next/navigation'
import { magicGridRowSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import {
  ACTIVE,
  DATA_DELETE_ROW,
  DATA_SOURCE_NAME,
  DELETE,
  DELETE_DATA_GRID,
  FIELD_STATUS,
  FORM_ID,
  PATHNAME,
  STATUS,
  STATUS_NAME,
  TITLE,
  UPDATE,
  ON_EDIT,
  INACTIVE,
  SUCCESS_COLOR,
  ERROR_MAIN,
  COLUMFIELDCONFIG,
  RESOURCE_REQUISITION,
} from '@/constants/modules/hr/resourceRequisition'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import { Box } from '@mui/material'
import { NUMBERMAP } from '@/constants/common'

/**
*Classification : Confidential
**/

const RecruitmentList: React.FC = () => {
  const router = useRouter()
  const {
    data: recruitmentData,
    isLoading,
    refetch,
  } = useRecruitments()
  const handleEdit = (id: string) => {
    router.push(`${ON_EDIT}${id}`)
  }
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    const currentTarget = e.currentTarget


    const result = await showActionAlert(DELETE)
    if (result.isConfirmed) {
      const target = currentTarget
      const newStatus = NUMBERMAP.ZERO
      target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus.toString())

      if ('value' in target) {
        target.value = newStatus.toString()
      }

      const response = await magicGridRowSave({
        containerID: FORM_ID,
        scopedEvents: target,
        eventClass: DELETE_DATA_GRID,
        dataframeworkOperatorType: UPDATE,
        dataframeworkOtherParamsBag: {},
        keys: {
          eqms_hr_resource_requisition: {
            id: parseInt(id),
          },
        },
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
      })

      if (
        response &&
        'response' in response &&
        (response.response as any)?.code ===
        magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        showActionAlert(SUCCESS)
        refetch()
      } else {
        showActionAlert(FAILED)
      }
    }
  }

  const columns = [
    {
      field: COLUMFIELDCONFIG.SNO.FIELD,
      headerName: COLUMFIELDCONFIG.SNO.HEADERNAME,
      flex: NUMBERMAP.HALF
    },
    {
      field: COLUMFIELDCONFIG.ROLE.FIELD,
      headerName: COLUMFIELDCONFIG.ROLE.HEADERNAME,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return params.row.role_name ?? params.value
      }
    },
    {
      field: COLUMFIELDCONFIG.DEPARTMENT.FIELD,
      headerName: COLUMFIELDCONFIG.DEPARTMENT.HEADERNAME,
      flex: NUMBERMAP.THREE_QUARTER
    },
    {
      field: COLUMFIELDCONFIG.OPENINGS.FIELD,
      headerName: COLUMFIELDCONFIG.OPENINGS.HEADERNAME,
      flex: NUMBERMAP.THREE_QUARTER,
      renderCell: (params: any) => {
        return params.row.openings ?? params.value
      }
    },
    {
      field: FIELD_STATUS,
      headerName: STATUS_NAME,
      flex: NUMBERMAP.HALF,
      renderCell: (params) => {
        let content;
        if (params.row.type) {
          content = 'Draft';
        } else if (params.value) {
          content = <Box color={SUCCESS_COLOR}>{ACTIVE}</Box>;
        } else {
          content = <Box color={ERROR_MAIN}>{INACTIVE}</Box>;
        }
        return content;
      }
    },
    {
      field: COLUMFIELDCONFIG.ACTIONS.FIELD,
      headerName: COLUMFIELDCONFIG.ACTIONS.HEADERNAME,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <ActionButton
          onEdit={() => handleEdit(params.row.resource_requisition_id)}
          onDelete={(e: React.MouseEvent) => handleDelete(e, params.row.resource_requisition_id)}
          dataSourceName={DATA_SOURCE_NAME}
          disabled={!params.row.status}
          deleteDisabled={params.row.type}
          dataFieldName={STATUS}
          dataStatus={params.row.status}
          value={params.row.status}
        />
      ),
    },
  ]
  useEffect(() => {
    refetch()
  }, [])

  return (
    <PageContainer>
      <CommonSharedTale
        title={TITLE}
        pathName={PATHNAME}
        Table={
          <DataTable
            rows={recruitmentData?.data ?? []}
            columns={columns}
            IdField={RESOURCE_REQUISITION}
            checkbox={false}
            loading={isLoading}
            customClassName={DATA_DELETE_ROW}
          />
        }
      />
    </PageContainer>
  )
}

export default RecruitmentList
