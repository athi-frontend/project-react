import React from 'react';
import IconButton from '@mui/material/IconButton';
import { CircularProgress, Box } from '@mui/material';
import { Edit, Trash } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import { NUMBERMAP } from '@/constants/common';
import { ACTION_ICONS_WRAPPER_SX } from '@/styles/common';

interface ActionButtonProps {
  onEdit?: () => void
  onDelete?: () => void
  onDownload?: () => void
  isDeleting?: boolean
  disabled?: boolean
  editDisabled?: boolean
  deleteDisabled?: boolean
  isDownloading?: boolean
  dataSourceName?: string
  dataFieldName?: string
  dataStatus?: string
  value?: string
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onEdit,
  onDelete,
  onDownload,
  isDeleting = false,
  isDownloading = false,
  disabled = false,
  editDisabled = false,
  deleteDisabled = false,
  dataSourceName,
  dataFieldName,
  dataStatus,
  value,
}) => {
  const theme = useTheme();

  const isEditDisabled = disabled || editDisabled
  const isDeleteDisabled = disabled || deleteDisabled || isDeleting
  const hanleKeyEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  return (
    <Box sx={ACTION_ICONS_WRAPPER_SX}>
      <IconButton onKeyDown={hanleKeyEnter} onClick={onEdit} disabled={isEditDisabled} aria-label="edit">
        <Edit size={NUMBERMAP.EIGHTEEN} color={isEditDisabled ? theme.palette.grey[NUMBERMAP.FIVEHUNDRED] : theme.palette.primary.main} />
      </IconButton>
      <IconButton
        onKeyDown={hanleKeyEnter}
        onClick={onDelete}
        disabled={isDeleteDisabled}
        aria-label="delete"
        data-sourcename={dataSourceName}
        data-fieldname={dataFieldName}
        data-status={dataStatus}
        value={value}
      >
        {isDeleting ? (
          <CircularProgress size={NUMBERMAP.EIGHTEEN} />
        ) : onDelete && (
          <Trash
            size={NUMBERMAP.EIGHTEEN}
            color={
              isDeleteDisabled ? theme.palette.grey[NUMBERMAP.FIVEHUNDRED] : theme.palette.error.main
            }
          />
        )}
      </IconButton>
    </Box>
  );
};

export default ActionButton;
