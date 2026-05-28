'use client'
import React from 'react'
import { Collapse, Typography } from '@mui/material'
import {
  HazardItem,
  HazardHeader,
  HazardTitleSection,
  HazardTitleText,
  HazardActionSection,
  ActionIconsContainer,
  VerticalSeparator,
  AddRiskButton,
  AddRiskButtonDisabled,
  RiskListContainer,
  RiskHeader,
  RiskTitleSection,
  AddRCMButton,
  RCMListContainer,
  RCMItem,
  ExpandIcon,
  ActionIcon,
  ActionIconDisabled,
  AddIcon,
  RCMActionContainer,
  PrimaryArrowUpIcon,
  PrimaryArrowDownIcon,
  PrimaryEditIcon,
  ErrorTrashIcon,
  PrimaryAddSquareIcon,
  PrimaryAddSquareIconDisabled,
  EmptyStateText,
} from '@/styles/modules/risk-management/riskAnalysisControl'
import {
  ExpandableHazardItemProps,
  Risk,
  RiskControlMeasure,
} from '@/types/modules/risk-management/riskAnalysisControl'
import {
  HAZARD_LIST_CONSTANTS,
  RCM_APPROVAL_STATUS,
} from '@/constants/modules/risk-management/riskAnalysisControl'
import { NUMBERMAP } from '@/constants/common'
/**
 * Classification: Confidential
 */
const ExpandableHazardItem: React.FC<ExpandableHazardItemProps> = ({
  hazard,
  onAddRisk,
  onAddRCM,
  onToggleHazard,
  onToggleRisk,
  onEditHazard,
  onEditRisk,
  onEditRCM,
  onDeleteHazard,
  onDeleteRisk,
  onDeleteRCM,
  actionPermissions,
  isRiskAssessmentMode = false,
  isRiskControlMeasureMode = false,
}) => {
  const defaultPermissions = {
    allowAddHazard: true,
    allowEditHazard: true,
    allowDeleteHazard: true,
    allowAddRisk: true,
    allowEditRisk: true,
    allowDeleteRisk: true,
    allowAddRCM: true,
    allowEditRCM: true,
    allowDeleteRCM: true,
    showRiskSection: true,
  }

  const permissions = { ...defaultPermissions, ...actionPermissions }

  const allowExpand = permissions.showRiskSection
  const showRCMSection = [
    permissions.allowAddRCM,
    permissions.allowEditRCM,
    permissions.allowDeleteRCM,
  ].some((permission) => permission ?? false)
  const allowRiskExpand = allowExpand && showRCMSection
  const isRCMApproved = (rcm: RiskControlMeasure) =>
    rcm.rcm_status?.approval_status_name === RCM_APPROVAL_STATUS.APPROVED

  const renderRCMDeleteAction = (rcm: RiskControlMeasure) => {
    if (!permissions.allowDeleteRCM) return null
    if (isRCMApproved(rcm)) {
      return (
        <ActionIconDisabled>
          <ErrorTrashIcon size={NUMBERMAP.TWENTYONE} />
        </ActionIconDisabled>
      )
    }
    return (
      <ActionIcon onClick={() => onDeleteRCM(rcm.rcm_id.toString())}>
        <ErrorTrashIcon size={NUMBERMAP.TWENTYONE} />
      </ActionIcon>
    )
  }

  const renderRCMItem = (rcm: RiskControlMeasure) => (
    <RCMItem key={rcm.rcm_id.toString()}>
      <RiskTitleSection>
        <Typography>{rcm.title}</Typography>
      </RiskTitleSection>

      <RCMActionContainer>
        {permissions.allowEditRCM && (
          <ActionIcon onClick={() => onEditRCM(rcm.rcm_id.toString())}>
            <PrimaryEditIcon size={NUMBERMAP.TWENTYONE} />
          </ActionIcon>
        )}
        {renderRCMDeleteAction(rcm)}
      </RCMActionContainer>
    </RCMItem>
  )

  const renderRCMList = (risk: Risk) => {
    if (!allowRiskExpand) return null
    return (
      <Collapse in={risk.expanded}>
        <RCMListContainer>
          {risk.rcms.length === NUMBERMAP.ZERO ? (
            <EmptyStateText>
              {HAZARD_LIST_CONSTANTS.NO_RCM_MESSAGE}
            </EmptyStateText>
          ) : (
            risk.rcms.map(renderRCMItem)
          )}
        </RCMListContainer>
      </Collapse>
    )
  }

  const renderRiskHeaderActions = (
    risk: Risk,
    showRiskActions: boolean,
    showRCMButton: boolean
  ) => {
    const showRiskHeaderActions = [showRiskActions, showRCMButton].some(Boolean)
    if (!showRiskHeaderActions) return null
    return (
      <HazardActionSection>
        {showRiskActions && (
          <ActionIconsContainer>
            {permissions.allowEditRisk && (
              <ActionIcon onClick={() => onEditRisk(risk.risk_id.toString())}>
                <PrimaryEditIcon size={NUMBERMAP.TWENTYONE} />
              </ActionIcon>
            )}
            {permissions.allowDeleteRisk && (
              <ActionIcon onClick={() => onDeleteRisk(risk.risk_id.toString())}>
                <ErrorTrashIcon size={NUMBERMAP.TWENTYONE} />
              </ActionIcon>
            )}
          </ActionIconsContainer>
        )}

        {showRiskActions && showRCMButton && <VerticalSeparator />}

        {showRCMButton &&
          (shouldDisableAddRCM ? (
            <AddRiskButtonDisabled>
              <AddRCMButton onClick={() => onAddRCM(risk.risk_id.toString())}>
                <Typography>{HAZARD_LIST_CONSTANTS.ADD_RCM}</Typography>
                <AddIcon>
                  <PrimaryAddSquareIcon size={NUMBERMAP.TWENTYFOUR} />
                </AddIcon>
              </AddRCMButton>
            </AddRiskButtonDisabled>
          ) : (
            <AddRCMButton onClick={() => onAddRCM(risk.risk_id.toString())}>
              <Typography>{HAZARD_LIST_CONSTANTS.ADD_RCM}</Typography>
              <AddIcon>
                <PrimaryAddSquareIcon size={NUMBERMAP.TWENTYFOUR} />
              </AddIcon>
            </AddRCMButton>
          ))}
      </HazardActionSection>
    )
  }

  const showHazardActions = [
    permissions.allowEditHazard,
    permissions.allowDeleteHazard,
  ].some((permission) => permission ?? false)
  const showRiskButton = permissions.allowAddRisk && permissions.showRiskSection
  const shouldDisableAddRisk =
    isRiskAssessmentMode && hazard.risks.length > NUMBERMAP.ZERO
  const shouldDisableAddRCM =
    isRiskControlMeasureMode && hazard.risks.some(risk => risk.rcms.length > NUMBERMAP.ZERO)
  const handleHazardToggleClick = () => {
    if (!allowExpand) return
    onToggleHazard(hazard.hazard_id.toString())
  }

  const hazardExpanded = allowExpand ? hazard.expanded : false

  return (
    <HazardItem expanded={hazardExpanded}>
      <HazardHeader>
        <HazardTitleSection>
          {allowExpand && (
            <ExpandIcon onClick={handleHazardToggleClick}>
              {hazardExpanded ? (
                <PrimaryArrowUpIcon size={NUMBERMAP.TWENTYFOUR} />
              ) : (
                <PrimaryArrowDownIcon size={NUMBERMAP.TWENTYFOUR} />
              )}
            </ExpandIcon>
          )}
          <HazardTitleText>{hazard.event_description}</HazardTitleText>
        </HazardTitleSection>

        {(showHazardActions || showRiskButton) && (
          <HazardActionSection>
            {showHazardActions && (
              <ActionIconsContainer>
                {permissions.allowEditHazard && (
                  <ActionIcon
                    onClick={() => onEditHazard(hazard.hazard_id.toString())}
                  >
                    <PrimaryEditIcon size={NUMBERMAP.TWENTYONE} />
                  </ActionIcon>
                )}
                {permissions.allowDeleteHazard && (
                  <ActionIcon
                    onClick={() => onDeleteHazard(hazard.hazard_id.toString())}
                  >
                    <ErrorTrashIcon size={NUMBERMAP.TWENTYONE} />
                  </ActionIcon>
                )}
              </ActionIconsContainer>
            )}

            {showHazardActions && showRiskButton && <VerticalSeparator />}

            {showRiskButton && (
              shouldDisableAddRisk ? (
                <AddRiskButtonDisabled>
                  <Typography>
                    {HAZARD_LIST_CONSTANTS.ADD_RISK}
                  </Typography>
                  <AddIcon>
                    <PrimaryAddSquareIconDisabled
                      size={NUMBERMAP.TWENTYFOUR}
                    />
                  </AddIcon>
                </AddRiskButtonDisabled>
              ) : (
                <AddRiskButton
                  onClick={() => onAddRisk(hazard.hazard_id.toString())}
                >
                  <Typography>{HAZARD_LIST_CONSTANTS.ADD_RISK}</Typography>
                  <AddIcon>
                    <PrimaryAddSquareIcon size={NUMBERMAP.TWENTYFOUR} />
                  </AddIcon>
                </AddRiskButton>
              )
            )}
          </HazardActionSection>
        )}
      </HazardHeader>

      {allowExpand && (
        <Collapse in={hazardExpanded}>
          {hazard.risks.length === NUMBERMAP.ZERO ? (
            <EmptyStateText>
              {HAZARD_LIST_CONSTANTS.NO_RISK_MESSAGE}
            </EmptyStateText>
          ) : (
            hazard.risks.map((risk: Risk) => {
              const showRiskActions = [
                permissions.allowEditRisk,
                permissions.allowDeleteRisk,
              ].some((permission) => permission ?? false)
              const showRCMButton = allowRiskExpand && permissions.allowAddRCM
              const handleRiskToggleClick = () => {
                if (!allowRiskExpand) return
                onToggleRisk(risk.risk_id.toString())
              }
              return (
                <RiskListContainer key={risk.risk_id.toString()}>
                  <RiskHeader>
                    <RiskTitleSection>
                      {allowRiskExpand && (
                        <ExpandIcon onClick={handleRiskToggleClick}>
                          {risk.expanded ? (
                            <PrimaryArrowUpIcon size={NUMBERMAP.TWENTYFOUR} />
                          ) : (
                            <PrimaryArrowDownIcon size={NUMBERMAP.TWENTYFOUR} />
                          )}
                        </ExpandIcon>
                      )}
                      <HazardTitleText>{risk.title}</HazardTitleText>
                    </RiskTitleSection>
                    {renderRiskHeaderActions(
                      risk,
                      showRiskActions,
                      showRCMButton
                    )}
                  </RiskHeader>

                  {renderRCMList(risk)}
                </RiskListContainer>
              )
            })
          )}
        </Collapse>
      )}
    </HazardItem>
  )
}

export default ExpandableHazardItem
