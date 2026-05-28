import { showActionAlert } from '@/components/ui'
import {
  BUTTON_VARIANT,
  BUTTON_COLOR,
  SOURCE_LABEL,
  SOURCE_PLACEHOLDER,
  TEXTFIELD_ROWS,
  TEXTFIELD_VARIANT,
  FEEDBACK_PLACEHOLDER,
  DESCRIPTION_PLACEHOLDER,
  PAPER_ELEVATION,
  PAPER_VARIANT,
  INITIAL_FORM_DATA,
} from '@/constants/modules/dnd/marketStudy'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import { SourceOption, Feedback } from '@/types/modules/dnd/marketStudy'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'

export const ADD_BUTTON_CONFIG: {
  variant: string
  color: string
  startIcon?: ReactNode
} = {
  variant: BUTTON_VARIANT,
  color: BUTTON_COLOR,
}

export const MULTISELECT_CONFIG = {
  idField: 'source_id',
  valueField: 'source',
  label: SOURCE_LABEL,
  placeholder: SOURCE_PLACEHOLDER,
}

export const DESCRIPTION_TEXTFIELD_CONFIG: {
  multiline: boolean
  rows: number
  variant: string
  fullWidth: boolean
  placeholder: string
} = {
  multiline: true,
  rows: TEXTFIELD_ROWS,
  variant: TEXTFIELD_VARIANT,
  fullWidth: true,
  placeholder: DESCRIPTION_PLACEHOLDER,
}

export const FEEDBACK_TEXTFIELD_CONFIG: {
  multiline: boolean
  rows: number
  variant: string
  fullWidth: boolean
  placeholder: string
} = {
  multiline: true,
  rows: TEXTFIELD_ROWS,
  variant: TEXTFIELD_VARIANT,
  fullWidth: true,
  placeholder: FEEDBACK_PLACEHOLDER,
}

export const PAPER_CONFIG: {
  elevation: number
  variant: string
} = {
  elevation: PAPER_ELEVATION,
  variant: PAPER_VARIANT,
}

export const TYPOGRAPHY_TITLE_CONFIG = {
  variant: 'h6' as const,
  component: 'h2' as const,
  gutterBottom: true,
}

export const TYPOGRAPHY_SUBTITLE_CONFIG = {
  variant: 'body1' as const,
  color: 'text.secondary' as const,
  component: 'h2' as const,
  gutterBottom: true,
}

export const TYPOGRAPHY_FEEDBACK_CONFIG = {
  variant: 'body1' as const,
  component: 'h2' as const,
  gutterBottom: true,
}

export const SAVE_CANCEL_BUTTONS_MAIN = [
  { label: 'Cancel', onClick: () => {} },
  { label: 'Save', onClick: () => {} },
]

export const SAVE_CANCEL_BUTTONS_MODAL = [
  { label: 'Cancel', onClick: () => {} },
  { label: 'Save', onClick: () => {} },
]

export interface MarketResearchProps {
  initialFeedbacks?: Feedback[]
}

export const INITIAL_ERRORS = {
  SOURCES: '',
  DESCRIPTION: '',
  UPLOADED_FILE: '',
}

export const NEW_FEEDBACK_TEMPLATE = {
  id: () => Date.now().toString(),
  createdBy: 'User',
  created_date: () => new Date().toLocaleDateString(),
  market_feedback: '',
}

export const EMPTY_SOURCE: SourceOption = {
  source_id: '',
  source: '',
}

export const handleApiResponse = (
  response: { code: number },
  successCallback?: () => void,
  failureCallback?: () => void
) => {
  if (response.code === NUMBERMAP.TWOHUNDRED) {
    showActionAlert('success')
    if (successCallback) successCallback()
  } else {
    showActionAlert('denied')
    if (failureCallback) failureCallback()
  }
}

export const handleCancel = (
  setFormData: Dispatch<SetStateAction<typeof INITIAL_FORM_DATA>>,
  setErrors: Dispatch<SetStateAction<typeof INITIAL_ERRORS>>
) => {
  setFormData({
    sources: '',
    description: '',
    uploadedFile: [],
    documentIdToDelete: [],
  })
  setErrors({
    SOURCES: '',
    DESCRIPTION: '',
  })
}

export const getButtonAction = (
  label: string,
  cancelAction: () => void,
  saveAction: () => void
) => (label === 'Cancel' ? cancelAction : saveAction)

export const MARKET_RESEARCH_COLUMNS: GridColDef[] = [
  {
    field: 'market_research_study_id',
    headerName: 'S.No.',
    flex:1,
    headerClassName: 'table-header',
    cellClassName: 'table-cell',
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      return params.api.getAllRowIds().indexOf(params.id) + 1
    },
  },
  {
    field: 'source',
    headerName: 'Source',
    flex:2,
    headerClassName: 'table-header',
    cellClassName: 'table-cell',
    sortable: false,
    filterable: false,
  },
  {
    field: 'actions',
    headerName: 'Actions',
    flex:1,
    headerClassName: 'table-header',
    sortable: false,
    filterable: false,
  },
]
