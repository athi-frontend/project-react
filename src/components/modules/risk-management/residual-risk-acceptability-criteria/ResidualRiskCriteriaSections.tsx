/**
 *Classification : Confidential
 **/
'use client'
import React from 'react'
import { ContentContainer } from '@/styles/common'
import CriteriaSectionComponent from '@/components/modules/risk-management/residual-risk-acceptability-criteria/CriteriaSection'
import {
  CriteriaSection,
  FormData,
  ResidualRiskCriteriaSectionsProps,
} from '@/types/modules/risk-management/residualRiskCriteria'

const ResidualRiskCriteriaSections: React.FC<
  ResidualRiskCriteriaSectionsProps
> = ({
  formData,
  errors,
  probabilityOptions,
  severityOptions,
  operatorOptions,
  onSectionChange,
  isReadOnly = false,
}) => {
  const renderCriteriaSection = (section: CriteriaSection) => {
    const sectionKey = section.id as keyof FormData

    return (
      <CriteriaSectionComponent
        key={sectionKey}
        section={section}
        errors={errors}
        sectionKey={sectionKey}
        severityOptions={severityOptions}
        probabilityOptions={probabilityOptions}
        operatorOptions={operatorOptions}
        onChange={onSectionChange}
        disabled={isReadOnly}
      />
    )
  }

  return (
    <ContentContainer>
      {renderCriteriaSection(formData.patientSurvival)}
      {renderCriteriaSection(formData.qualityOfLife)}
      {renderCriteriaSection(formData.functionPreservation)}
      {renderCriteriaSection(formData.functionEnhancement)}
      {renderCriteriaSection(formData.symptomRelief)}
      {renderCriteriaSection(formData.lifeSupport)}
      {renderCriteriaSection(formData.durationOfEffect)}
    </ContentContainer>
  )
}

export default ResidualRiskCriteriaSections
