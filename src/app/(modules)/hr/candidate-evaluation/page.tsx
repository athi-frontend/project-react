'use client'
import React, { useEffect, useState } from 'react'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { CANDIDATE_EVALUATION_CONSTANTS, DELETE, FAILED, SUCCESS } from '@/constants/modules/hr/candidateEvaluation'
import { useCandidateEvaluationData } from '@/hooks/modules/hr/useCandidateEvaluation'
import { CandidateEvaluationResponse } from '@/types/modules/hr/candidateEvaluation'
import { magicGridRowSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { PageContainer } from '@/styles/modules/hr/candidateEvaluation'
import { NUMBERMAP } from '@/constants/common'
import { useRouter } from 'next/navigation'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { convertUtcToLocal } from '@/lib/utils/common'

const CandidatePage: React.FC = () => {
  const { data: candidateEvaluationResponse, isLoading, refetch } = useCandidateEvaluationData()
  const [rows, setRows] = useState<any[]>([])
  const router = useRouter();

  const handleEdit = async (e: React.MouseEvent, id: string) => {
    router.push(`${CANDIDATE_EVALUATION_CONSTANTS.PATH}/${id}`)
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
        containerID: CANDIDATE_EVALUATION_CONSTANTS.CONTAINER.FORM_ID,
        scopedEvents: target,
        eventClass: CANDIDATE_EVALUATION_CONSTANTS.DATA.DELETE_DATA_GRID,
        dataframeworkOperatorType: CANDIDATE_EVALUATION_CONSTANTS.OPERATION.UPDATE,
        dataframeworkOtherParamsBag: {},
        keys: {
          eqms_hr_candidate_evalution: {
            id: parseInt(id),
          },
        },
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
      })

      if (
        response &&
        'response' in response &&
        (response.response as any)?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        showActionAlert(SUCCESS)
        refetch()
      } else {
        showActionAlert(FAILED)
      }
    }
  }

  useEffect(() => {
    refetch()
  }, [])
  useEffect(() => {
    if (candidateEvaluationResponse?.data) {
      const output = candidateEvaluationResponse.data.map(
        (item: CandidateEvaluationResponse, index: number) => ({
          id: item.candidate_id?.toString(),
          candidate_id: item.candidate_id,
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.SERIAL_NO]: index + NUMBERMAP.ONE,
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.CANDIDATE_NAME]: item.candidate_first_name + ' ' + item.candidate_last_name,
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.RECRUITMENT_ID]: item.candidate_resource_requisition_id,
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_DATE]: item.date_of_interview 
            ? convertUtcToLocal(item.date_of_interview)
            : '',
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_STATUS]: item.interview_status,
          [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.ACTIONS]: '',
          ...item,
        })
      )
      setRows(output)
    }
  }, [candidateEvaluationResponse])

  const columns = [
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.SERIAL_NO,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.ONE,
      sortable: false,
    },
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.CANDIDATE_NAME,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.CANDIDATE_NAME,
      flex: NUMBERMAP.ONE,
    },
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.RECRUITMENT_ID,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.RECRUITMENT_ID,
      flex: NUMBERMAP.ONE,
    },
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_DATE,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.INTERVIEW_DATE,
      flex: NUMBERMAP.ONE,
      renderCell:(params)=>convertUtcToLocal(params.row.date_of_interview)
    },
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_STATUS,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.INTERVIEW_STATUS,
      flex: NUMBERMAP.ONE,
    },
      {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.STATUS,
      headerName: "Status",
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.ACTIONS,
      headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.ACTIONS,
      sortable: false,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          disabled={!params.row.status}
          onEdit={(e) => handleEdit(e, params.row.candidate_id)}
          onDelete={(e) => handleDelete(e, params.row.candidate_id)}
          dataSourceName={CANDIDATE_EVALUATION_CONSTANTS.DATA.DATA_SOURCE_NAME}
          dataFieldName={CANDIDATE_EVALUATION_CONSTANTS.DATA.STATUS}
          dataStatus={params.row.status}
          value={params.row.status}
        />
      ),
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={CANDIDATE_EVALUATION_CONSTANTS.LABELS.CANDIDATE_EVALUATION}
        pathName={CANDIDATE_EVALUATION_CONSTANTS.PATHNAME}
        Table={
          <DataTable
            rows={rows}
            columns={columns}
            IdField={CANDIDATE_EVALUATION_CONSTANTS.CONTAINER.ID}
            checkbox={false}
            loading={isLoading}
            customClassName={CANDIDATE_EVALUATION_CONSTANTS.DATA.DATA_DELETE_ROW}
          />
        }
      />
    </PageContainer>
  )
}

export default CandidatePage