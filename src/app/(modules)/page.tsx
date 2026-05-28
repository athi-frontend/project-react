import { Typography, Box } from '@mui/material'

export default function HomePage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Welcome to eQMS
      </Typography>
    </Box>
  )
}
