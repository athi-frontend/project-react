import { styled } from '@mui/material/styles'
import { Box, Autocomplete, Chip, Typography } from '@mui/material'
import {
  Container as CommonContainer,
  ModalContent as CommonModalContent,
} from '@/styles/common'

/**
 *Classification : Confidential
 **/

  /**
      *Classification : Confidential
  **/

export const customOptionStyle = { width: '100%',paddingTop:"15px",paddingLeft:"10px" }
export const POPPERSTYLE  = {
                border: '1px solid #888'
              }
const DropdownContainer = styled(CommonContainer)(({ theme }) => ({
  maxWidth: '800px',
  fontWeight: 400,
}))

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiAutocomplete-inputRoot': {
    borderRadius: '10px',
    fontSize: '16px',
    '& fieldset': {
      borderColor: theme.palette.text.secondary,
    },
  },
}))

const DropDownIcons = (theme) => ({
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.secondary,
  },
})
const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '5px',
  border: `1px solid ${theme.palette.text.secondary}`,
  backgroundColor: theme.palette.text.main,
  padding: '5px 10px',
  margin: '2px',
}))

const ModalContainer = styled(CommonModalContent)(({ theme }) => ({
  maxWidth: '580px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'flex-start',
  padding: '20px 40px',
}))

const ListContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '500px',
  flexDirection: 'column',
  color: '#000000',
  justifyContent: 'flex-start',
  maxHeight: '400px',
  overflowY: 'auto' as const,
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-track': {
    background: theme.palette.background.light,
    borderRadius: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.text.secondary,
    borderRadius: '3px',
    '&:hover': {
      background: theme.palette.text.primary,
    },
  },
}))

const ListTitle = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '20px',
  color: theme.palette.text.primary,
}))

const ListItemsWrapper = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
  width: '100%',
  fontSize: '16px',
  fontWeight: '400',
  padding: '0 4px 8px 0',
}))

const ListItem = styled(Box)(({ theme }) => ({
  borderRadius: '5px',
  backgroundColor: 'var(--Secondary-lite, #EAD6FA)',
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
  wordBreak: 'break-word' as const,
}))

export const iconstyles = {
  paddingRight: "10px", fontSize: '26px'
}
export {
  DropdownContainer,
  StyledAutocomplete,
  StyledChip,
  ModalContainer,
  ListContainer,
  ListTitle,
  ListItemsWrapper,
  ListItem,
  DropDownIcons,
}
