"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { 
  PAGE_CONSTANTS, 
  TABLE_FIELDS, 
  TABLE_HEADERS, 
  TABLE_ID_FIELD, 
} from "@/constants/modules/production/incomingInspectionCriteria";
import { useGetIncomingInspectionCriteriaList, useDeleteIncomingInspectionCriteria } from "@/hooks/modules/production/useIncomingInspectionCriteria";
import { GridRenderCellParams } from "@mui/x-data-grid";

/**
 * Classification: Confidential
 * Incoming Inspection Criteria List Page
 */

interface IncomingInspectionCriteriaProps {
  applicableSettingsId?: number;
  onAddClick?: () => void;
  onEditClick?: (id: number) => void;
}

const IncomingInspectionCriteria: React.FC<IncomingInspectionCriteriaProps> = ({ 
  applicableSettingsId,
  onAddClick,
  onEditClick 
}) => {
  const router = useRouter();
  const { data: incomingInspectionCriteriaData, isLoading } = useGetIncomingInspectionCriteriaList(applicableSettingsId);
  const deleteIncomingInspectionCriteriaMutation = useDeleteIncomingInspectionCriteria();

  // Column definitions for the table
  const columns = [
    {
      field: TABLE_FIELDS.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_FIELDS.PART_TYPE_NAME,
      headerName: TABLE_HEADERS.PART_TYPE_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.PART_SUB_TYPE_NAME,
      headerName: TABLE_HEADERS.PART_SUB_TYPE_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.PART_SUB_CLASS_NAME,
      headerName: TABLE_HEADERS.PART_SUB_CLASS_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.PART_CATEGORY_NAME,
      headerName: TABLE_HEADERS.PART_CATEGORY_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.row.status_id} />
      ),
    },
    {
      field: TABLE_FIELDS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton 
          deleteDisabled={params.row.status_id == NUMBERMAP.TWO}
          onDelete={() => handleDelete(params.row.incoming_inspection_criteria_id)} 
          onEdit={() => {
            const id = params.row.incoming_inspection_criteria_id;
            if (id) {
              handleEdit(id);
            }
          }} 
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    if (onEditClick && typeof onEditClick === 'function') {
      onEditClick(id);
    } else {
      router.push(PAGE_CONSTANTS.EDIT_PATH(id));
    }
  };

  const handleDelete = (id: number) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed && id) {
        deleteIncomingInspectionCriteriaMutation.mutate(id, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS);
          },
          onError: () => {
            showActionAlert(STATUS.FAILED);
          },
        });
      }
    });
  };

  const handleAddClick = () => {
    if (onAddClick) {
      onAddClick();
    } else {
      router.push(PAGE_CONSTANTS.CREATE_PATH);
    }
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={'#'}
        title={''}
        
        hanldeClick={onAddClick ? handleAddClick : undefined}
        Table={
          <DataTable
            rows={incomingInspectionCriteriaData?.data ?? []}
            columns={columns}  
            IdField={TABLE_ID_FIELD}  
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default IncomingInspectionCriteria;
