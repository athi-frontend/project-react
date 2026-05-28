"use client";
import React, { useRef, useState } from "react";
import { ActionButton, DataTable, showActionAlert  } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import AddTrainingNeeds from "@/components/modules/hr/training-needs/TrainingNeedsModal";
import { PageContainer } from '@/styles/common'
import { getColumns, TRAINING_LIST, DATA_GRID_DELETE_CLASS, DATA_DELETE, CONTAINER_ID, DATA_TABLE_NAME, DATA_FIELD_NAME } from '@/constants/modules/hr/trainingNeeds'
import { useFetchAllNeeds } from '@/hooks/modules/hr/useTrainingNeeds'
import {  magicGridRowSave } from '@/lib/utils/magicSave'
import { COMMON_CONSTANTS, convertUtcToLocal } from '@/lib/utils/common'
import magicSaveConstants from '@/constants/magicSave'
import StatusTypography from "@/components/ui/status/ToggleStatus";

/**
*Classification : Confidential
**/

const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT, IN_ACTIVE_STATUS, UPDATE, ACTIVE_STATUS } =
  COMMON_CONSTANTS 

const TrainingNeeds: React.FC = () => {

  const formRef = useRef(null);

  const [skillModal,setSkillModal] =useState(false)
  const [selectedNeed, setSelectedNeed] = useState(null);

  const {data: fetchNeeds, refetch} = useFetchAllNeeds();

   const magicSaveDelete = async (currentTarget, hrId) => {
    const formId = formRef.current.id
    const response = await magicGridRowSave({
      containerID: formId,
      scopedEvents: currentTarget,
      eventClass: DATA_GRID_DELETE_CLASS,
      dataframeworkOperatorType: UPDATE,

      keys: {
        eqms_hr_employee_training_needs: {
          id: hrId,
        },
      },
      diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
    })
    if (
      response?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      showActionAlert(SUCCESS_ALERT)
      refetch();
    } else {
      showActionAlert(FAILED_ALERT)
    }
  }
  
  const handleDelete = async (e: React.MouseEvent, data: {}) => {

    const currentTarget = e.currentTarget
    const result = await showActionAlert(DELETE_ALERT)
    if (result.isConfirmed) {
      const target = currentTarget

      // Read current status
      const currentStatus = target.getAttribute(magicSaveConstants.DATA_STATUS)

      // Define new status
      const newStatus =
        Number(currentStatus) === ACTIVE_STATUS
          ? IN_ACTIVE_STATUS
          : ACTIVE_STATUS

      // Update the data-status attribute
      target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus)

      // Also update the value property if it exists
      if ('value' in target) {
        target.value = newStatus
      }

      magicSaveDelete(target, data.training_needs_id)
    }
  }
  
  const handleEdit = (rowData) => {
    setSelectedNeed(rowData);
    setSkillModal(true);
  };

  const renderActionCell = (params: any) => {
    return (
    <ActionButton
  onDelete={(e) => handleDelete(e, params.row)}
  onEdit={() => {
    handleEdit(params.row)
  }}
  dataSourceName={DATA_TABLE_NAME.TRAINING_NEEDS}
  dataFieldName={DATA_FIELD_NAME.STATUS}
  dataStatus={params.row.status}
  value={params.row.status}
  deleteDisabled={params.row.type}
  disabled={!params.row.status}
/>

  );
  }
  
  const renderStatusCell = (params: any) => {
    
    return (
      <StatusTypography value={params.value}/>
    );
  };

  const renderDateFormat = (params) =>{
     return convertUtcToLocal(params.value)
  }
  const columns = getColumns(renderActionCell, renderStatusCell,renderDateFormat)

  const handleModalClose = () => {
    setSkillModal(false);
    setSelectedNeed(null);
    refetch()
  }; 

  return (
     <PageContainer ref={formRef} id={CONTAINER_ID}>
      <CommonSharedTale
        title={TRAINING_LIST.TITLE}
        pathName="#"
              hanldeClick={()=>{
                setSkillModal(!skillModal)}}
        Table={
          <DataTable
            rows={fetchNeeds?.data ?? []}
            columns={columns}
            IdField={TRAINING_LIST.ID_FIELD}
            checkbox={false}
             customClassName={DATA_DELETE}
          />
        }
      />
        <CommonModal onClose={handleModalClose} open={skillModal} title={"Training Needs"}>
        <AddTrainingNeeds 
          onClose={handleModalClose}
          needId={selectedNeed?.training_needs_id??null}
          onSuccess={()=>{refetch()}}
        />
      </CommonModal>
    </PageContainer>
  )
}

export default TrainingNeeds;
