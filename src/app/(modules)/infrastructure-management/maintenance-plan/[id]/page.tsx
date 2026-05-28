'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MaintenancePlanForm from '@/components/modules/infrastructure-management/infrastructure-onboarding/MaintenancePlanForm'
import { MaintenancePlanApiResponse } from '@/types/modules/infrastructure-management/maintenancePlan'
import { useGetMaintenancePlanById } from '@/hooks/modules/infrastructure-management/useMaintenancePlan'
import { NUMBERMAP } from '@/constants/common'
import { ROUTE_IDENTIFIERS } from '@/constants/modules/infrastructure-management/maintenancePlan'

/**
 * Classification : Confidential
 **/

const MaintenancePlanPage: React.FC = () => {
  const params = useParams()
  const maintenanceId = params?.id
  const isEditMode = maintenanceId && maintenanceId !== ROUTE_IDENTIFIERS.ADD && maintenanceId !== ROUTE_IDENTIFIERS.CREATE

  const [infrastructureCategory, setInfrastructureCategory] = useState<string>('')
  const [infrastructureType, setInfrastructureType] = useState<string>('')
  const [initialData, setInitialData] = useState<MaintenancePlanApiResponse | undefined>(undefined)

  // Fetch maintenance plan data for edit mode
  const { data: maintenancePlanData } = useGetMaintenancePlanById(
    isEditMode ? parseInt(maintenanceId as string) : NUMBERMAP.ZERO
  )

  // Populate form data when maintenance plan data is available
  useEffect(() => {
    if (isEditMode && maintenancePlanData?.data) {
      const planData: MaintenancePlanApiResponse = maintenancePlanData.data[NUMBERMAP.ZERO]

      if (planData) {
        setInfrastructureCategory(planData.infra_category_id?.toString() ?? '')
        setInfrastructureType(planData.infra_type_id?.toString() ?? '')
        setInitialData(planData)
      }else if(!Array.isArray(maintenancePlanData?.data)){
        const draftPlanData = maintenancePlanData?.data
        setInfrastructureCategory(draftPlanData?.infrastructureCategory?.toString() ?? '')
        setInfrastructureType(draftPlanData?.infrastructureType?.toString() ?? '')
        setInitialData(draftPlanData)
      }
    }
  }, [isEditMode, maintenancePlanData])

  return (
    <MaintenancePlanForm
      infrastructureCategoryValue={infrastructureCategory}
      infrastructureTypeValue={infrastructureType}
      onInfrastructureCategoryChange={setInfrastructureCategory}
      onInfrastructureTypeChange={setInfrastructureType}
      maintenanceId={isEditMode ? (maintenanceId as string) : undefined}
      initialData={initialData}
    />
  )
}

export default MaintenancePlanPage
