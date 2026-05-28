"use client";
import React, { useEffect, useRef } from "react";
import { ActionButton, DataTable, showActionAlert   } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { PageContainer } from '@/styles/common'
import { NUMBERMAP } from "@/constants/common";
import { useFetchAllEvaluation } from '@/hooks/modules/hr/useTrainingEvaluation'
import { COMMON_CONSTANTS, convertUtcToLocal, withFullName } from "@/lib/utils/common";
import { TRAINING_EVALUATION_LIST, 
  PATHNAME, 
  TRAINING_EVALUATION_ID, 
  S_NO, 
  TITLE, 
  TITLE_OF_TRAINING, 
  EVALUATION_DATE, 
  TITLE_EVALUATION_DATE, 
  TRAINER, NAME_OF_TRAINER, 
  MODE_OF_TRAINING, 
  TITLE_MODE_OF_TRAINING, 
  ACTION, TITLE_ACTION, 
  DATA_DELETE,
  CONTAINER_ID,
  DATA_SOURCE_NAME,
  DATA_FIELD_NAME,
  DATA_GRID_DELETE_CLASS,
  STRING_LITERALS} from '@/constants/modules/hr/trainingEvaluation';
import magicSaveConstants from "@/constants/magicSave";
import { magicGridRowSave } from "@/lib/utils/magicSave";
import { useRouter } from "next/navigation";
import { GridRenderCellParams } from "@mui/x-data-grid";

/**
*Classification : Confidential
**/

const { DELETE_ALERT, SUCCESS_ALERT, FAILED_ALERT, UPDATE} =
    COMMON_CONSTANTS

const TrainingNeeds: React.FC = () => {
  const router = useRouter();
  // Fetching all training evaluations using custom hook
  const {data: fetchEvaluation, refetch} = useFetchAllEvaluation();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    refetch();
  }, []);
  
  const magicSaveDelete = async (currentTarget: EventTarget, hrId: number) => {
      const formId = formRef.current?.id
      if (!formId) return;
      
      const response = await magicGridRowSave({
        containerID: formId,
        scopedEvents: currentTarget,
        eventClass: DATA_GRID_DELETE_CLASS,
        dataframeworkOperatorType: UPDATE,
        dataframeworkOtherParamsBag: {},
        keys: {
          eqms_hr_training_evaluation: {
            id: hrId,
          },
        },
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
      })
      if (
        response && 'response' in response && 
        typeof response.response === 'object' && 
        response.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        showActionAlert(SUCCESS_ALERT)
        refetch();
      } else {
        showActionAlert(FAILED_ALERT)
      }
    }

   const handleEdit = (e: React.MouseEvent, data: {}) => {
      router.push(`/hr/training-evaluation/${data.training_evaluation_id}`)
    }
    const handleDelete = async (e: React.MouseEvent, data: {}) => {
 
      const currentTarget = e.currentTarget
      const result = await showActionAlert(DELETE_ALERT)
      if (result.isConfirmed) {
        const target = currentTarget
 
       const newStatus = NUMBERMAP.ZERO
        // Update the data-status attribute
        target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus)
 
        // Also update the value property if it exists
        if ('value' in target) {
          target.value = newStatus
        }
 
        magicSaveDelete(target, data.training_evaluation_id)
      }
    }
 

const columns = [
  {
    field: STRING_LITERALS.SNO,
    headerName: S_NO,
    flex: NUMBERMAP.HALF,
    renderCell: (params: GridRenderCellParams) => params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE,
 
  },
  {
    field: TITLE,
    headerName: TITLE_OF_TRAINING,
    flex: NUMBERMAP.ONE,
    renderCell: (params: GridRenderCellParams) => params.row.title,
  },
  {
    field: EVALUATION_DATE,
    headerName: TITLE_EVALUATION_DATE,
    flex: NUMBERMAP.ONE,
    renderCell: (params: GridRenderCellParams) => {
      const rawDate = params.row.date ?? params.row.evaluation_date;
      return rawDate ? convertUtcToLocal(rawDate) : '';
    },
  },
  {
    field: TRAINER,
    headerName: NAME_OF_TRAINER,
    flex: NUMBERMAP.ONE,
  },
  {
    field: MODE_OF_TRAINING,
    headerName: TITLE_MODE_OF_TRAINING,
    flex: NUMBERMAP.ONE,
    renderCell: (params: GridRenderCellParams) => params.row.location,
  },
    {
    field: ACTION,
    headerName: TITLE_ACTION,
    flex: NUMBERMAP.ONE,
    renderCell: (params: any) => <ActionButton onEdit={(e) =>handleEdit(e, params.row)} onDelete={(e)=> handleDelete(e, params.row)}
         dataSourceName={DATA_SOURCE_NAME}
         dataFieldName={DATA_FIELD_NAME}
         disabled={params.row.status?!params.row.status:params.row.status}
         dataStatus={params.row.status}
  value={params.row.status}/>
  },
];

  return (
     <PageContainer ref={formRef} id={CONTAINER_ID}>
      <CommonSharedTale
        title={TRAINING_EVALUATION_LIST.TITLE}
        pathName= {PATHNAME}
        Table={
          <DataTable
            rows={withFullName((fetchEvaluation?.data ?? []),'trainer_first_name','trainer_last_name')}
            columns={columns}
            IdField={TRAINING_EVALUATION_ID}
            customClassName={DATA_DELETE}
          />
        }
      />
    </PageContainer>
  )
}

export default TrainingNeeds;
