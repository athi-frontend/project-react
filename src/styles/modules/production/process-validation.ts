/**
 * Classification: Confidential
 * Process Validation Styles
 */
import { Box } from '@mui/material'
import { styled } from '@mui/system'

export const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '20px',
  paddingRight: '40px',
})

export const SectionTitle = styled(Box)({
  marginBottom: '20px',
})

export const SectionTitleTypography = {
  fontSize: '24px',
  fontWeight: 600,
  color: '#111827',
  fontFamily: 'Poppins, sans-serif',
}

export const ValidationActionCell = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};

export const ValidationActionText = {
  textDecoration: 'underline',
  cursor: 'pointer',
  textAlign: 'center',
};

