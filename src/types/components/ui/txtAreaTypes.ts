export interface DescriptionProps {
  value: string
  label: string
  placeholder: string
  onChange: (value: string) => void
  error?: string
}
