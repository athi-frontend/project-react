/**
 * Classification: Confidential
 * Bill of Material Module Styles
 */

import { SxProps, Theme } from '@mui/material/styles'

/**
 * Get status-based cell styles for clickable cells (Part and Settings)
 * @param status - The status value ('not_configured' | 'in_progress' | 'completed')
 * @returns SxProps with appropriate color based on status
 */
export const getStatusCellStyles = (
    status: string
): SxProps<Theme> => {
    let statusColor: string;
    if (status === 'not_configured') {
        statusColor = 'primary.main';
    } else if (status === 'in_progress') {
        statusColor = 'warning.main';
    } else {
        statusColor = 'success.main';
    }

    return {
        textDecoration: 'underline',
        cursor: 'pointer',
        color: statusColor,
    };
}

/**
 * Supplier dropdown wrapper container styles
 */
export const supplierDropdownWrapperStyles: SxProps<Theme> = {
    position: 'relative',
    width: '100%',
}

/**
 * Vendor selection criteria link styles
 */
export const vendorSelectionCriteriaLinkStyles: SxProps<Theme> = {
    position: 'absolute',
    right: '8px',
    top: '8px',
    fontSize: '14px',
    color: 'grey',
    textDecoration: 'underline',
    cursor: 'pointer',
    zIndex: 1,
}

/**
 * Supplier details button container styles
 */
export const supplierDetailsButtonContainerStyles: SxProps<Theme> = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
}

/**
 * Part cell container styles for left alignment
 */
export const partCellContainer: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    width: '100%',
}

/**
 * Settings cell container styles for center alignment
 */
export const settingsCellContainer: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
}