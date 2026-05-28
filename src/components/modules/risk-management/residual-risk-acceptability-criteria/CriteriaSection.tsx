/**
 *Classification : Confidential
 **/

'use client'
import React from 'react'
import { Box, Grid2 } from '@mui/material'
import { Description, InputField } from '@/components/ui'
import SubHeader from '@/components/modules/regulation/executive-summary/SubHeader'
import { NUMBERMAP } from '@/constants/common'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import {
  RESIDUAL_RISK_CRITERIA_FORM_LABELS,
  RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS,
  RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS,
} from '@/constants/modules/risk-management/residualRiskCriteria'
import {
  CriteriaSection as CriteriaSectionType,
  CriteriaSectionProps,
} from '@/types/modules/risk-management/residualRiskCriteria'
import { numberValidation } from '@/lib/utils/common'

const CriteriaSection: React.FC<CriteriaSectionProps> = ({
  section,
  errors,
  sectionKey,
  severityOptions,
  probabilityOptions,
  operatorOptions,
  onChange,
  disabled = false,
}) => {
  return (
    <Box key={section.id} id={section.id}>
      <Grid2 container sx={STYLE5}>
        <SubHeader title={section.title} />
      </Grid2>

      <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
        <Grid2 size={NUMBERMAP.SIX} sx={STYLE5} id={`${RESIDUAL_RISK_CRITERIA_FORM_LABELS.ACCEPTANCE_CRITERIA_DESCRIPTION} (${section.title})`}        >
          <Description
            label={
              RESIDUAL_RISK_CRITERIA_FORM_LABELS.ACCEPTANCE_CRITERIA_DESCRIPTION
            }
            value={section.description}
            disabled={disabled}
            onChange={(value) =>
              onChange(
                sectionKey,
                'description' as keyof CriteriaSectionType,
                value
              )
            }
            placeholder={
              RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS.ACCEPTANCE_CRITERIA_DESCRIPTION
            }
            error={errors[`${sectionKey}_description`]}
            maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} id={`${RESIDUAL_RISK_CRITERIA_FORM_LABELS.MAX_ALLOWED} (${section.title})`}>
          <InputField
            label={RESIDUAL_RISK_CRITERIA_FORM_LABELS.MAX_ALLOWED}
            placeholder={
              RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS.MAX_ALLOWED
            }
            value={ section.maxAllowed}
            onChange={(value: string) => {

              if (numberValidation.test(value) || value === '') {
                onChange(
                  sectionKey,
                  'maxAllowed' as keyof CriteriaSectionType,
                  value
                )
              }
            }}
            error={errors[`${sectionKey}_maxAllowed`]}
            disabled={disabled}
            maxLength={NUMBERMAP.NINE}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} id={`${RESIDUAL_RISK_CRITERIA_FORM_LABELS.OPERATOR} (${section.title})`}>
          <InputField
            label={RESIDUAL_RISK_CRITERIA_FORM_LABELS.OPERATOR}
            placeholder={RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS.OPERATOR}
            isDropdown
            options={operatorOptions}
            keyField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.OPERATOR.KEY_FIELD
            }
            valueField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.OPERATOR
                .VALUE_FIELD
            }
            value={section.operator}
            onChange={(value: string) =>
              onChange(
                sectionKey,
                'operator' as keyof CriteriaSectionType,
                value
              )
            }
            error={errors[`${sectionKey}_operator`]}
            disabled={disabled}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} id={`${RESIDUAL_RISK_CRITERIA_FORM_LABELS.PROBABILITY_LEVEL} (${section.title})`}>
          <InputField
            label={RESIDUAL_RISK_CRITERIA_FORM_LABELS.PROBABILITY_LEVEL}
            placeholder={
              RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS.PROBABILITY_LEVEL
            }
            isDropdown
            options={probabilityOptions}
            keyField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.PROBABILITY_LEVEL
                .KEY_FIELD
            }
            valueField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.PROBABILITY_LEVEL
                .VALUE_FIELD
            }
            value={section.probabilityLevel}
            onChange={(value: string) =>
              onChange(
                sectionKey,
                'probabilityLevel' as keyof CriteriaSectionType,
                value
              )
            }
            error={errors[`${sectionKey}_probabilityLevel`]}
            disabled={disabled}
          />
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} id={`${RESIDUAL_RISK_CRITERIA_FORM_LABELS.SEVERITY_LEVEL} (${section.title})`}>
          <InputField
            label={RESIDUAL_RISK_CRITERIA_FORM_LABELS.SEVERITY_LEVEL}
            placeholder={
              RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS.SEVERITY_LEVEL
            }
            isDropdown
            options={severityOptions}
            keyField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.SEVERITY_LEVEL
                .KEY_FIELD
            }
            valueField={
              RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS.SEVERITY_LEVEL
                .VALUE_FIELD
            }
            value={section.severityLevel}
            onChange={(value: string) =>
              onChange(
                sectionKey,
                'severityLevel' as keyof CriteriaSectionType,
                value
              )
            }
            error={errors[`${sectionKey}_severityLevel`]}
            disabled={disabled}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default CriteriaSection
