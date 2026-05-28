'use client'
import React from 'react'
import { TableContainer } from '@/styles/components/ui/table'
import AcknowledgementForm from '@/components/modules/dnd/AcknowledgementForm'

export default function AcknowledgementPage() {
  return (
    <TableContainer>
      <AcknowledgementForm />
    </TableContainer>
  )
}
