'use client'

import React, { useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import IncomingInspectionForm from '@/components/modules/quality-control-management/incoming-inspection/IncomingInspectionForm'
import IncomingInspectionDetailsView from '@/components/modules/quality-control-management/incoming-inspection/IncomingInspectionDetailsView'
import { useIncomingInspectionDetail } from '@/hooks/modules/quality-control-management/useIncomingInspection'
import { INCOMING_INSPECTION_DETAILS_VIEW } from '@/constants/modules/quality-control-management/incomingInspectionDetailsView'
import { NUMBERMAP } from '@/constants/common'

type ViewMode = 'form' | 'details'

const normalizeSlug = (value?: string | null): 'unit' | 'batch' => {
  const normalized = (value ?? '').toString().trim().toLowerCase()
  if (normalized === INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.BATCH) {
    return INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.BATCH
  }
  return INCOMING_INSPECTION_DETAILS_VIEW.SLUGS.UNIT
}

const IncomingInspectionDirectDynamicPage: React.FC = () => {
  const params = useParams()
  const rawInspectionId = params?.id
  const rawGoodsInwardDetailId = params?.goodsInwardDetailId

  const purchaseOrderId = Array.isArray(rawInspectionId)
    ? Number(rawInspectionId[NUMBERMAP.ZERO])
    : Number(rawInspectionId)

  const initialGoodsInwardDetailId = Array.isArray(rawGoodsInwardDetailId)
    ? Number(rawGoodsInwardDetailId[NUMBERMAP.ZERO])
    : Number(rawGoodsInwardDetailId)

  const [mode, setMode] = useState<ViewMode>('form')
  const [currentGoodsInwardDetailId, setCurrentGoodsInwardDetailId] = useState<number>(
    initialGoodsInwardDetailId
  )
  const { data: detailResponse } = useIncomingInspectionDetail(purchaseOrderId)

  const derivedSlug = useMemo(() => {
    const detailData = detailResponse?.data?.[NUMBERMAP.ZERO]?.part_details ?? []
    const matchedRow = Array.isArray(detailData) 
      ? detailData.find((row) => Number(row?.goods_inward_detail_id) === currentGoodsInwardDetailId)
      : null
    return normalizeSlug(matchedRow?.batch_unit)
  }, [detailResponse, currentGoodsInwardDetailId])

  if (Number.isNaN(purchaseOrderId) || Number.isNaN(currentGoodsInwardDetailId)) {
    return null
  }

  if (mode === 'details') {
    return (
      <IncomingInspectionDetailsView
        onInitiateInspection={({ goodsInwardDetailId, slug }) => {
          setCurrentGoodsInwardDetailId(goodsInwardDetailId)
          setMode('form')
        }}
      />
    )
  }

  return (
    <IncomingInspectionForm
      goodsInwardDetailId={currentGoodsInwardDetailId}
      slug={derivedSlug}
      onDone={() => setMode('details')}
      onSaved={() => setMode('details')}
    />
  )
}

export default IncomingInspectionDirectDynamicPage
