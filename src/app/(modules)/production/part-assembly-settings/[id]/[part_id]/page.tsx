'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Box } from '@mui/material'
import {  Label } from '@/components/ui'
import { PageContainer, P20P40 } from '@/styles/common'
import DIRComponent from '@/components/ui/stepper/DIRComponent'
import AssemblyWorkInstructionForm from '@/components/modules/production/assembly-settings/AssemblyWorkInstructionForm'
import AssemblyDrawingsForm, {
  AssemblyDrawing,
} from '@/components/modules/production/assembly-settings/AssemblyDrawingsForm'
import ShelfLifeForm from '@/components/modules/production/assembly-settings/ShelfLifeForm'
import ElectricalDrawingsForm, {
  ElectricalDrawing,
} from '@/components/modules/production/assembly-settings/ElectricalDrawingsForm'
import ItemExcludedIQAForm from '@/components/modules/production/assembly-settings/ItemExcludedIQAForm'
import SerialBatchNumberForm from '@/components/modules/production/assembly-settings/SerialBatchNumberForm'
import InventoryDetailsForm from '@/components/modules/production/assembly-settings/InventoryDetailsForm'
import StorageEnvironmentDetailsForm from '@/components/modules/production/assembly-settings/StorageEnvironmentDetailsForm'
import IncommingInspectionCriteria from '@/components/modules/production/assembly-settings/incomming-inspection/IncommingInspectionCriteria'
import { NUMBERMAP } from '@/constants/common';
import { useBillOfMaterialSettings } from '@/hooks/modules/production/useCommonProductionDropDownHook'
import { STEPS } from '@/constants/modules/production/common'
/**
 * Classification: Confidential
 * Assembly Settings Page
 */

const AssemblySettingsPage: React.FC = () => {
  const params = useParams()
  const assemblyPartItemId = params?.part_id ? Number(params.part_id) : undefined
  const assemblyPartItemDetailId = params?.part_id ? Number(params.part_id) : null // Using same ID for now, adjust if different
  const partAssemblyDetailId = params?.part_id ? Number(params.part_id) : undefined // Using same ID for now, adjust if different
  const applicableSettingsId = params?.id ? Number(params.id) : undefined
  const [currentStep, setCurrentStep] = useState<number>(null)
  const {data:stepDrodown,refetch:fetchStepperDropdown} = useBillOfMaterialSettings(partAssemblyDetailId??null,false)
  const [drawings, setDrawings] = useState<AssemblyDrawing[]>([])
  const [electricalDrawings, setElectricalDrawings] = useState<ElectricalDrawing[]>([])
  const [stepperData,setStepperData] = useState([])

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }
 
  const updateStepperState = (dropdowndata) =>{
    const output  =  dropdowndata?.configuration_settings?.map((item)=>{
      return {
        id:item.feature_id,
        title:item.feature_name,
        ...item
      }
    }) ?? []
    setCurrentStep(output?.[NUMBERMAP.ZERO]?.id??NUMBERMAP.ONE)
    setStepperData(output)
  }
  useEffect(()=>{
    fetchStepperDropdown()
  },[])
  useEffect(()=>{
    if(stepDrodown?.data?.length>NUMBERMAP.ZERO){
      updateStepperState(stepDrodown?.data[NUMBERMAP.ZERO])
    }
  },[stepDrodown])

  const getCurrentStepName = (stepId)=>{
    return stepperData.find(s => s.id == stepId)?.title?? ''
  }
  return (
    <PageContainer>
      <Box sx={{ padding: P20P40 }}>
        <DIRComponent steps={stepperData??[]} getCurrentStep={handleStepChange} currentSteps={currentStep} />
      </Box>
      {
        currentStep !== null && stepperData.find(s => s.id === currentStep)?.title !== STEPS.ELECTRICAL_DRAWINGS && (
          <Label title={stepperData?.find(s => s.id === currentStep)?.title ?? 'No Record Found'} />
        )
      }

      {getCurrentStepName(currentStep) === STEPS.ASSEMBLY_SETTING_WORK && assemblyPartItemDetailId!=null && (
        <AssemblyWorkInstructionForm
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
          onSaveSuccess={() => {
          }}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.PART_ASSEMBLY_DRAWINGS && (
        <AssemblyDrawingsForm
          drawings={drawings}
          onDrawingsChange={setDrawings}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.SHELF_LIFE && (
        <ShelfLifeForm
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.ELECTRICAL_DRAWINGS && (
        <ElectricalDrawingsForm
          drawings={electricalDrawings}
          onDrawingsChange={setElectricalDrawings}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.ITEM_EXCLUDED_FROM_IQA_WITH_JUSTIFICATIONS && (
        <ItemExcludedIQAForm
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.SERIAL_BATCH_NUMBER && (
        <SerialBatchNumberForm
          partAssemblyDetailId={partAssemblyDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.INVENTORY_DETAILS && (
        <InventoryDetailsForm
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemId={assemblyPartItemId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.STORAGE_AND_ENVIRONMENT_DETAILS && (
        <StorageEnvironmentDetailsForm
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}

      {getCurrentStepName(currentStep) === STEPS.INCOMING_INSPECTION && (
        <IncommingInspectionCriteria
          partAssemblyDetailId={applicableSettingsId}
          assemblyPartItemDetailId={assemblyPartItemDetailId}
        />
      )}
    </PageContainer>
  )
}

export default AssemblySettingsPage
