"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { ButtonGroup, DataGridTable, showActionAlert } from "@/components/ui";
import { NUMBERMAP, STATUS, BUTTON_LABEL } from "@/constants/common";
import { PageContainer } from "@/styles/modules/hr/inductionTraining";
import Checkbox from "@mui/material/Checkbox";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import {  useManufacturingLicenseChecklist, useSaveManufacturingLicenseChecklist } from "@/hooks/modules/regulation/useManufacturingLicense";
import {
  MANUFACTURING_LICENSE_CHECKLIST_FIELDS,
  MANUFACTURING_LICENSE_CHECKLIST_HEADERS,
  MANUFACTURING_LICENSE_CHECKLIST_META,
  MANUFACTURING_LICENSE_CHECKLIST_ALERTS,
} from "@/constants/modules/regulation/manufacturing-license";
import { GridRenderCellParams } from "@mui/x-data-grid";
import type { ManufacturingLicenseChecklistItem } from "@/constants/modules/regulation/manufacturing-license";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { PADDING20 } from "@/styles/modules/risk-management/riskAssessmentMatrix";

/**
    Classification : Confidential
**/

type SaveType = 'draft' | 'final'

const ManufacturingLicenseChecklistPage: React.FC = () => {
  const params = useParams();
  const id = Number(params.id);
  const { data, refetch: refetchManufacturingLicenseChecklist } = useManufacturingLicenseChecklist(id, false);
  const { mutate: saveChecklist } = useSaveManufacturingLicenseChecklist();
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave()
  const [checklistData, setChecklistData] = useState<ManufacturingLicenseChecklistItem[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchManufacturingLicenseChecklist();
  }, [refetchManufacturingLicenseChecklist]);

  const resetToInitialData = () => {
    if (data?.data) {
      setChecklistData(
        data.data
      );
    }
  };

  useEffect(() => {
    if (data?.data) {
      resetToInitialData();
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [data]);

  const handleCheckboxChange = (checklist_id: number, checked: boolean) => {
    if (!hasEditPermission) return; // Prevent changes if no edit permission
    setChecklistData(prev => {
      const updated = prev.map(item =>
        item.checklist_id === checklist_id
          ? { ...item, is_mandatory: checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO }
          : item
      )
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    });
  };

  const columns = [
    {
      field: MANUFACTURING_LICENSE_CHECKLIST_FIELDS.SNO,
      headerName: MANUFACTURING_LICENSE_CHECKLIST_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE;
        return index.toString().padStart(NUMBERMAP.TWO, '0');
      },
    },
    {
      field: MANUFACTURING_LICENSE_CHECKLIST_FIELDS.SECTION_NO,
      headerName: MANUFACTURING_LICENSE_CHECKLIST_HEADERS.SECTION_NO,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => params.row.sectionNo,
    },
    {
      field: MANUFACTURING_LICENSE_CHECKLIST_FIELDS.CHECKLIST_NAME,
      headerName: MANUFACTURING_LICENSE_CHECKLIST_HEADERS.CHECKLIST_NAME,
      flex: NUMBERMAP.TWO,
      renderCell: (params: GridRenderCellParams) => params.row.checklistName,
    },
    {
      field: MANUFACTURING_LICENSE_CHECKLIST_FIELDS.IS_MANDATORY,
      headerName: MANUFACTURING_LICENSE_CHECKLIST_HEADERS.IS_MANDATORY,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={params.row.is_mandatory}
          onChange={e =>
            handleCheckboxChange(params.row.checklist_id, e.target.checked)
          }
          disabled={!hasEditPermission}
        />
      ),
    },
  ];

  function handleSave(type: SaveType, next?: ManufacturingLicenseChecklistItem[]) {
    if (!hasEditPermission) return; // Prevent save if no edit permission
    const rows = next ?? checklistData
    const payload = rows.map(item => ({
      checklist_id: item.checklist_id,
      is_mandatory: item.is_mandatory ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
    }))
    if (type === 'draft') {
      draftSave({
        project_id: Number(id),
        form_type: 'manufacturing_license_checklist',
        form_data: rows,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    saveChecklist({ id, payload }, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        refetchManufacturingLicenseChecklist() // Refetch to get updated permissions
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  };

  const handleCancel = () => {
    resetToInitialData();
    showActionAlert('customAlert', {
      title: MANUFACTURING_LICENSE_CHECKLIST_ALERTS.CANCELLED_TITLE,
      text: MANUFACTURING_LICENSE_CHECKLIST_ALERTS.CANCELLED_MESSAGE,
      icon: 'info',
      cancelButton: false,
      confirmButton: false,
    });
  };

  // Update edit permission based on permissions from API
  useEffect(() => {
    if (data?.meta_info?.action_control?.permissions) {
      const hasSavePermission = data.meta_info.action_control.permissions.some(
        (p: { action: string }) => p.action === 'Save'
      )
      // Only allow editing if Save permission exists
      setHasEditPermission(hasSavePermission)
    }else{
      setHasEditPermission(false)
    }
  }, [data?.meta_info?.action_control?.permissions])

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <Box>
        <CommonSharedTale
        title={MANUFACTURING_LICENSE_CHECKLIST_META.TITLE}
        Table={    
        <Box sx={PADDING20}>
        <DataGridTable
          rows={checklistData}
          columns={columns}
          idField={MANUFACTURING_LICENSE_CHECKLIST_META.ID_FIELD}
          hideFooter={true}
        />
              <ButtonGroup
                buttons={[
                  {
                    label: BUTTON_LABEL.CANCEL,
                    onClick: handleCancel,
                  },
                  // Only show Save button if Save permission exists in API response
                  ...(hasEditPermission ? [{
                    label: BUTTON_LABEL.SAVE,
                    onClick: () => handleSave('final'),
                    disabled: false,
                  }] : []),
                ]}
              />
            </Box>
          }
        />
      </Box>
    </PageContainer>
  );
};

export default ManufacturingLicenseChecklistPage;
