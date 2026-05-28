'use client'
import React from 'react'
import RecordGeneration from '@/components/modules/risk-management/record-generation/RecordGeneration'
import { RECORD_GENERATION_MODULES } from '@/constants/modules/risk-management/recordGeneration'

/**
 *Classification : Confidential
 **/

const RiskRecordGenerationPage: React.FC = () => {
  return <RecordGeneration contextType={RECORD_GENERATION_MODULES.RISK} />
}

export default RiskRecordGenerationPage
