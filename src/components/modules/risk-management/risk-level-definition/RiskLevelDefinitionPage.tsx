'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Box from '@mui/material/Box'
import {
  StyledTabs,
  StyledTab,
  TabsFormWrapper,
  ContentFormWrapper,
  RiskNavigationWrapper,
} from '@/styles/modules/risk-management/riskLevelDefinition'
import { RISK_DEFINITION_LEVEL_CONSTANTS } from '@/constants/modules/risk-management/riskLevelDefinition'
import {
  RiskLevel,
  ProbabilityLevelAPI,
  SeverityLevelAPI,
  ProbabilityLevelData,
  SeverityLevelData,
  TabPanelProps,
} from '@/types/modules/risk-management/riskLevelDefinition'
import RiskLevelCard from './RiskLevelCard'
import { Grid2 } from '@mui/material'
import { FormContent } from '@/styles/modules/user/userOnboard'
import { Label } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import ProbabilityLevelModal from './ProbabilityLevelModal'
import SeverityLevelModal from './SeverityLevelModal'
import {
  useGetAllProbabilityLevels,
  useGetAllSeverityLevels,
  useUpsertProbabilityLevel,
  useUpsertSeverityLevel,
} from '@/hooks/modules/risk-management/useRiskLevelDefinition'
import {
  getProbabilityLevelById,
  getSeverityLevelById,
} from '@/services/modules/risk-management/riskLevelDefinition'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import RiskNavigationButtonGroup from '@/components/modules/risk-management/RiskNavigationButtonGroup'
import { ActionControl } from '@/types/modules/risk-management/common'

/**
 *Classification : Confidential
 **/
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const RiskLevelDefinitionPage: React.FC = () => {
  const params = useParams()
  const projectId = Number(params.id)

  const [value, setValue] = useState(NUMBERMAP.ZERO)
  const [isProbabilityModalOpen, setIsProbabilityModalOpen] = useState(false)
  const [isSeverityModalOpen, setIsSeverityModalOpen] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<RiskLevel | undefined>(undefined)
  const [modalPermissions, setModalPermissions] =
    useState<ActionControl['permissions']>([])

  // API hooks
  const { data: probabilityLevelsData, isLoading: isLoadingProbability } =
    useGetAllProbabilityLevels(projectId)
  const { data: severityLevelsData, isLoading: isLoadingSeverity } =
    useGetAllSeverityLevels(projectId)

  // Mutation hooks
  const upsertProbabilityLevelMutation = useUpsertProbabilityLevel()
  const upsertSeverityLevelMutation = useUpsertSeverityLevel()

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  /**
   * Function Name: handleEdit
   * Params: level (RiskLevel)
   * Description: Handles editing of risk level by fetching fresh data and opening appropriate modal
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleEdit = async (level: RiskLevel) => {
    setSelectedLevel(level)

    try {
      if (
        level.type === RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.PROBABILITY
      ) {
        // Fetch fresh data for probability level before opening modal
        const templateId = parseInt(level.id) // level.id is now template_id
        const probabilityData = await getProbabilityLevelById(
          projectId,
          templateId
        )
        if (
          probabilityData?.data &&
          probabilityData.data.length > NUMBERMAP.ZERO
        ) {
          // Update the level with fresh data
          const freshData = probabilityData.data[NUMBERMAP.ZERO] // Get first item from array
          const updatedLevel = {
            ...level,
            apiData: freshData,
          }
          setSelectedLevel(updatedLevel)
        }
        setModalPermissions(
          probabilityData?.meta_info?.action_control?.permissions ?? []
        )
        setIsProbabilityModalOpen(true)
      } else if (
        level.type === RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.SEVERITY
      ) {
        // Fetch fresh data for severity level before opening modal
        const templateId = parseInt(level.id) // level.id is now template_id
        const severityData = await getSeverityLevelById(projectId, templateId)
        if (severityData?.data && severityData.data.length > NUMBERMAP.ZERO) {
          // Get the first item from array since we're fetching by template_id
          const freshData = severityData.data[NUMBERMAP.ZERO]
          const updatedLevel = {
            ...level,
            apiData: freshData,
          }
          setSelectedLevel(updatedLevel)
        }
        setModalPermissions(
          severityData?.meta_info?.action_control?.permissions ?? []
        )
        setIsSeverityModalOpen(true)
      }
    } catch {
      setModalPermissions([])
      // Still open modal with existing data if fetch fails
      if (
        level.type === RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.PROBABILITY
      ) {
        setIsProbabilityModalOpen(true)
      } else if (
        level.type === RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.SEVERITY
      ) {
        setIsSeverityModalOpen(true)
      }
    }
  }

  const renderProbabilityLevels = () => {
    const levels =
      probabilityLevelsData?.data?.map((level: ProbabilityLevelAPI) => ({
        id: level.template_id.toString(),
        title: level.level_name,
        value: `${level.level_value} (${level.numerator}/${level.denominator})`,
        description: level.description,
        type: RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.PROBABILITY,
        apiData: level,
      })) ?? []

    return (
      <>
        <Label
          title={RISK_DEFINITION_LEVEL_CONSTANTS.HEADINGS.PROBABILITY_LEVELS}
        />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            {levels.map((level) => (
              <RiskLevelCard key={level.id} level={level} onEdit={handleEdit} />
            ))}
          </Grid2>
        </FormContent>
      </>
    )
  }

  const renderSeverityLevels = () => {
    const levels =
      severityLevelsData?.data?.map((level: SeverityLevelAPI) => ({
        id: level.template_id.toString(),
        title: level.level_name,
        value: level.level_value,
        description: level.description,
        type: RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.SEVERITY,
        apiData: level,
      })) ?? []

    return (
      <>
        <Label
          title={RISK_DEFINITION_LEVEL_CONSTANTS.HEADINGS.SEVERITY_LEVELS}
        />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            {levels.map((level) => (
              <RiskLevelCard key={level.id} level={level} onEdit={handleEdit} />
            ))}
          </Grid2>
        </FormContent>
      </>
    )
  }

  /**
   * Function Name: handleProbabilitySave
   * Params: data (ProbabilityLevelData)
   * Description: Saves probability level data with calculated level_value and closes modal
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleProbabilitySave = (data: ProbabilityLevelData) => {
    // Use the fetched data from selectedLevel for template_id only
    const probabilityApiData = selectedLevel?.apiData as ProbabilityLevelAPI
    const templateId =
      probabilityApiData?.template_id ??
      parseInt(selectedLevel?.id ?? String(NUMBERMAP.ZERO))

    // Calculate level_value using the same logic as backend
    const levelValue =
      data.numerator && data.denominator
        ? parseFloat(
            (data.numerator / data.denominator).toFixed(NUMBERMAP.THREE)
          )
        : NUMBERMAP.ZERO

    const payload = {
      template_id: templateId,
      project_id: projectId,
      level_name: data.level_name,
      numerator: data.numerator,
      denominator: data.denominator,
      level_value: levelValue,
      description: data.description,
    }

    upsertProbabilityLevelMutation.mutate(payload, {
      onSuccess: () => {
        setIsProbabilityModalOpen(false)
        setSelectedLevel(undefined)
        setModalPermissions([])
      },
    })
  }

  /**
   * Function Name: handleSeveritySave
   * Params: data (SeverityLevelData)
   * Description: Saves severity level data with null handling for level_value and closes modal
   * Author: Madhumitha
   * Created: 06-09-2025
   * Modified:
   * Classification: Confidential
   */
  const handleSeveritySave = (data: SeverityLevelData) => {
    // Use the fetched data from selectedLevel for template_id only
    const severityApiData = selectedLevel?.apiData as SeverityLevelAPI
    const templateId =
      severityApiData?.template_id ??
      parseInt(selectedLevel?.id ?? String(NUMBERMAP.ZERO))

    const payload = {
      template_id: templateId,
      project_id: projectId,
      level_name: data.level_name,
      level_value: data.level_value ? parseFloat(data.level_value) : null,
      description: data.description,
    }

    upsertSeverityLevelMutation.mutate(payload, {
      onSuccess: () => {
        setIsSeverityModalOpen(false)
        setSelectedLevel(undefined)
        setModalPermissions([])
      },
    })
  }

  return (
    <>
      <GlobalLoader loading={isLoadingProbability ?? isLoadingSeverity} />
      <TabsFormWrapper>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="risk definition level tabs"
        >
          <StyledTab
            label={RISK_DEFINITION_LEVEL_CONSTANTS.TABS.PROBABILITY_LEVELS}
            {...a11yProps(NUMBERMAP.ZERO)}
          />
          <StyledTab
            label={RISK_DEFINITION_LEVEL_CONSTANTS.TABS.SEVERITY_LEVELS}
            {...a11yProps(NUMBERMAP.ONE)}
          />
        </StyledTabs>
      </TabsFormWrapper>

      <ContentFormWrapper>
        <CustomTabPanel value={value} index={NUMBERMAP.ZERO}>
          {renderProbabilityLevels()}
        </CustomTabPanel>

        <CustomTabPanel value={value} index={NUMBERMAP.ONE}>
          {renderSeverityLevels()}
        </CustomTabPanel>
        <RiskNavigationWrapper>
        <RiskNavigationButtonGroup projectId={projectId} />
      </RiskNavigationWrapper>
      </ContentFormWrapper>
      

      {/* Probability Level Modal */}
      <ProbabilityLevelModal
        open={isProbabilityModalOpen}
        onClose={() => {
          setIsProbabilityModalOpen(false)
          setModalPermissions([])
        }}
        onCancel={() => {
          setIsProbabilityModalOpen(false)
          setModalPermissions([])
        }}
        onSave={handleProbabilitySave}
        initialData={selectedLevel}
        projectId={projectId}
        permissions={modalPermissions}
      />

      {/* Severity Level Modal */}
      <SeverityLevelModal
        open={isSeverityModalOpen}
        onClose={() => {
          setIsSeverityModalOpen(false)
          setModalPermissions([])
        }}
        onCancel={() => {
          setIsSeverityModalOpen(false)
          setModalPermissions([])
        }}
        onSave={handleSeveritySave}
        initialData={selectedLevel}
        projectId={projectId}
        permissions={modalPermissions}
      />
    </>
  )
}

export default RiskLevelDefinitionPage
