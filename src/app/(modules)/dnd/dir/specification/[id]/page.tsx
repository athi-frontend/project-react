'use client'
import dynamic from 'next/dynamic'
const DIRSpecification = dynamic(
  () => import('@/components/modules/dnd/dir/Specification'),
  { ssr: false }
)
function Specification() {
  return <DIRSpecification />
}

export default Specification
