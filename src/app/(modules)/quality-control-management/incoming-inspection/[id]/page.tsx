'use client'

import React, { useState } from 'react'
import IncomingInspectionDetailsView from '@/components/modules/quality-control-management/incoming-inspection/IncomingInspectionDetailsView'
import IncomingInspectionForm from '@/components/modules/quality-control-management/incoming-inspection/IncomingInspectionForm'

type ViewMode = 'details' | 'initiate'

export default function IncomingInspectionPage() {
  const [mode, setMode] = useState<ViewMode>('details')
  const [goodsInwardDetailId, setGoodsInwardDetailId] = useState<number | undefined>(undefined)
  const [slug, setSlug] = useState<'unit' | 'batch'>('unit')

  if (mode === 'initiate') {
    if (goodsInwardDetailId === undefined || goodsInwardDetailId === null) {
      return (
        <IncomingInspectionDetailsView
          onInitiateInspection={({ goodsInwardDetailId, slug }) => {
            setGoodsInwardDetailId(goodsInwardDetailId)
            setSlug(slug)
            setMode('initiate')
          }}
        />
      )
    }
    return (
      <IncomingInspectionForm
        goodsInwardDetailId={goodsInwardDetailId}
        slug={slug}
        onDone={() => setMode('details')}
        onSaved={() => setMode('details')}
      />
    )
  }

  return (
    <IncomingInspectionDetailsView
      onInitiateInspection={({ goodsInwardDetailId, slug }) => {
        setGoodsInwardDetailId(goodsInwardDetailId)
        setSlug(slug)
        setMode('initiate')
      }}
    />
  )
}
