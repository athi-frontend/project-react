"use client";
import React, { useEffect, useState } from 'react';
import { Box, TextField, Grid2 } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { DataGridTable, showActionAlert, RadioButtonGroup } from '@/components/ui';
import { Title } from '@/styles/common'
import { CheckListItem } from '@/types/modules/dnd/designInputAdequacyChecklist';
import { ERROR_MESSAGES, FORM_FIELDS, getColumns, GRID_SIZES, HANDLE_CHANGE, radioOptions, FIELD_ORDER } from '@/constants/modules/dnd/designInputAdequacyChecklist';
import { useParams, useRouter } from 'next/navigation';
import { useFetchAllAdequacy, useSaveAdequacy } from '@/hooks/modules/dnd/useDesignInputAdequacyChecklist';
import { BUTTONSTYLE, NUMBERMAP, STATUS } from '@/constants/common';
import { designInputAdequacyStyles } from '@/styles/modules/dnd/designInputAdequacyChecklist';
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager';
import { PROJECT_LIST_SCREEN_URL } from '@/lib/modules/dnd/projectScreen';
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import DirInfoPopupForm from '@/components/modules/dnd/dir/DirInfoPopupForm';
import { DesignInputFormData } from '@/types/modules/dnd/dir';
/**
      *Classification : Confidential
**/
const DesignInputAdequacyCheckList: React.FC = () => {

  const params = useParams();
  const project_id = params.id
  const router = useRouter()
  const {data: fetchAdequacy, refetch, isLoading:isLoadingSpecifications, isFetching: isFetchingSpecifications} = useFetchAllAdequacy(Number(project_id))
  const {mutate: saveAdequacy, isPending} = useSaveAdequacy();

  const [checkListItems, setCheckListItems] = useState<CheckListItem[]>([]);
  const [errors, setErrors] = useState<Record<string, { is_adequate?: string; remarks?: string }>>({});
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDirId, setSelectedDirId] = useState<number | null>(null);

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isLoadingSpecifications) return true
    if (isFetchingSpecifications) return true
    if (isPending) return true
    return false
  }

  useEffect(() => {
    if(!fetchAdequacy?.data || fetchAdequacy.data.length === NUMBERMAP.ZERO) {
      return;
    }
    setCheckListItems(fetchAdequacy.data)
  }, [fetchAdequacy])

  const handleItemChange = (id: string, field: string, value: string) => {
    if(!hasEditPermission) return
  setCheckListItems(prevItems =>
    prevItems.map(item =>
      String(item.applicable_specification_id) === String(id)
        ? { ...item, [field]: value }
        : item
    )
  );

  // Clear error for this row if value is valid
  if (field === HANDLE_CHANGE.RADIO_CHANGE) {
    setErrors(prevErrors => {
      const updated = { ...prevErrors };
        updated[id] ??= {};
        updated[id] = { ...updated[id], is_adequate: '', remarks: '' };
        
        return updated;
      });
    }
    
    if (field === HANDLE_CHANGE.REMARKS_CHANGE) {
      // Clear remarks error when user types (error will be validated on save)
      setErrors(prevErrors => {
        const updated = { ...prevErrors };
        if (updated[id]) {
          updated[id] = { ...updated[id], remarks: '' };
      }
      return updated;
    });
  }
};

const validateForm = () => {
  let isValid = true;
  const newErrors: Record<string, { is_adequate?: string; remarks?: string }> = {};

  checkListItems.forEach((item) => {
    const itemErrors: { is_adequate?: string; remarks?: string } = {};
    
    if (item.is_adequate === null || item.is_adequate === undefined) {
      itemErrors.is_adequate = ERROR_MESSAGES.ADEQUATE;
      isValid = false;
    }
    
    const isAdequateNo = String(item.is_adequate) === String(NUMBERMAP.ZERO);
    if (isAdequateNo && (!item.remarks || item.remarks.trim() === '')) {
      itemErrors.remarks = ERROR_MESSAGES.REMARKS_REQUIRED;
      isValid = false;
    }
    
    if (Object.keys(itemErrors).length > NUMBERMAP.ZERO) {
      newErrors[item.applicable_specification_id] = itemErrors;
    }
  });

  setErrors(newErrors);
  
  // Use validateAndFocusFirstEmptyField for better UX
  if (!isValid) {
    // Find the first empty item
    let firstEmptyItem = checkListItems.find(item => {
      const itemError = newErrors[item.applicable_specification_id];
      return itemError?.is_adequate || (item.is_adequate === null || item.is_adequate === undefined);
    });
    
    // If no is_adequate error, find first remarks error
    firstEmptyItem ??= checkListItems.find(item => {
      const itemError = newErrors[item.applicable_specification_id];
      return itemError?.remarks;
    });
    
    if (firstEmptyItem) {
      // Create form values for validation
      const formValues = {
        is_adequate: firstEmptyItem.is_adequate ?? '',
        remarks: firstEmptyItem.remarks ?? ''
      };
      
      // Create field label map with item-specific labels
      const fieldLabelMap = {
        is_adequate: `Adequacy Status* (${firstEmptyItem.specification_name})`,
        remarks: `Remarks* (${firstEmptyItem.specification_name})`
      };
      
      // Use validateAndFocusFirstEmptyField with field order and labels
      validateAndFocusFirstEmptyField(formValues, FIELD_ORDER, fieldLabelMap);
    }
  }
  
  return isValid;
};

const handleSave = () => {
  if(!hasEditPermission) return
  if (!validateForm()) {
    return
  }

  const payload = {
    project_id: Number(project_id),
    checkListItems: checkListItems.map((item) => ({
      applicable_specification_id: item.applicable_specification_id,
      is_adequate: Number(item.is_adequate),
      adequacy_report_id: item.adequacy_report_id,
      remarks: item.remarks ?? '',
      is_dir_conflict: item.is_dir_conflict ?? null,
      conflicting_dir_id: item.conflicting_dir_id ?? [],
      conflict_remarks: item.conflict_remarks ?? null,
      is_dir_unambiguous: item.is_dir_unambiguous ?? null,
      unambiguous_remarks: item.unambiguous_remarks ?? null,
      is_dir_verifiable: item.is_dir_verifiable ?? null,
      verifiable_remarks: item.verifiable_remarks ?? null,
      is_dir_complete: item.is_dir_complete ?? null,
      complete_remarks: item.complete_remarks ?? null,
      is_dir_retested: item.is_dir_retested ?? null,
    }))
  }

  saveAdequacy(payload, {
    onSuccess: () => {
      showActionAlert(STATUS.SUCCESS)
      setCheckListItems([])
      refetch()
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
const handleCancel = () => {
  router.push(PROJECT_LIST_SCREEN_URL)
}

const handleRadioChange = (id: string) => (value: string) => {
  if(!hasEditPermission) return
  handleItemChange(id, HANDLE_CHANGE.RADIO_CHANGE, value)
}

const renderRadioCell = (params: GridRenderCellParams) => {
  const rowError =
    errors[params.row.applicable_specification_id]?.is_adequate ?? ''

  return (
    <Box sx={designInputAdequacyStyles.adequateColumn}>
      <div id={`Adequacy Status* (${params.row.specification_name})`}>
        <RadioButtonGroup
          options={radioOptions}
          value={params.row.is_adequate ?? ''}
          onChange={handleRadioChange(params.row.applicable_specification_id)}
          row={true}
          error={rowError}
        />
      </div>
    </Box>
  )
}

  const handleRemarksChange =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if(!hasEditPermission) return
      
      handleItemChange(id, HANDLE_CHANGE.REMARKS_CHANGE, event.target.value)
    }

  const renderRemarkCell = (params: GridRenderCellParams) => {
    const rowError = errors[params.row.applicable_specification_id]?.remarks ?? '';
    const remarksId = `Remarks* (${params.row.specification_name})`;
    
    return (
      <Box sx={designInputAdequacyStyles.remarksColumn}>
        <TextField
          id={remarksId}
          multiline
          placeholder={FORM_FIELDS.PLACEHOLDER}
          value={params.row.remarks}
          fullWidth
          onChange={handleRemarksChange(params.row.applicable_specification_id)}
          error={!!rowError}
          helperText={rowError}
          sx={designInputAdequacyStyles.textField}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation()
            }
          }}
        />
      </Box>
    )
  }

  const renderRequirementsCell = (params: GridRenderCellParams) => {
    return (
      <Box sx={designInputAdequacyStyles.requirementsColumn}>
        {params.row.specification_name}
      </Box>
    )
  }

  const renderSnoCell = (params: GridRenderCellParams) => {
    return (
      <Box sx={designInputAdequacyStyles.snoColumn}>
        {params.api.getRowIndexRelativeToVisibleRows(params.id) + NUMBERMAP.ONE}
      </Box>
    )
  }

  const renderConflictsCell = (params: GridRenderCellParams) => {
    return (
      <Box sx={designInputAdequacyStyles.adequateColumn}>
        <Box
          onClick={() => {
            setSelectedDirId(params.row.applicable_specification_id);
            setPopupOpen(true);
          }}
          sx={designInputAdequacyStyles.conflictsClickable}
        >
          {FORM_FIELDS.CLICK_HERE}
        </Box>
      </Box>
    )
  }

  const handlePopupClose = () => {
    setPopupOpen(false);
    setSelectedDirId(null);
  }

  const handlePopupSave = (data: DesignInputFormData) => {
    if (selectedDirId) {
      const conflictingDirIds = data.dirConfict.map(id => Number(id));
      setCheckListItems(prevItems =>
        prevItems.map(item =>
          item.applicable_specification_id === selectedDirId
            ? {
                ...item,
                is_dir_conflict: data.dirConfict && data.dirConfict.length > NUMBERMAP.ZERO ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
                conflicting_dir_id: conflictingDirIds,
                conflict_remarks: data.conflictRemarks ?? null,
                is_dir_unambiguous: data.isUnambiguous ? Number(data.isUnambiguous) : null,
                unambiguous_remarks: null,
                is_dir_verifiable: data.isverified ? Number(data.isverified) : null,
                verifiable_remarks: data.verifiableRemarks ?? null,
                is_dir_complete: data.isCompleted ? Number(data.isCompleted) : null,
                complete_remarks: data.completeRemarks ?? null,
                is_dir_retested: data.isRetested ? Number(data.isRetested) : NUMBERMAP.ZERO,
              }
            : item
        )
      );
    }
    handlePopupClose();
  }

  const getInitialPopupData = (): DesignInputFormData | undefined => {
    if (!selectedDirId) return undefined;
    const item = checkListItems.find(item => item.applicable_specification_id === selectedDirId);
    if (!item) return undefined;
    
    return {
      isUnambiguous: item.is_dir_unambiguous?.toString() ?? '',
      isverified: item.is_dir_verifiable?.toString() ?? '',
      isRetested: item.is_dir_retested?.toString() ?? '',
      isCompleted: item.is_dir_complete?.toString() ?? '',
      dirConfict: item.conflicting_dir_id?.map(id => id.toString()) ?? [],
      conflictRemarks: item.conflict_remarks ?? '',
      verifiableRemarks: item.verifiable_remarks ?? '',
      completeRemarks: item.complete_remarks ?? '',
    };
  }

  const columns = getColumns(renderRadioCell, renderRemarkCell, renderRequirementsCell, renderSnoCell, renderConflictsCell)
 
  const permissions = fetchAdequacy?.meta_info?.action_control?.permissions ?? [];

  return (
    <Box sx={designInputAdequacyStyles.mainContainer}>
      <GlobalLoader loading={isAnyLoading()}/>
      {fetchAdequacy && (
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={GRID_SIZES.FULL_WIDTH}>
          <Box sx={designInputAdequacyStyles.titleContainer}>
            <Title>
              {FORM_FIELDS.TITLE}
            </Title>
          </Box>
        </Grid2>

        <Grid2 size={GRID_SIZES.FULL_WIDTH} >
          <Box
            sx={designInputAdequacyStyles.dataGridContainer}
          >
            <DataGridTable
              idField={FORM_FIELDS.ID_FIELD}
              rows={checkListItems}
              columns={columns}
              hideFooter={true}
              loading={false}
              hideHeader={true}
              autoHeight={true}
            />
          </Box>
        </Grid2>
        <CommentsHistoryContainer>
        <CommentsHistory
          comments={fetchAdequacy?.meta_info?.task_info?.task_comments}
        />
      </CommentsHistoryContainer>

        <Grid2 size={GRID_SIZES.FULL_WIDTH} sx={BUTTONSTYLE}>
           <ReviewerModalManager
              permissions={permissions}
              isLoading={isLoadingSpecifications}
              projectId={project_id}
              onPermissionChange={setHasEditPermission}
              menuId={fetchAdequacy?.meta_info?.action_control?.menuId}
              menuName={fetchAdequacy?.meta_info?.action_control?.formName}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
                isDisabled: isPending
              }}
             
              reviewerList={fetchAdequacy?.meta_info?.task_info?.reviewer_list}
            />
        </Grid2>
      </Grid2>
      )}
      {selectedDirId && (
        <DirInfoPopupForm
          open={popupOpen}
          onClose={handlePopupClose}
          onSave={handlePopupSave}
          projectId={Number(project_id)}
          initialData={getInitialPopupData()}
        />
      )}
    </Box>
  );
};

export default DesignInputAdequacyCheckList;