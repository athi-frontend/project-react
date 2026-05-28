'use client'

import React from 'react'
import { Grid2, Box, IconButton, Typography, Tooltip, useTheme } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { DataTable, ButtonGroup, PageHeader } from '@/components/ui'
import { P20P40, PageContainer } from '@/styles/common'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'
import {
  INCOMING_INSPECTION_COPY,
  INCOMING_INSPECTION_STATUS,
  INCOMING_INSPECTION_UI,
} from '@/constants/modules/quality-control-management/incomingInspection'
import { INCOMING_INSPECTION_DETAILS_VIEW } from '@/constants/modules/quality-control-management/incomingInspectionDetailsView'
import { LabelContainer, LabelText, LabelValue } from '@/styles/components/modules/prototypeForm'
import { useIncomingInspectionDetail } from '@/hooks/modules/quality-control-management/useIncomingInspection'
import { ReceiptSearch } from 'iconsax-react'

const DISPLAY_PLACEHOLDER = INCOMING_INSPECTION_UI.PLACEHOLDERS.DEFAULT_VALUE

type InitiatePayload = {
  goodsInwardDetailId: number
  slug: 'unit' | 'batch'
}

const normalizeSlug = (value?: string | null): 'unit' | 'batch' => {
  const normalized = (value ?? '').toString().trim().toLowerCase()
  if (normalized === INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.BATCH) {
    return INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.BATCH
  }
  return INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.UNIT
}

const InspectionResultTypography: React.FC<{ value?: number }> = ({ value }) => {
  const isPass = value === NUMBERMAP.ONE
  const isFail = value === NUMBERMAP.TWO
  let displayLabel: string = DISPLAY_PLACEHOLDER
  let color: string = INCOMING_INSPECTION_DETAILS_VIEW.THEME_COLORS.TEXT_PRIMARY

  if (isPass) {
    displayLabel = INCOMING_INSPECTION_STATUS.PASS
    color = INCOMING_INSPECTION_DETAILS_VIEW.THEME_COLORS.SUCCESS_MAIN
  } else if (isFail) {
    displayLabel = INCOMING_INSPECTION_STATUS.FAIL
    color = INCOMING_INSPECTION_DETAILS_VIEW.THEME_COLORS.ERROR_MAIN
  }

  return (
    <Typography
      variant={INCOMING_INSPECTION_DETAILS_VIEW.TYPOGRAPHY.VARIANT_BODY2}
      component={INCOMING_INSPECTION_DETAILS_VIEW.TYPOGRAPHY.COMPONENT_SPAN}
      color={color}
    >
      {displayLabel}
    </Typography>
  )
}

export default function IncomingInspectionDetailsView(props: Readonly<{
  onInitiateInspection: (payload: InitiatePayload) => void
}>) {
  const { onInitiateInspection } = props
  const params = useParams()
  const router = useRouter()
  const rawInspectionId = params?.id
  const theme = useTheme()
  let purchaseOrderId = rawInspectionId
  if (Array.isArray(rawInspectionId)) {
    purchaseOrderId = rawInspectionId[NUMBERMAP.ZERO]
  }
  const { data: incomingInspectionResponse, isLoading } = useIncomingInspectionDetail(Number(purchaseOrderId))

  const columns: GridColDef[] = [
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.SNO,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_SNO,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.HALF,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.PART_NUMBER,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_PART_NUMBER,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.ONE,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.QUANTITY,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_QUANTITY,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.EIGHT_TENTH,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.SAFETY_CRITICAL,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_SAFETY_CRITICAL,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.ONE,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.BATCH_UNIT,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_BATCH_UNIT,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.EIGHT_TENTH,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.AQL,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_AQL,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.HALF,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.HARDWARE_SOFTWARE,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_HARDWARE_SOFTWARE,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.ONE_POINT_TWO,
      sortable: false,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.STATUS,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_STATUS,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.EIGHT_TENTH,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => <InspectionResultTypography value={params.value} />,
    },
    {
      field: INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.ACTIONS,
      headerName: INCOMING_INSPECTION_COPY.COLUMN_ACTIONS,
      flex: INCOMING_INSPECTION_DETAILS_VIEW.TABLE.FLEX.EIGHT_TENTH,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title={INCOMING_INSPECTION_COPY.TOOLTIP_INITIATE_INSPECTION}>
            <IconButton
              onClick={() => {
                const goodsInwardDetailId = Number(
                  params.row[INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.GOODS_INWARD_DETAIL_ID]
                )
                onInitiateInspection({
                  goodsInwardDetailId,
                  slug: normalizeSlug(params.row[INCOMING_INSPECTION_DETAILS_VIEW.TABLE_FIELDS.BATCH_UNIT]),
                })
              }}
            >
              <ReceiptSearch size={NUMBERMAP.EIGHTEEN} color={theme.palette.primary.main} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const handleBack = () => {
    router.push(INCOMING_INSPECTION_DETAILS_VIEW.ROUTES.BACK)
  }

  const getDisplayValue = (value?: string | null) => {
    if (value && value.trim() !== '') {
      return value
    }
    return DISPLAY_PLACEHOLDER
  }

  return (
    <PageContainer>
      <PageHeader title={INCOMING_INSPECTION_COPY.TITLE} />
      <Grid2 size={NUMBERMAP.SIX} sx={{ ml: INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_MARGIN_LEFT }}>
        <LabelContainer>
          <LabelText>{INCOMING_INSPECTION_COPY.PURCHASE_ORDER_NUMBER}</LabelText>
          <LabelValue>{getDisplayValue(incomingInspectionResponse?.data?.[NUMBERMAP.ZERO]?.purchase_order_number)}</LabelValue>
        </LabelContainer>
      </Grid2>
      <Grid2
        size={NUMBERMAP.SIX}
        sx={{
          ml: INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_MARGIN_LEFT,
          mt: INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_MARGIN_TOP,
        }}
      >
        <LabelContainer>
          <LabelText>{INCOMING_INSPECTION_COPY.PURCHASE_ORDER_DATE}</LabelText>
          <LabelValue>{getDisplayValue(incomingInspectionResponse?.data?.[NUMBERMAP.ZERO]?.purchase_order_date)}</LabelValue>
        </LabelContainer>
      </Grid2>

      <Grid2
        container
        spacing={INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_SPACING}
        sx={{
          ml: INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_MARGIN_LEFT,
          mt: INCOMING_INSPECTION_DETAILS_VIEW.GRID.HEADER_MARGIN_TOP,
        }}
      >
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <LabelContainer>
            <LabelText>{INCOMING_INSPECTION_COPY.VENDOR_TYPE}</LabelText>
            <LabelValue>{getDisplayValue(incomingInspectionResponse?.data?.[NUMBERMAP.ZERO]?.vendor_type)}</LabelValue>
          </LabelContainer>
        </Grid2>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
          <LabelContainer>
            <LabelText>{INCOMING_INSPECTION_COPY.VENDOR_NAME}</LabelText>
            <LabelValue>{getDisplayValue(incomingInspectionResponse?.data?.[NUMBERMAP.ZERO]?.vendor_name)}</LabelValue>
          </LabelContainer>
        </Grid2>
      </Grid2>

      <CommonSharedTale
        title={INCOMING_INSPECTION_COPY.PART_DETAILS}
        Table={
          <DataTable
            rows={incomingInspectionResponse?.data?.[NUMBERMAP.ZERO]?.part_details ?? []}
            columns={columns}
            IdField="goods_inward_detail_id"
            pagination
            checkbox={false}
            loading={isLoading}
          />
        }
      />

      <Box sx={P20P40}>
        <ButtonGroup
          buttons={[
            {
              label: INCOMING_INSPECTION_COPY.BUTTON_BACK,
              onClick: handleBack,
              variant: 'outlined',
            },
          ]}
        />
      </Box>
    </PageContainer>
  )
}
