import React from 'react'
import { InputAdornment, IconButton } from '@mui/material'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'

interface PasswordVisibilityToggleProps {
  showPassword: boolean
  togglePasswordVisibility: () => void
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  showPassword,
  togglePasswordVisibility,
}) => {
  return (
    <InputAdornment position={LOGIN_CONSTANTS.END_POSITION}>
      <IconButton
        aria-label={LOGIN_CONSTANTS.TOGGLE_PASSWORD_VISIBILITY_LABEL}
        onClick={togglePasswordVisibility}
        edge={LOGIN_CONSTANTS.END_POSITION}
        size={LOGIN_CONSTANTS.SMALL_SIZE}
      >
        {showPassword ? (
          <VisibilityIcon fontSize={LOGIN_CONSTANTS.SMALL_SIZE} />
        ) : (
          <VisibilityOffIcon fontSize={LOGIN_CONSTANTS.SMALL_SIZE} />
        )}
      </IconButton>
    </InputAdornment>
  )
}

export default PasswordVisibilityToggle
