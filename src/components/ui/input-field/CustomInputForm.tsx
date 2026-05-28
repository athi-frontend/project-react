import React from 'react'
import { Stack, TextField, IconButton } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { customOptionStyle } from '@/styles/components/ui/dropdown'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification : Confidential
 **/

interface CustomInputFormProps {
  placeholder: string
  customInputValue: string
  setCustomInputValue: (v: string) => void
  onSave: (value: string) => void
  onCancel: () => void
  keyValue: string
  error?: string | null
}

const CustomInputForm: React.FC<CustomInputFormProps> = ({
  placeholder,
  customInputValue,
  setCustomInputValue,
  onSave,
  onCancel,
  keyValue,
  error,
}) => {
  return (
    <li key={keyValue}>
      <Stack direction="row" spacing={NUMBERMAP.ONE} sx={customOptionStyle}>
        <TextField
          size="small"
          autoFocus
          fullWidth
          placeholder={placeholder}
          value={customInputValue}
          onChange={(e) => setCustomInputValue(e.target.value)}
          error={!!error}
          helperText={error ?? ''}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onSave(customInputValue.trim())
            }
            if (e.key === 'Escape') {
              e.preventDefault()
              onCancel()
            }
          }}
        />
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault(); e.stopPropagation()
            onSave(customInputValue.trim())
          }}
          color="primary"
          sx={{ margin: '0px !important' }}
          disabled={!customInputValue.trim() || !!error}
        >
          <CheckCircleIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault(); e.stopPropagation()
            onCancel()
          }}
          sx={{ margin: '0px !important' }}

        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </li>
  )
}

export default CustomInputForm
