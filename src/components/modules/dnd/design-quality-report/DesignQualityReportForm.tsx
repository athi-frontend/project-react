'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import {
  Label,
  DataGridTable,
} from '@/components/ui'
import { Content, FormSection } from '@/styles/modules/dnd/designReviewReport'
import {
  FORM_TITLE,
  ITEM_FOR_TEST_COLUMNS,
  EXECUTION_DIR_COLUMNS,
  VERIFICATION_DIR_COLUMNS,
  LABELS,
  FIELD_NAMES,
  DEFAULT_VALUES,
} from '@/constants/modules/dnd/designQualityReport'
import { Grid2 } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import {
  LabelContainer,
  LabelText,
  LabelValue,
} from '@/styles/components/modules/prototypeForm'
import { NUMBERMAP } from '@/constants/common'
import { useQualityByOrderId } from '@/hooks/modules/dnd/useDesignQualityReport'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { stripHtml } from '@/lib/utils/common'

/**
 Classification : Confidential
**/

const DesignQualityReportForm: React.FC = () => {
  const params = useParams()
  const executionStageId = params.order_id
  const { data: qualityData, isLoading: qualityLoading, isFetching: qualityFetching } = useQualityByOrderId(
    Number(executionStageId)
  )

  const isAnyLoading = () => {
    if (qualityLoading) return true
    if (qualityFetching) return true
    return false
  }

  const executionDirColumnsWithRenderCell: GridColDef[] = EXECUTION_DIR_COLUMNS.map((col) => {
    if (col.field === FIELD_NAMES.DIR_DESCRIPTION) {
      return {
        ...col,
        renderCell: (params: any) => stripHtml(params.value ?? '') ?? DEFAULT_VALUES.EMPTY,
      }
    }
    return col
  })

  const verificationDirColumnsWithRenderCell: GridColDef[] = VERIFICATION_DIR_COLUMNS.map((col) => {
    if (col.field === FIELD_NAMES.ACCEPTANCE_CRITERIA) {
      return {
        ...col,
        renderCell: (params: any) => stripHtml(params.value ??  '') ?? DEFAULT_VALUES.EMPTY,
      }
    }
    return col
  })

  return (
    <>
      <GlobalLoader loading={isAnyLoading()} />
        <Content>
          <Label title={FORM_TITLE} />
          <FormSection>
            <Grid2 container spacing={NUMBERMAP.ONE}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <LabelContainer>
                  <LabelText>{LABELS.STAGE}</LabelText>
                  <LabelValue>{qualityData?.data?.[NUMBERMAP.ZERO]?.stage_name ?? DEFAULT_VALUES.EMPTY}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <DataGridTable
                  title={LABELS.ITEM_FOR_TEST}
                  columns={ITEM_FOR_TEST_COLUMNS}
                  rows={qualityData?.data?.[NUMBERMAP.ZERO]?.item_for_test_batch ?? []}
                  idField={FIELD_NAMES.ID}
                  hideFooter
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <DataGridTable
                  title={LABELS.EXECUTION_DIRS}
                  columns={executionDirColumnsWithRenderCell}
                  rows={qualityData?.data?.[NUMBERMAP.ZERO]?.execution_dir ?? []}
                  idField={FIELD_NAMES.ID}
                  hideFooter
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <LabelContainer>
                  <LabelText>{LABELS.TEST_METHODS_ACCEPTANCE_CRITERIA}</LabelText>
                  <LabelValue>{stripHtml(qualityData?.data?.[NUMBERMAP.ZERO]?.test_method_acceptance_criteria ?? '') ?? DEFAULT_VALUES.EMPTY}</LabelValue>
                </LabelContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <DataGridTable
                  title={LABELS.VERIFICATION_DIR}
                  columns={verificationDirColumnsWithRenderCell}
                  rows={qualityData?.data?.[NUMBERMAP.ZERO]?.verification_dir ?? []}
                  idField={FIELD_NAMES.ID}
                  hideFooter
                />
              </Grid2>
            </Grid2>
          </FormSection>
        </Content>
    </>
  )
}

export default DesignQualityReportForm

