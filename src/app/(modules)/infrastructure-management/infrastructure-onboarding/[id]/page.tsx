'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Box from '@mui/material/Box'
import {
  StyledTabs,
  LocalStyledTab,
  TabsFormWrapper,
  ContentFormWrapper,
} from '@/styles/modules/infrastructure-management/infrastructureOnboarding'
import { NUMBERMAP } from '@/constants/common'
import { Label } from '@/components/ui'
import { FormWrapper } from '@/styles/modules/user/userOnboard'
import {
  InfrastructureRequestForm,
  InstallationReportForm,
  InfrastructureQualificationChecklist,
  InfrastructureMaintenacePlan,
} from '@/components/modules/infrastructure-management/infrastructure-onboarding'
import { INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS } from '@/constants/modules/infrastructure-management/infrastructureOnboardingTabs'
import { TabPanelProps } from '@/types/modules/infrastructure-management/infrastructureOnboardingTabs'

/**
 * Classification : Confidential
 **/

function InfrastructureOnboardingTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`infrastructure-tabpanel-${index}`}
      aria-labelledby={`infrastructure-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function infrastructureOnboardingA11yProps(index: number) {
  return {
    id: `infrastructure-tab-${index}`,
    'aria-controls': `infrastructure-tabpanel-${index}`,
  }
}

const InfrastructureOnboardingPage: React.FC = () => {
  const params = useParams()
  const infrastructureId = params?.id ? parseInt(params.id as string) : null
  const [value, setValue] = useState(NUMBERMAP.ZERO)
  const [savedInfrastructureId, setSavedInfrastructureId] = useState<number | null>(
    infrastructureId
  )
  const [savedStatus, setSavedStatus] = useState<number | null>(null)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const handleInfrastructureSaveSuccess = (id: number, status: number) => {
    setSavedInfrastructureId(id)
    setSavedStatus(status)
  }

  return (
    <FormWrapper>
      <Label title={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.TITLE} />
      <TabsFormWrapper>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.ARIA_LABEL}
        >
          <LocalStyledTab
            label={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.TAB_LABELS.INFRASTRUCTURE_ONBOARDING}
            {...infrastructureOnboardingA11yProps(NUMBERMAP.ZERO)}
          />
          <LocalStyledTab
            label={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.TAB_LABELS.INSTALLATION_REPORT}
            {...infrastructureOnboardingA11yProps(NUMBERMAP.ONE)}
            disabled={!savedInfrastructureId}
          />
          <LocalStyledTab
            label={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.TAB_LABELS.INFRASTRUCTURE_QUALIFICATION_CHECKLIST}
            {...infrastructureOnboardingA11yProps(NUMBERMAP.TWO)}
            disabled={!savedInfrastructureId}
          />
          <LocalStyledTab
            label={INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS.TAB_LABELS.MAINTENANCE_PLAN}
            {...infrastructureOnboardingA11yProps(NUMBERMAP.THREE)}
            disabled={!savedInfrastructureId}
          />
        </StyledTabs>
      </TabsFormWrapper>

      <ContentFormWrapper>
        <InfrastructureOnboardingTabPanel value={value} index={NUMBERMAP.ZERO}>
          <InfrastructureRequestForm 
            infrastructureId={savedInfrastructureId ?? infrastructureId} 
            onSaveSuccess={handleInfrastructureSaveSuccess}
          />
        </InfrastructureOnboardingTabPanel>

        <InfrastructureOnboardingTabPanel value={value} index={NUMBERMAP.ONE}>
          <InstallationReportForm 
            infrastructureId={savedInfrastructureId} 
            status={savedStatus}
          />
        </InfrastructureOnboardingTabPanel>

        <InfrastructureOnboardingTabPanel value={value} index={NUMBERMAP.TWO}>
          <InfrastructureQualificationChecklist infrastructureId={savedInfrastructureId} />
        </InfrastructureOnboardingTabPanel>

        <InfrastructureOnboardingTabPanel value={value} index={NUMBERMAP.THREE}> 
          <InfrastructureMaintenacePlan infrastructureId={savedInfrastructureId} />
        </InfrastructureOnboardingTabPanel>
      </ContentFormWrapper>
    </FormWrapper>
  )
}

export default InfrastructureOnboardingPage
