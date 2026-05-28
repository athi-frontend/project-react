import { NUMBERMAP } from '@/constants/common'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box } from '@mui/material'

export const CustomSortingIcon = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        paddingLeft: '3px',
      }}
    >
      <ExpandLessIcon sx={{ fontSize: NUMBERMAP.EIGHTEEN }} />
      <ExpandMoreIcon sx={{ fontSize: NUMBERMAP.EIGHTEEN }} />
    </Box>
  )
}
