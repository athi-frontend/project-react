interface Specification {
  id: number
  parameter: string
  specification: string
}

interface AddSpecificationModalProps {
  open: boolean
  onClose: () => void
  onSave: (specification: Specification) => void
  specification: Specification | null
}
interface Specification1 {
  id: number
  parameter: string
  specification: string
}

interface SpecificationTableProps {
  specifications: Specification1[]
  onEdit: (specification: Specification1) => void
  onDelete: (id: number) => void
}
export type {
  Specification,
  AddSpecificationModalProps,
  Specification1,
  SpecificationTableProps,
}
