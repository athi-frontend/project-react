'use client'
import { Box, CircularProgress } from '@mui/material'
import { projectDetailsLoaderContainer } from '@/styles/modules/dnd/project-details/ProjectDetailsLoader'

/**
 * Classification : Confidential
 * Full width loader component specifically for project details page
 */

type ProjectDetailsLoaderProps = {
  readonly loading: boolean
}

const ProjectDetailsLoader = ({ loading }: ProjectDetailsLoaderProps) => {
  if (!loading) return null

  return (
    <Box sx={projectDetailsLoaderContainer}>
      <CircularProgress color="primary" />
    </Box>
  )
}

export default ProjectDetailsLoader
