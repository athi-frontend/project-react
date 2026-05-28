import { SxProps, Theme } from '@mui/system'
import { NUMBERMAP } from '@/constants/common'
import { INCOMING_INSPECTION_BATCH_HEADER } from '@/constants/modules/quality-control-management/incomingInspection'

/**
 * Classification : Confidential
 **/

export const getDeviationNoteValueBoxStyles = (
  index: number,
  totalFields: number
): SxProps<Theme> => ({
  borderBottom:
    index === totalFields - 1 ? 'none' : '1px solid rgba(216, 216, 216, 1)',
  borderLeft: '1px solid rgba(216, 216, 216, 1)',
  display: 'flex',
  minHeight: '90px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
})

export const getBatchHeaderEditContainerSx = (): SxProps<Theme> => ({
  width: '100%',
  height: `${NUMBERMAP.FORTY + NUMBERMAP.EIGHT}px`,
  backgroundColor: INCOMING_INSPECTION_BATCH_HEADER.COLORS.HEADER_BG,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: `${NUMBERMAP.ONE * NUMBERMAP.TEN / NUMBERMAP.TEN}px`,
  paddingRight: `${NUMBERMAP.ONE * NUMBERMAP.TEN / NUMBERMAP.TEN}px`,
})

export const getBatchHeaderViewContainerSx = (): SxProps<Theme> => ({
  width: '100%',
  height: `${NUMBERMAP.FORTY + NUMBERMAP.EIGHT}px`,
  backgroundColor: INCOMING_INSPECTION_BATCH_HEADER.COLORS.HEADER_BG,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingLeft: `${NUMBERMAP.ONE_HALF * NUMBERMAP.TEN}px`,
  paddingRight: `${NUMBERMAP.ONE_HALF * NUMBERMAP.TEN}px`,
  gap: NUMBERMAP.ONE,
})

export const getBatchHeaderEditIconSx = (): SxProps<Theme> => ({
  color: INCOMING_INSPECTION_BATCH_HEADER.COLORS.HEADER_TEXT,
  '&.Mui-disabled': { color: INCOMING_INSPECTION_BATCH_HEADER.COLORS.HEADER_TEXT_DISABLED },
})

export const getBatchHeaderInputSx = (): SxProps<Theme> => ({
  width: '100%',
  backgroundColor: INCOMING_INSPECTION_BATCH_HEADER.COLORS.INPUT_BG,
  borderRadius: NUMBERMAP.ONE,
  paddingLeft: NUMBERMAP.ONE,
  paddingRight: NUMBERMAP.ONE,
  height: `${NUMBERMAP.THIRTYTWO}px`,
  display: 'flex',
  alignItems: 'center',
  '& input': {
    height: `${NUMBERMAP.THIRTYTWO}px`,
    boxSizing: 'border-box',
    textAlign: 'left',
    fontWeight: NUMBERMAP.FOURHUNDRED,
    fontSize: `${NUMBERMAP.THIRTEEN}px`,
    lineHeight: `${NUMBERMAP.THIRTYTWO}px`,
    padding: NUMBERMAP.ZERO,
    color: `${INCOMING_INSPECTION_BATCH_HEADER.COLORS.INPUT_TEXT} !important`,
    caretColor: INCOMING_INSPECTION_BATCH_HEADER.COLORS.INPUT_TEXT,
    WebkitTextFillColor: INCOMING_INSPECTION_BATCH_HEADER.COLORS.INPUT_TEXT,
  },
  '& input::placeholder': {
    color: INCOMING_INSPECTION_BATCH_HEADER.COLORS.INPUT_PLACEHOLDER,
    opacity: NUMBERMAP.ONE,
  },
})

export const getBatchHeaderTextSx = (): SxProps<Theme> => ({
  width: '100%',
  textAlign: 'center',
  fontWeight: NUMBERMAP.FIVEHUNDRED,
  fontSize: `${NUMBERMAP.FOURTEEN}px`,
  color: INCOMING_INSPECTION_BATCH_HEADER.COLORS.HEADER_TEXT,
  userSelect: 'none',
})

export const getFullWidthBoxSx = (): SxProps<Theme> => ({
  width: '100%',
})

export const locationDetailsLabelSx: SxProps<Theme> = {
  display: 'block',
  mb: 0.5,
}

export const locationLinkSx: SxProps<Theme> = {
  cursor: 'pointer',
}

export const sectionMarginTopSx: SxProps<Theme> = { mt: '20px' }

export const wrapperMarginSx: SxProps<Theme> = { padding: '20px' }

export const resultChipRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: NUMBERMAP.ONE,
}