'use client';
import React from 'react';
import GenericTable from './GenericTable';
import { CommonInlineStyles } from '@/styles/common';

interface AdministrativeReport {
  id: number; 
  site: string; 
  administrativeReportsTo: string; 
  siteName: string; 
  adminReportToName: string; 
}

interface AdministrativeReportsTableProps {
  data: AdministrativeReport[];
  onEdit: (report: AdministrativeReport) => void;
  onDelete: (report: AdministrativeReport) => void;
  error?: string;
}

const AdministrativeReportsTable: React.FC<AdministrativeReportsTableProps> = ({ data, onEdit, onDelete, error }) => {
  const columns = [
    {
      field: 'id',
      headerName: 'S.No.',
      flex: 1,
      renderCell: (params: any) => params.row.id + 1, 
    },
    {
      field: 'siteName',
      headerName: 'Site',
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
        <input
          readOnly
          style={CommonInlineStyles.displayNone}
          data-sourcename="eqms_hr_employee_administrative_reports"
          data-fieldname="fk_eqms_organization_site_id"
          data-is-grid="true"
          value={params.row.site}
        >
        </input>
        {params.value}
        </>
      )
      }
    },
    {
      field: 'adminReportToName',
      headerName: 'Administrative Reports to',
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
        <input
          readOnly
          style={CommonInlineStyles.displayNone}
          data-sourcename="eqms_hr_employee_administrative_reports"
          data-fieldname="fk_eqms_users_id"
          data-is-grid="true"
          value={params.row.administrativeReportsTo}
        >
         
        </input>
         {params.value}
        </>
      )
      }
    },
  ];

  const handleEdit = (item: AdministrativeReport) => {
    if (onEdit) {
      onEdit(item);
    }
  };

  const handleDelete = (item: AdministrativeReport) => {
    if (onDelete) {
      onDelete(item);
    }
  };

  // Use the transformed data as-is
  const rows = data?.map((item) => ({
    ...item,
  }));

  return (
    <GenericTable
      columns={columns}
      rows={rows}
      idField="id"
      onEdit={handleEdit}
      onDelete={handleDelete}
      error={error}
    />
  );
};

export default AdministrativeReportsTable;