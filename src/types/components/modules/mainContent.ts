import { EditingItem } from '../../modules/dnd/functionalBlock'
export interface MainContentComponentProps {
  onSave: (
    title: string,
    description: string,
    editingItem?: EditingItem
  ) => void
  onCancel: () => void
  editingItem?: EditingItem
}
