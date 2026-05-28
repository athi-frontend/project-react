'use client';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query'; 
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import { Edit } from 'iconsax-react'
import {
  DQP_TABLE_COLUMNS,
  TABLE_HEADERS,
  LABELS, DESIGN_QUALITY_PLAN
} from '@/constants/modules/dnd/designQualityPlan';
import { ColumnDefinition } from '@/types/modules/dnd/designQualityPlanTypes';
import { Label, DataTable } from '@/components/ui';
import { Grid2, Tooltip, IconButton, Box } from '@mui/material';
import { InlineStyles, commentsStyle } from '@/styles/modules/dnd/designQualityPlan';
import DesignQualityPlanModal from '@/components/modules/dnd/design-quality-plan/DesignQualityPlan';
import PopupForm from '@/components/modules/dnd/design-input/PopupForm';
import ProjectStagesPopupForm from '@/components/modules/dnd/project-stages/ProjectStagesPopupForm';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetProjectDesignQualityPlan,
  useUpsertDesignQualityPlan,
  INITIAL_FORM_DATA,
} from '@/hooks/modules/dnd/useDesignQualityPlan';
import { COMMON_CONSTANTS } from '@/lib/modules/dnd/commonUtils';
import { PROJECT_STAGES } from '@/constants/modules/dnd/projectStages';
import { TableContainer } from '@/styles/common';
import { useCreateProjectStage } from '@/hooks/modules/dnd/useProjectStages';
import { DesignQualityFormData } from '@/types/modules/dnd/designQualityPlan';
import { BUTTONSTYLE, NUMBERMAP } from '@/constants/common';
import CommentsHistory from '@/components/ui/comments-history/Comments'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import { ROUTE_PATHS } from '@/constants/modules/dnd/project';
const {
  ALERT_STATUS: { FAILED_ALERT, SUCCESS_ALERT },
} = COMMON_CONSTANTS;
const {
  FIELD_VALUES: { STAGE_ORDER_ID_FIELD },
} = PROJECT_STAGES;

/**
    Classification : Confidential
**/

export default function DesignQualityPlan() {
  const params = useParams();
  const projectId = Number(params.id);
  const queryClient = useQueryClient(); 
  const router = useRouter()

  const { mutate: submitProjectStage } = useCreateProjectStage();
  const { data: designQualityList, isLoading: designQualityLoading, isFetching: isFetchingDesignQuality } =
    useGetProjectDesignQualityPlan(projectId);
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const { mutate: upsertDesignQualityPlan, isPending } = useUpsertDesignQualityPlan();

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (designQualityLoading) return true
    if (isFetchingDesignQuality) return true
    if (isPending) return true
    return false
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designInputModal, setDesignInputModal] = useState(false);
  const [stageModal, setStageModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DesignQualityFormData | null>(null);
  const [selectedStageOrderId, setSelectedStageOrderId] = useState<number | null>(null);

  const getInitialData = (): DesignQualityFormData => {
    return selectedRow
      ? {
          stage_order_id: selectedRow.stage_order_id ?? NUMBERMAP.ZERO,
          build_stages_id: selectedRow.build_stages_id ?? NUMBERMAP.ZERO,
          stage_name: selectedRow.stage_name ?? '',
          stage_number: selectedRow.stage_number ?? undefined,
          quality_objective: selectedRow.quality_objective ?? '',
          itemForTest: selectedRow.itemForTest ?? '',
          testMethodsAndCriteria: selectedRow.testMethodsAndCriteria ?? '',
          parametersForInspection: selectedRow.parametersForInspection ?? [],
          status: selectedRow.status ?? null,
          design_quality_plan_id: selectedRow.design_quality_plan_id ?? '',
        }
      : { ...INITIAL_FORM_DATA };
  };

  const handleOpenModal = (row: DesignQualityFormData) => {
    setSelectedRow(row);
    setSelectedStageOrderId(row.stage_order_id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setSelectedStageOrderId(null);
  };

  const handleSaveData = (data: DesignQualityFormData) => {
    const upsertData: any = {
      quality_objective: data.quality_objective,
      parameter_inspection: data.parametersForInspection,
      test_method_acceptance_criteria: data.testMethodsAndCriteria,
      build_stage_order_id: selectedRow?.stage_order_id ?? data.stage_order_id,
    };
    if (data.design_quality_plan_id && data.design_quality_plan_id !== '') {
      upsertData.design_quality_plan_id = data.design_quality_plan_id;
    }

    upsertDesignQualityPlan(
      { projectId, data: upsertData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [DESIGN_QUALITY_PLAN.DESIGN_QUALITY_PLAN_API_KEYS.UPSERT_DESIGN_QUALITY_PLAN, projectId, selectedRow?.stage_order_id ?? data.stage_order_id] });
          queryClient.invalidateQueries({ queryKey: [DESIGN_QUALITY_PLAN.DESIGN_QUALITY_PLAN_API_KEYS.PROJECT_DESIGN_QUALITY_PLAN, projectId] });
          setIsModalOpen(false);
          showActionAlert(SUCCESS_ALERT);
        },
        onError: () => {
          showActionAlert(FAILED_ALERT);
        },
      }
    );
  };

  const handleSubmitProjectStage = (projectStageBody: any) => {
    submitProjectStage(projectStageBody, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      },
    });
  };

  const columns: ColumnDefinition[] = [
    {
      field: DQP_TABLE_COLUMNS.STAGE_ID,
      headerName: TABLE_HEADERS.STAGE_ID,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => {
        const stageName = params.row.stage_name ?? '';
        const stageNumber = params.row.stage_number;
        const displayText = stageNumber ? `${stageName} ${stageNumber}` : stageName;
        return (
          <Tooltip title={displayText} arrow>
            {displayText}
          </Tooltip>
        );
      },
    },
    {
      field: DQP_TABLE_COLUMNS.PARAMETERS,
      headerName: TABLE_HEADERS.PARAMETERS,
      flex: NUMBERMAP.TWO,
      renderCell: (params) => {
        const parameterForInspection: { id: number; specification_type: string }[] =
          params.row.parameters_for_inspection ?? [];
        const displayText =
          parameterForInspection.map((spec) => spec.specification_type).join(', ') ?? '';
        return (
          <Tooltip title={displayText} arrow placement={DESIGN_QUALITY_PLAN.TOP}>
            <span style={InlineStyles.cellStyle}>{displayText}</span>
          </Tooltip>
        );
      },
    },
    {
      field: DQP_TABLE_COLUMNS.STATUS,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params) => {
        return "-";
      },
    },
      {
      field: DQP_TABLE_COLUMNS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params) => (
        <div key={params.id}>
             <IconButton
                  aria-label={DESIGN_QUALITY_PLAN.BUTTON_ATTRIBUTES.LABEL}
                  color= {DESIGN_QUALITY_PLAN.BUTTON_ATTRIBUTES.ICON_COLOR}
                   onClick={() => handleOpenModal(params.row)}
                >
                  <Edit size={NUMBERMAP.EIGHTEEN} color={DESIGN_QUALITY_PLAN.BUTTON_ATTRIBUTES.EDIT_COLOR} />
                </IconButton>
        </div>
      ),
    },
  ];

  return (
    <TableContainer sx={InlineStyles.tableContainer}>
      <GlobalLoader loading={isAnyLoading()} />
      {designQualityList && (
        <>
      <Grid2>
        <Grid2>
          <Label title={LABELS.DESIGN_QUALITY_PLAN} />
        </Grid2>
      </Grid2>

      <DataTable
        rows={designQualityList?.data ?? []}
        columns={columns}
        IdField={STAGE_ORDER_ID_FIELD}
      />
      <Box sx={commentsStyle}>
       <CommentsHistory comments={designQualityList?.meta_info?.task_info?.task_comments} />
    </Box>
    <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
    <ReviewerModalManager
            isLoading={designQualityLoading}
            permissions={designQualityList?.meta_info?.action_control?.permissions ?? []}
            projectId={projectId}
            menuId={designQualityList?.meta_info?.action_control?.menuId}
            menuName={designQualityList?.meta_info?.action_control?.formName}
            hideSaveButton={true}
            customHandlers={{ 
              handleCancel: ()=>{router.push(ROUTE_PATHS.DND_PROJECT_LIST)}
            }}
            onPermissionChange={setHasEditPermission}
            reviewerList={designQualityList?.meta_info?.task_info?.reviewer_list}
          />
      </Grid2>
      </>
      )}
      <DesignQualityPlanModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveData}
        initialData={getInitialData()}
        stageOrderId={selectedStageOrderId ?? NUMBERMAP.ZERO}
        hasEditPermission={hasEditPermission}
      />
      <ProjectStagesPopupForm
        open={stageModal}
        onClose={() => setStageModal(false)}
        onSave={handleSubmitProjectStage}
      />
      <PopupForm
        onSave={() => {}}
        onClose={() => setDesignInputModal(false)}
        open={designInputModal}
      />
    </TableContainer>
  );
}