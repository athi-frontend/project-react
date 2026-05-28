'use client'
import React from 'react'
import { RECORD_GENERATION_MODULES } from '@/constants/modules/purchase/recordGeneration'
import RecordGeneration from '@/components/modules/dnd/record-generation/RecordGeneration'

/**
 *Classification : Confidential
 **/

const PurchaseRecordGeneration: React.FC = () => {
  return <RecordGeneration moduleName={RECORD_GENERATION_MODULES.PURCHASE} />; 
}

export default PurchaseRecordGeneration

