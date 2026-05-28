import React from 'react'
import { PageContainer, UnderLine } from '@/styles/common'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataTable } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import Link from 'next/link'
import { useFetchAllEvaluation } from '@/hooks/modules/hr/useTrainingEvaluation'
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
  STRING_LITERALS,
  S_NO,
  TITLE,
  EVALUATION_DATE,
  TITLE_EVALUATION_DATE,
  TRAINER,
  NAME_OF_TRAINER,
  MODE_OF_TRAINING,
  TITLE_MODE_OF_TRAINING,
} from '@/constants/modules/hr/trainingEvaluation'
import { formatDate } from '@/lib/utils/common'

/**
 * Classification: confidential
 */

const TrainingEvaluationTable: React.FC<{
  title: string
  pathName: string
}> = ({ title, pathName }) => {
  const {
    data: trainingEvaluationResponse,
    isLoading,
  } = useFetchAllEvaluation()

  const trainingEvaluationList = trainingEvaluationResponse?.data ?? []
  const columns = [
    {
      field: STRING_LITERALS.SNO,
      headerName: S_NO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TITLE,
      headerName: STRING_LITERALS.TITLE_OF_TRAINING_HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: EVALUATION_DATE,
      headerName: TITLE_EVALUATION_DATE,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const rawDate = params.row.date ?? params.row.evaluation_date
        return rawDate ? formatDate(rawDate) : ''
      },
    },
    {
      field: TRAINER,
      headerName: NAME_OF_TRAINER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const firstName = params.row.trainer_first_name ?? ''
        const lastName = params.row.trainer_last_name ?? ''
        return `${firstName} ${lastName}`.trim()
      },
    },
    {
      field: MODE_OF_TRAINING,
      headerName: TITLE_MODE_OF_TRAINING,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => params.row.location,
    },
    {
      field: 'action',
      headerName: 'View',
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link
          href={`${pathName}/${params.row.training_evaluation_id}`}
          style={UnderLine}
        >
          View Files
        </Link>
      ),
    },
  ]
  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField={STRING_LITERALS.TRAINING_EVALUATION_ID}
            rows={trainingEvaluationList}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default TrainingEvaluationTable
