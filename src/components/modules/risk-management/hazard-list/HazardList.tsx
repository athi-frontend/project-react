'use client';
import React from 'react';
import {
  HazardListContainer,
  HazardListHeader,
  HazardListTitle,
  HazardListContent,
  HazardListInner,
  BackIconButton,
  QuestionTypography,
  AddHazardButton,
  BackArrowIcon,
  AddHazardIcon,
  AddHazardTypography,
  EmptyStateText,
} from '@/styles/modules/risk-management/riskAnalysisControl';
import { HazardListProps } from '@/types/modules/risk-management/riskAnalysisControl';
import ExpandableHazardItem from './ExpandableHazardItem';
import { HAZARD_LIST_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl';
import { NUMBERMAP } from '@/constants/common';
/**
 * Classification: Confidential
 */
const HazardList: React.FC<HazardListProps> = ({
  handleHazardback,
  hazards,
  isLoading = false,
  selectedQuestion,
  onAddHazard,
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
  isRiskAssessmentMode,
  isRiskControlMeasureMode,
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

  const mergedPermissions = { ...defaultPermissions, ...actionPermissions }

  const hazardContent =
    hazards.length === NUMBERMAP.ZERO ? (
      <EmptyStateText>{HAZARD_LIST_CONSTANTS.NO_HAZARD_MESSAGE}</EmptyStateText>
    ) : (
      hazards.map((hazard) => (
        <ExpandableHazardItem
          key={hazard.hazard_id.toString()}
          hazard={hazard}
          onAddRisk={onAddRisk}
          onAddRCM={onAddRCM}
          onToggleHazard={onToggleHazard}
          onToggleRisk={onToggleRisk}
          onEditHazard={onEditHazard}
          onEditRisk={onEditRisk}
          onEditRCM={onEditRCM}
          onDeleteHazard={onDeleteHazard}
          onDeleteRisk={onDeleteRisk}
          onDeleteRCM={onDeleteRCM}
          actionPermissions={mergedPermissions}
          isRiskAssessmentMode={isRiskAssessmentMode}
          isRiskControlMeasureMode={isRiskControlMeasureMode}
        />
      ))
    )

  return (
    <HazardListContainer>
      <HazardListHeader>
        <HazardListTitle>
          <BackIconButton onClick={()=>{handleHazardback()}}>
          <BackArrowIcon size={NUMBERMAP.THIRTYTWO} variant="Bold" />
          </BackIconButton>
          <QuestionTypography>
            {selectedQuestion}
          </QuestionTypography>
        </HazardListTitle>

        {mergedPermissions.allowAddHazard && (
          <AddHazardButton onClick={onAddHazard}>
            <AddHazardIcon size={NUMBERMAP.FIFTEEN} />
            <AddHazardTypography>
              {HAZARD_LIST_CONSTANTS.ADD_HAZARD}
            </AddHazardTypography>
          </AddHazardButton>
        )}
      </HazardListHeader>

      <HazardListContent>
        <HazardListInner>
          {!isLoading && hazardContent}
        </HazardListInner>
      </HazardListContent>
    </HazardListContainer>
  );
};

export default HazardList;
