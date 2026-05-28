'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import ClinicalEvaluationPage from '@/components/modules/dnd/clinical-evaluation/ClinicalEvaluationPage'
import {
  useClinicalEvaluationPlanById,
  useSaveClinicalEvaluationPlan,
} from '@/hooks/modules/dnd/useClinicalEvaluation'
import {
  HEADERS,
} from '@/constants/modules/dnd/clinicalEvaluation'

const ClinicalEvaluationPlan: React.FC = () => {
  const params = useParams()
  const id = params.id as string
  const { data: getEvaluationData, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } = useClinicalEvaluationPlanById(Number.parseInt(id))
  const { mutate: saveEvaluation, isPending } = useSaveClinicalEvaluationPlan()

  return (
    <ClinicalEvaluationPage
      getEvaluationData={getEvaluationData}
      isLoadingSpecifications={isLoadingSpecifications}
      isFetchingSpecifications={isFetchingSpecifications}
      saveEvaluation={saveEvaluation}
      isPending={isPending}
      documentsKey="planDocuments"
      title={HEADERS.CLINICAL_EVALUATION_PLAN}
      subHeader={HEADERS.PLAN}
      errorMessageKey="PLAN_DOCUMENTS"
      fieldLabelKey="planDocuments"
    />
  )
}

export default ClinicalEvaluationPlan
