import React from 'react';
import { IconButton } from '@mui/material';
import { Download } from '@mui/icons-material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { NUMBERMAP } from '@/constants/common';
import { convertUtcToLocal } from '@/lib/utils/common';
import { OrganizationRecord } from '@/services/modules/hr/organizationRecord';

/**
    Classification : Confidential
**/

interface RecordGenerationColumnsProps {
  handleDownload: (fileId: string | number, version: string | number, docName: string, versionNo: string | number) => void;
}

/**
 * Common columns configuration for record generation tables
 * Used by both HR and DND record generation pages
 * @param handleDownload - Function to handle file download
 * @returns Array of column definitions for DataTable
 */
export const useRecordGenerationColumns = ({ handleDownload }: RecordGenerationColumnsProps) => {
  return [
    {
      field: "sno",
      headerName: "S.No",
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        return params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE
      },
    },
    {
      field: "document_name",
      headerName: "Document Name",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "version_no",
      headerName: "Version No.",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "reviewed_date",
      headerName: "Reviewed Date",
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams<OrganizationRecord>) => {
        return params.row.reviewed_date ?? '';
      }
    },
    {
      field: "approved_date",
      headerName: "Approved Date", 
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams<OrganizationRecord>) => {
        return params.row.approved_date ?? '';
      }
    },
    {
      field: "reviewed_by",
      headerName: "Reviewed By",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "approved_by",
      headerName: "Approved By",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "action",
      headerName: "Action",
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: GridRenderCellParams<OrganizationRecord>) => (
        <IconButton 
          onClick={() => handleDownload(
            params.row.record_id ?? params.row.file_id, 
            params.row.version_no,
            params.row.document_name,
            params.row.version_no
          )}
        >
          <Download color="primary" />
        </IconButton>
      ),
    },
  ];
};

/**
 * Transform data rows for table display
 * @param data - Raw data from API
 * @returns Formatted rows with proper ID field and converted date fields
 */
export const formatRecordGenerationRows = (data: any[] = []) => {
  return data.map((row, idx) => {
    const formattedRow = {
      ...row,
      id: idx + NUMBERMAP.ONE, // User-friendly row ID
    };
    
    // Convert reviewed_date to org format for filtering
    if (formattedRow.reviewed_date) {
      const convertedDate = convertUtcToLocal(String(formattedRow.reviewed_date));
      formattedRow.reviewed_date = (convertedDate && convertedDate !== 'Invalid DateTime') 
        ? convertedDate 
        : formattedRow.reviewed_date;
    }
    
    // Convert approved_date to org format for filtering
    if (formattedRow.approved_date) {
      const convertedDate = convertUtcToLocal(String(formattedRow.approved_date));
      formattedRow.approved_date = (convertedDate && convertedDate !== 'Invalid DateTime') 
        ? convertedDate 
        : formattedRow.approved_date;
    }
    
    return formattedRow;
  });
}; 