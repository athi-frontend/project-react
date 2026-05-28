import { styled, Box } from "@mui/material"

export const DownloadCellContainer = styled(Box)({
  maxHeight: '100%',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
  padding: 0.25,
  // Hide scrollbar for WebKit browsers
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  // Hide scrollbar for Firefox
  scrollbarWidth: 'none',
  // Hide scrollbar for IE/Edge
  msOverflowStyle: 'none',
});

export const DownloadItemContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 0.25,
});

export const MarginTopBottomAuto = { marginTop: "auto", marginBottom: "auto" }