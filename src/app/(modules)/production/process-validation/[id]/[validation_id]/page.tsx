'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Box from '@mui/material/Box'
import {
  StyledTabs,
  StyledTab,
  TabsFormWrapper,
  ContentFormWrapper,
} from '@/styles/modules/risk-management/riskLevelDefinition'
import { NUMBERMAP } from '@/constants/common'
import { Label } from '@/components/ui'
import { FormWrapper } from '@/styles/modules/user/userOnboard'
import InstallationQualityForm from '@/components/modules/production/process-validation/InstallationQualityForm'
import OperationQualityForm from '@/components/modules/production/process-validation/OperationQualityForm'
import PerformanceQualityForm from '@/components/modules/production/process-validation/PerformanceQualityForm'
import {
  OperationQualityFormData,
  PerformanceQualityFormData,
  TabPanelProps,
} from '@/types/modules/production/process-validation'
import { PROCESS_VALIDATION_DETAIL_PAGE_LABELS } from '@/constants/modules/production/process-validation'

/**
 * Classification : Confidential
 */

function ProcessValidationTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`process-validation-tabpanel-${index}`}
      aria-labelledby={`process-validation-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function getProcessValidationTabA11yProps(index: number) {
  return {
    id: `process-validation-tab-${index}`,
    'aria-controls': `process-validation-tabpanel-${index}`,
  }
}

const ProcessValidationPage: React.FC = () => {
  const params = useParams()

  // URL structure: /production/process-validation/[projectId]/[process_checklist_id]
  const processChecklistId = Number(params.validation_id )
  const processChecklistDetailId = Number(params.id)
  const [value, setValue] = useState(NUMBERMAP.ZERO)


  const [operationQualityData, setOperationQualityData] = useState<OperationQualityFormData>({
    worstCaseSettings: [],
    bestCaseSettings: [],
  })

  const [performanceQualityData, setPerformanceQualityData] =
    useState<PerformanceQualityFormData>({
      performanceQualificationDetails: [],
      finalResultDetails: [],
    })

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <FormWrapper>
      <Label title={PROCESS_VALIDATION_DETAIL_PAGE_LABELS.TITLE} />
      <TabsFormWrapper>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label={PROCESS_VALIDATION_DETAIL_PAGE_LABELS.TABS_ARIA_LABEL}
        >
          <StyledTab
            label={PROCESS_VALIDATION_DETAIL_PAGE_LABELS.INSTALLATION_QUALIFICATION_TAB}
            {...getProcessValidationTabA11yProps(NUMBERMAP.ZERO)}
          />
          <StyledTab
            label={PROCESS_VALIDATION_DETAIL_PAGE_LABELS.OPERATIONAL_QUALIFICATION_TAB}
            {...getProcessValidationTabA11yProps(NUMBERMAP.ONE)}
          />
          <StyledTab
            label={PROCESS_VALIDATION_DETAIL_PAGE_LABELS.PERFORMANCE_QUALIFICATION_TAB}
            {...getProcessValidationTabA11yProps(NUMBERMAP.TWO)}
          />
        </StyledTabs>
      </TabsFormWrapper>

      <ContentFormWrapper>
        <ProcessValidationTabPanel value={value} index={NUMBERMAP.ZERO}>
          <InstallationQualityForm
            processChecklistDetailId={processChecklistDetailId}
            processChecklistId={processChecklistId}
          />
        </ProcessValidationTabPanel>

        <ProcessValidationTabPanel value={value} index={NUMBERMAP.ONE}>
          <OperationQualityForm
            processChecklistId={processChecklistId}
            formData={operationQualityData}
            onFormDataChange={setOperationQualityData}
          />
        </ProcessValidationTabPanel>

        <ProcessValidationTabPanel value={value} index={NUMBERMAP.TWO}>
          <PerformanceQualityForm
            processChecklistDetailId={processChecklistDetailId}
            processChecklistId={processChecklistId}
            formData={performanceQualityData}
            onFormDataChange={setPerformanceQualityData}
          />
        </ProcessValidationTabPanel>
      </ContentFormWrapper>
    </FormWrapper>
  )
}

export default ProcessValidationPage
