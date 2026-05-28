/**
 *Classification : Confidential
 **/

import { Suspense } from 'react'
import ResidualRiskCriteriaForm from '@/components/modules/risk-management/residual-risk-acceptability-criteria/ResidualRiskCriteriaForm'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { ResidualRiskCriteriaPageProps } from '@/types/modules/risk-management/residualRiskCriteria'

export default async function ResidualRiskCriteriaPage({
  params,
}: ResidualRiskCriteriaPageProps) {
  const resolvedParams = await params
  const projectId = Number(resolvedParams.id)

  return (
    <Suspense fallback={<GlobalLoader loading={true} />}>
      <ResidualRiskCriteriaForm projectId={projectId} />
    </Suspense>
  )
}
