'use client'
import React from 'react'
import { Box } from '@mui/material'
import { DataGridTable } from '@/components/ui'
import { ReviewItem } from '@/types/modules/dnd/pndReview'
import { FIELD_NAMES } from '@/constants/modules/dnd/pnd-review'
import { GridColDef } from '@mui/x-data-grid'
import { REVIEWTABLESTYLES } from '@/styles/modules/dnd/pnd'

interface PndReviewTableProps {
  reviewItems: ReviewItem[]
  onItemChange: (item: ReviewItem) => void
  columns: GridColDef[]
  id?: string
  onAddRow?: () => void
  showAddButton?: boolean
}

const PndReviewTable: React.FC<PndReviewTableProps> = ({
  reviewItems,
  onItemChange,
  columns,
  id,
  onAddRow,
  showAddButton = false,
}) => {
  return (
    <Box sx={REVIEWTABLESTYLES}>
      <DataGridTable
        rows={reviewItems}
        columns={columns}
        onRowChange={(newRow) => onItemChange(newRow as ReviewItem)}
        showAddButton={showAddButton}
        onAddRow={onAddRow}
        hideFooter={true}
        autoHeight={true}
        disableColumnMenu={true}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        disableSelectionOnClick={true}
        hideHeader={false}
        idField={id ?? FIELD_NAMES.ITEM_ID}
      />
    </Box>
  )
}

export default PndReviewTable
