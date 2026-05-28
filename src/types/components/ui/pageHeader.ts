import { ButtonProps } from './button'

export interface PageHeaderProps {
  title: string
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  actionButtons?: ButtonProps[]
  customClassName?: string
} 