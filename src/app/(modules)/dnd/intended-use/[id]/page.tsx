'use client'
import { useParams, useRouter } from 'next/navigation'
import IntendedUseForm from '../IntendedUseForm'

function IntendedUseFormWrapper() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id
  const handleCancel = () => {
    router.push('/dnd/project/list')
  }

  return <IntendedUseForm ProjectId={projectId} onCancel={handleCancel} />
}

export default function IntendedUsePage({ params, searchParams }: PageProps) {
  return <IntendedUseFormWrapper />
}
