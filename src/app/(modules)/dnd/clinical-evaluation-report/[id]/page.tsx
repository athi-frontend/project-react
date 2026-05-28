'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ClinicalEvaluationPage from '@/components/modules/dnd/clinical-evaluation/ClinicalEvaluationPage'
import {
  useClinicalEvaluationReportById,
  useSaveClinicalEvaluationReport,
} from '@/hooks/modules/dnd/useClinicalEvaluation'
import {
  HEADERS,
} from '@/constants/modules/dnd/clinicalEvaluation'

const ClinicalEvaluationReport: React.FC = () => {
  const params = useParams()
  const id = params.id as string
  const { data: getEvaluationData, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } = useClinicalEvaluationReportById(Number.parseInt(id))
  const { mutate: saveEvaluation, isPending } = useSaveClinicalEvaluationReport()

  return (
    <ClinicalEvaluationPage
      getEvaluationData={getEvaluationData}
      isLoadingSpecifications={isLoadingSpecifications}
      isFetchingSpecifications={isFetchingSpecifications}
      saveEvaluation={saveEvaluation}
      isPending={isPending}
      documentsKey="reportDocuments"
      title={HEADERS.CLINICAL_EVALUATION_REPORT}
      subHeader={HEADERS.REPORT}
      errorMessageKey="REPORT_DOCUMENTS"
      fieldLabelKey="reportDocuments"
    />
  )
}

export default ClinicalEvaluationReport
