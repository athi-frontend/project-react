import { actionMessages } from '@/constants/components/ui/actionModal'

export type StatusKey = Exclude<keyof typeof actionMessages, 'customAlert'>

export interface CustomAlert {
  title: string
  text: string
  icon: 'warning' | 'error' | 'success' | 'info'
  cancelButton: boolean
  confirmButton: boolean
}
