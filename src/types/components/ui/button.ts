export interface ButtonProps {
  label: string
  onClick?: () => void
  icon?: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  disabled?: boolean
  className?: string
  variant?: string
  color?: string
}

export interface ButtonGroupProps {
  buttons: ButtonProps[]
}
