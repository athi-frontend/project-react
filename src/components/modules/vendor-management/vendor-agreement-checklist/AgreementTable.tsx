'use client'
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { ActionButton, DataTable, showActionAlert } from "@/components/ui";
import { useAllVendorAgreementChecklists, useDeleteVendorAgreementChecklist } from "@/hooks/modules/vendor-management/useVendorAgreementChecklist";
import { ALERT_MESSAGES, vendorAgreementChecklistColumns, VENDOR_AGREEMENT_CHECKLIST_LIST_PATH, VENDOR_AGREEMENT_CHECKLIST_TITLE } from "@/constants/modules/vendor-management/vendorAgreementChecklist";
import { useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NUMBERMAP } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";

/**
    Classification : Confidential
**/
const VendorAgreementChecklistTable = () => {
    const router = useRouter();
    // Fetch all vendor agreement checklists with status=1 (active)
    const { data: vendorChecklists, isLoading, refetch } = useAllVendorAgreementChecklists(undefined, false);
    const { mutate: deleteMutation } = useDeleteVendorAgreementChecklist();

    // Function to trigger data fetch (can be called from a button or automatically)
    const handleFetchData = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleEdit = useCallback((id: number) => {
        router.push(VENDOR_AGREEMENT_CHECKLIST_LIST_PATH+'/'+id);
    }, [router]);

    const handleDelete = useCallback((id: number) => {
        showActionAlert('customAlert', {
            title: ALERT_MESSAGES.DELETE_CONFIRMATION_TITLE,
            text: ALERT_MESSAGES.DELETE_CONFIRMATION_TEXT,
            icon: ALERT_MESSAGES.DELETE_CONFIRMATION_ICON,
            cancelButton: true,
            confirmButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation(id, {
                    onSuccess: () => {
                        showActionAlert('customAlert', {
                            title: ALERT_MESSAGES.SUCCESS_TITLE,
                            text: ALERT_MESSAGES.SUCCESS_TEXT,
                            icon: ALERT_MESSAGES.SUCCESS_ICON,    
                            cancelButton: false,
                            confirmButton: false,
                        });
                        handleFetchData()
                    },
                    onError: () => {
                        showActionAlert('failed');
                    }
                });
            }
        });
    }, [deleteMutation, handleFetchData]);

    // Render action cell
    const renderActionCell = useCallback((params: any) => {
        const statusValue = Number(params.row.status);
        const isInactive = Number(statusValue) !== NUMBERMAP.ONE;
        return (
            <ActionButton 
            deleteDisabled={isInactive}
            onEdit={() => handleEdit(params.row.vendor_agreement_checklist_id)}
            onDelete={() => handleDelete(params.row.vendor_agreement_checklist_id)}
            />
        );
    }, [handleEdit, handleDelete]);

    // Get columns with render functions
    const columns = useMemo(() => {
      const baseColumns = vendorAgreementChecklistColumns.map((col) => {
        // Add renderCell for status column
        if (col.field === "status") {
          return {
            ...col,
            renderCell: (params: any) => {
              const statusValue = params.row.status;

              return <StatusTypography value={Number(statusValue)} />;
            },
          };
        }
        return col;
      });

      return [
        ...baseColumns,
        {
          field: "actions",
          headerName: "Actions",
          flex: NUMBERMAP.HALF,
          sortable: false,
          renderCell: renderActionCell,
        },
      ];
    }, [renderActionCell]);

    useEffect(()=>{
        handleFetchData()
    },[])
    return (
        <CommonSharedTale
            title={VENDOR_AGREEMENT_CHECKLIST_TITLE}
            pathName={VENDOR_AGREEMENT_CHECKLIST_LIST_PATH+'/create'}
            Table={
                <DataTable
                    rows={vendorChecklists?.data ?? []}
                    columns={columns}
                    IdField="vendor_agreement_checklist_id"
                    loading={isLoading}
                />
            }
        />
    );
};

export default VendorAgreementChecklistTable;