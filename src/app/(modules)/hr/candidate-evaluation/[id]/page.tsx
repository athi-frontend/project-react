'use client'
import dynamic from 'next/dynamic'
const CandidateEvaluation = dynamic(
  () => import('@/components/modules/hr/candidate/AddCandidateFrom'),
  {
    ssr: false,
  }
)

export default function SimpleListPage() {
  return <CandidateEvaluation />
}
