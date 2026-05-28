'use client'

import ProtocolFormPage from '@/components/modules/production/oqc-procedure/ProtocolForm'
import { useParams } from 'next/navigation'

/**
 * Classification: Confidential
 * Burn-in Protocol Form Page – uses ProtocolFormPage with set_burn_in context and set_burn_in_id in POST.
 * URL: /production/burn-in/protocol/[projectId]/[burnInId]/[protocolOrMapperId] (no query, no mode segment)
 */
export default function BurnInProtocolPage() {
  const params = useParams<{ projectId: string; burnInId: string; protocolOrMapperId: string }>()
  const projectId = params?.projectId ?? ''
  const burnInId = params?.burnInId ?? ''
  const protocolOrMapperId = params?.protocolOrMapperId ?? ''

  return (
    <ProtocolFormPage
      protocolType="burn-in-protocol"
      modelMapperId={protocolOrMapperId ? Number(protocolOrMapperId) : undefined}
      projectId={projectId}
      burnInId={burnInId ? Number(burnInId) : undefined}
    />
  )
}
