'use client'
import ProtocolFormPage from '@/components/modules/production/oqc-procedure/ProtocolForm'
import { useParams } from 'next/navigation'
/**
    Classification : Confidential
**/
export default function TestProtocolByIdPage() {
  const { model_id } = useParams()
  return <ProtocolFormPage protocolType="test-protocol" modelMapperId={model_id}  />
}