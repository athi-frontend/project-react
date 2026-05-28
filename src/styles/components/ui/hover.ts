import { styled } from '@mui/material/styles'
import { Typography, SxProps, Theme  } from '@mui/material'

const VersionControlMain = {position:"fixed",bottom:0,textAlign:"center",left:13}

const HoverIcon = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'color 0.3s',
  '&:hover svg': {
    color: theme.palette.primary.main,
  },
}))

const HoverText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.secondary.main,
  },
}))

const SubMenu = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.hoverBg,
  },
}))

const HoverProfileMenuSx: SxProps<Theme> = (theme) =>  ({
  color: theme.palette.text.primary,
  transition: 'color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.text.main, 
  },
})

const listItemButtonStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

export { HoverIcon, HoverText, SubMenu, HoverProfileMenuSx ,VersionControlMain,listItemButtonStyle}
