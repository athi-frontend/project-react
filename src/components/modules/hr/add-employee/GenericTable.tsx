"use client";
import React from "react";
import DataGridTable from "@/components/ui/data-grid-table/DataGridTable";
import { PADDING, PageContainer, TableContainer } from "@/styles/common";
import { ActionButton } from "@/components/ui";
import { Box, Typography } from "@mui/material";
import { validationStyle } from "@/styles/modules/hr/employeeList";

interface GenericTableProps {
  columns: any[];
  rows: any[];
  idField?: string;
  hideFooter?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  showActions?: boolean;
  error?: string;
}


const GenericTable: React.FC<GenericTableProps> = ({
  columns,
  rows,
  idField,
  hideFooter = true,
  onEdit,
  onDelete,
  showActions = true,
  error = ''
}) => {
  let enhancedColumns = columns;
  if (showActions) {
    if (!columns.some((col) => col.field === "actions")) {
      enhancedColumns = [
        ...columns,
        {
          field: "actions",
          headerName: "Action",
          width: 170,
          renderCell: (params: any) => (
            <ActionButton onEdit={() => onEdit?.(params.row)} onDelete={() => { onDelete?.(params.row) }} />
          ),
        },
      ];
    }
  }

  return (
    <TableContainer>
      <PageContainer>
        <Box sx={PADDING}>
        <DataGridTable
          columns={enhancedColumns}
          idField={idField}
          rows={rows}
          hideFooter={hideFooter}
        />
        <Typography sx={validationStyle}>{error}</Typography>
        </Box>
        </PageContainer>
   </TableContainer>
  );
};

export default GenericTable;