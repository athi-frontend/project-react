'use client'
import React from 'react'
import { Button } from '@mui/material'
import { AddRowButtonProps } from '@/types/modules/dnd/formTeam'
import AddIcon from '@mui/icons-material/Add'

const AddRowButton: React.FC<AddRowButtonProps> = ({ title, onClick }) => {
  return (
    <Button
      variant="outlined"
      component="span"
      onClick={onClick}
      sx={{ alignSelf: 'stretch', margin: 'auto 0' }}
    >
      <AddIcon />

      {title}
    </Button>
  )
}

export default AddRowButton
