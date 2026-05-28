import * as React from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { FileInfo } from '@/types/modules/dnd/projectPlan'

const renderActionsCell = () => {
  const containerStyle = { display: 'flex', gap: '16px' }

  // Create the container div
  const container = React.createElement(
    'div',
    { style: containerStyle },
    // View icon
  )

  return container
}

export const FILE_INFO_COLUMNS: GridColDef[] = [
  { field: 'fileName', headerName: 'File Name', flex: 1 },
  { field: 'source', headerName: 'Source', flex: 1 },
  { field: 'dateOfUpload', headerName: 'Date of Upload', flex: 1 },
  { field: 'fileCategory', headerName: 'File Category', flex: 1 },
  { field: 'fileStatus', headerName: 'File Status', flex: 1 },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    renderCell: renderActionsCell,
  },
]

export const FILE_INFO_ROWS: FileInfo[] = [
  {
    id: 1,
    fileName: 'File 1.pdf',
    source: 'Label',
    dateOfUpload: 'Label',
    fileCategory: 'Label',
    fileStatus: 'Label',
  },
  {
    id: 2,
    fileName: 'File 2.pdf',
    source: 'Label',
    dateOfUpload: 'Label',
    fileCategory: 'Label',
    fileStatus: 'Label',
  },
  {
    id: 3,
    fileName: 'File 3.pdf',
    source: 'Label',
    dateOfUpload: 'Label',
    fileCategory: 'Label',
    fileStatus: 'Label',
  },
]
