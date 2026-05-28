import { styled } from '@mui/material/styles';
import { Box, IconButton, Paper } from '@mui/material';
import { Copy, InfoCircle, TickCircle } from 'iconsax-react';
import { NUMBERMAP } from '@/constants/common';

interface TooltipBoxProps {
  pinned: boolean;
}

export const StyledWrapper = styled(Box)(() => ({
  display: 'inline',
}));

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 4,
  '&:hover': {
    background: theme.palette.background.paper,
  },
}));

export const StyledInfoIcon = styled(InfoCircle)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.info.main,
  verticalAlign: 'middle',
  transform: 'rotate(0deg)',
}));

export const StyledTooltipBox = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'pinned',
})<TooltipBoxProps>(({ theme, pinned }) => ({
  padding: 10,
  width: 420,
  minHeight: 100,
  maxHeight: pinned ? 400 : 92,
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,
  border: `1px solid ${theme.palette.info.main}`,
  scrollbarWidth: 'none', 
  msOverflowStyle: 'none', 
  '&::-webkit-scrollbar': {
    display: 'none', 
  },
}));


export const StyledTooltipText = styled(Box)(() => ({
  color: 'var(--text-dark-color)',
  fontSize: 16,
  whiteSpace: 'normal',
  flex: 1,
  '& ul': {
    paddingLeft: 20,
    margin: 0,
    listStylePosition: 'inside',
  },
  '& ol': {
    paddingLeft: 20,
    margin: 0,
    listStylePosition: 'inside',
    '& ul': {      
      paddingLeft: 20,
      '& li': {
        marginBottom: '5px',
        textIndent: '0',
        paddingLeft: 0,
        whiteSpace: 'normal',
        listStyle: 'disc',
      }
    }
  },
  '& li': {
    marginBottom: '5px',
    textIndent: '-1.3rem',
    paddingLeft: '0.5rem',
    whiteSpace: 'normal',
  },
  '& p': {
    marginBottom: '10px',
  },
  '& h3': {
    marginTop: '10px',
    color: 'var(--text-dark-color)',
    fontSize: 16,
    fontWeight: 'normal',
  }
}));

export const StyledCopyWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'start',
  gap: 8,
}));

export const StyledCopyButton = styled(IconButton)(() => ({
  padding: 4,
  height: 24,
}));

export const GreenTickIcon = styled(TickCircle)(({ theme }) => ({
  color: theme.palette.success.main,
}));

export const GrayCopyIcon = styled(Copy)(({ theme }) => ({
  color: theme.palette.info.main,
}))


export const InfoOverIndex = { zIndex: NUMBERMAP.ONETHOUSANDNINEHUNDRED }