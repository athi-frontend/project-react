"use client";
import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { DataGridTable, ButtonGroup, Label, MultiSelect, InputField } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import { NUMBERMAP } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { ButtonContainer } from "@/styles/components/ui/button";
import { ErrorText, PY20 } from "@/styles/common";
import { InputLabel } from '@/styles/components/ui/input';
import { Value } from '@/styles/components/modules/projectInfo';
import { COMMON_CONSTANTS, stripHtml } from '@/lib/utils/common';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import ToolsModal from "./ToolsModal";
import EquipmentModal from "./EquipmentModal";
import MaintenancePlanModal from "./MaintenancePlanModal";
import {
  ToolData,
  EquipmentData,
  MaintenancePlanData,
  ToolFormData,
  EquipmentFormData,
  MaintenancePlanFormData,
  EntityData,
  DataGridSectionProps,
  EntityType,
} from "@/types/modules/infrastructure-management/maintenancePlan";
import { 
  MAINTENANCE_PLAN_ERROR_MESSAGES as ERROR_MESSAGES, 
  MAINTENANCE_PLAN_ENTITY_TYPES as ENTITY_TYPES,
  MAINTENANCE_PLAN_FORM_LABELS as FORM_LABELS,
  MAINTENANCE_PLAN_FORM_TITLES as FORM_TITLES,
  MAINTENANCE_PLAN_FORM_PLACEHOLDERS as FORM_PLACEHOLDERS,
  MAINTENANCE_PLAN_FORM_KEY_FIELDS as FORM_KEY_FIELDS,
  MAINTENANCE_PLAN_FORM_VALUE_FIELDS as FORM_VALUE_FIELDS,
  MAINTENANCE_PLAN_FORM_ID_FIELD as FORM_ID_FIELD,
  MAINTENANCE_PLAN_FORM_BUTTON_LABELS as FORM_BUTTON_LABELS,
  MAINTENANCE_PLAN_INITIAL_ERROR_STATE as INITIAL_ERROR_STATE,
  MAINTENANCE_PLAN_SET_EDITING_ID_KEYS as SET_EDITING_ID_KEYS,
  MAINTENANCE_PLAN_ERROR_KEYS as ERROR_KEYS,
  ROUTE_PATHS,
} from "@/constants/modules/infrastructure-management/infrastructureOnboardingTabs";
import { 
  useServiceTypes, 
  useFrequency, 
  useGetInfrastructureOnboardingMaintenancePlanById,
  usePostInfrastructureOnboardingMaintenancePlan,
  useGetInfrastructureOnboardingById,
} from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { useTools, useEquipment } from '@/hooks/modules/dnd/useInstallationProcedure';
import { useSkills } from '@/hooks/modules/hr/useRoleDefinition';
import { useOrganizationStatus } from '@/hooks/useCommonDropdown';
import { SUCCESS_ALERT, FAILED_ALERT } from "@/constants/modules/dnd/formTeam";
import {
  getToolIdByName,
  getToolNameById,
  getEquipmentIdByName,
  getEquipmentNameById,
  getFrequencyIdByName,
  getFrequencyNameById,
  getServiceTypeIdByName,
  getServiceTypeNameById,
  getStatusStringFromId,
} from "@/utils/modules/infrastructure-management/maintenancePlanHelpers";
import {
  getToolsColumns,
  getEquipmentColumns,
  getMaintenancePlanColumns,
} from "@/utils/modules/infrastructure-management/maintenancePlanColumns";

// Reusable DataGridTable wrapper component
const DataGridSection: React.FC<DataGridSectionProps> = ({
  onAddRow,
  columns,
  rows,
  title,
  error,
}) => (
  <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
    <DataGridTable
      showAddButton
      onAddRow={onAddRow}
      columns={columns}
      rows={rows}
      idField={FORM_ID_FIELD}
      hideFooter
      title={title}
    />
    {error && (
      <ErrorText>
        {error}
      </ErrorText>
    )}
  </Grid2>
);

/**
 * Classification : Confidential
 **/
const { DELETE_ALERT } = COMMON_CONSTANTS;

interface InfrastructureMaintenacePlanProps {
  infrastructureId?: number | null;
}

const InfrastructureMaintenacePlan: React.FC<InfrastructureMaintenacePlanProps> = ({ 
  infrastructureId: propInfrastructureId = null 
}) => {
  const router = useRouter();
  const { id } = useParams();
  const paramInfrastructureId = id && !isNaN(Number(id)) ? Number(id) : null;
  const infrastructureId = propInfrastructureId ?? paramInfrastructureId;

  const { data: TOOL_OPTIONS } = useTools();
  const { data: serviceTypesData } = useServiceTypes();
  const { data: frequencyData } = useFrequency();
  const { data: EQUIPMENT_OPTIONS } = useEquipment();
  const { data: skillSetData } = useSkills();
  const { data: statusData } = useOrganizationStatus();
  const { data: initialData } = useGetInfrastructureOnboardingMaintenancePlanById(
    infrastructureId ?? NUMBERMAP.ZERO,
    !!infrastructureId
  );
  const { mutate: postMaintenancePlan, isPending: isSaving } = usePostInfrastructureOnboardingMaintenancePlan();
  
  const planData = initialData?.data?.[NUMBERMAP.ZERO];
  
  // Fetch infrastructure details in create mode
  const isCreateMode = !planData?.maintenance_id;
  const { data: infrastructureDetailsData } = useGetInfrastructureOnboardingById(
    isCreateMode ? infrastructureId : null,
    isCreateMode && !!infrastructureId
  );

  // Modal state management - consolidated to avoid duplication
  const [modalStates, setModalStates] = useState({
    tools: false,
    equipment: false,
    maintenancePlan: false,
  });
  const [editingIds, setEditingIds] = useState<{
    tool: string | null;
    equipment: string | null;
    maintenancePlan: string | null;
  }>({
    tool: null,
    equipment: null,
    maintenancePlan: null,
  });
  
  // Form data state
  const [selectedSkills, setSelectedSkills] = useState<Array<string | number>>([]);
  const [toolsRows, setToolsRows] = useState<ToolData[]>([]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentData[]>([]);
  const [maintenancePlanRows, setMaintenancePlanRows] = useState<MaintenancePlanData[]>([]);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [statusId, setStatusId] = useState<number | null>(null);
  const [infrastructureCategoryName, setInfrastructureCategoryName] = useState<string>("");
  const [infrastructureTypeName, setInfrastructureTypeName] = useState<string>("");

  // Helper getters and setters for modal states
  const toolsModal = modalStates.tools;
  const equipmentModal = modalStates.equipment;
  const maintenancePlanModal = modalStates.maintenancePlan;
  const editingToolId = editingIds.tool;
  const editingEquipmentId = editingIds.equipment;
  const editingMaintenancePlanId = editingIds.maintenancePlan;

  const handleEdit = (row: EntityData, type: EntityType) => {
    const editHandlers = {
      [ENTITY_TYPES.TOOL]: () => {
        setEditingIds((prev) => ({ ...prev, tool: row.id }));
        setModalStates((prev) => ({ ...prev, tools: true }));
      },
      [ENTITY_TYPES.EQUIPMENT]: () => {
        setEditingIds((prev) => ({ ...prev, equipment: row.id }));
        setModalStates((prev) => ({ ...prev, equipment: true }));
      },
      [ENTITY_TYPES.MAINTENANCE_PLAN]: () => {
        setEditingIds((prev) => ({ ...prev, maintenancePlan: row.id }));
        setModalStates((prev) => ({ ...prev, maintenancePlan: true }));
      },
    };
    editHandlers[type]?.();
  };

  // Helper functions to reduce duplication in modals
  const closeToolModal = () => {
    setModalStates((prev) => ({ ...prev, tools: false }));
    setEditingIds((prev) => ({ ...prev, tool: null }));
  };

  const closeEquipmentModal = () => {
    setModalStates((prev) => ({ ...prev, equipment: false }));
    setEditingIds((prev) => ({ ...prev, equipment: null }));
  };

  const closeMaintenancePlanModal = () => {
    setModalStates((prev) => ({ ...prev, maintenancePlan: false }));
    setEditingIds((prev) => ({ ...prev, maintenancePlan: null }));
  };

  const handleDelete = async (id: string, type: EntityType) => {
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      const updateStatus = (prev: any[]) =>
        prev.map((row) => (row.id === id ? { ...row, status: "Inactive" } : row));
      
      const deleteHandlers = {
        [ENTITY_TYPES.TOOL]: () => setToolsRows(updateStatus),
        [ENTITY_TYPES.EQUIPMENT]: () => setEquipmentRows(updateStatus),
        [ENTITY_TYPES.MAINTENANCE_PLAN]: () => setMaintenancePlanRows(updateStatus),
      };
      deleteHandlers[type]?.();
    }
  };

  // Generic helper function to handle save operations
  interface SaveHandlerParams<T extends EntityData> {
    editingId: string | null;
    rows: T[];
    setRows: React.Dispatch<React.SetStateAction<T[]>>;
    setEditingIdKey: EntityType;
    createUpdatedRow: (existingRow: T) => T;
    createNewRow: (nextIndex: number, formattedSerial: string) => T;
    errorKey: keyof typeof INITIAL_ERROR_STATE;
    closeModal: () => void;
  }

  const createSaveHandler = <T extends EntityData>(params: SaveHandlerParams<T>) => {
    const {
      editingId,
      rows,
      setRows,
      setEditingIdKey,
      createUpdatedRow,
      createNewRow,
      errorKey,
      closeModal,
    } = params;

    if (editingId) {
      setRows((prev) =>
        prev.map((row) => (row.id === editingId ? createUpdatedRow(row) : row))
      );
      setEditingIds((prev) => ({ ...prev, [setEditingIdKey]: null }));
    } else {
      const nextIndex = rows.length + NUMBERMAP.ONE;
      const formattedSerial = nextIndex.toString().padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString());
      const newRow = createNewRow(nextIndex, formattedSerial);
      setRows((prev) => [...prev, newRow]);
    }
    setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    closeModal();
  };

  // Generic helper to get status value from status ID
  const getStatusValue = (statusId: string): string => {
    return statusData?.data?.find((s: any) => s.status_id === Number(statusId))?.status_name ?? statusId;
  };

  // Generic save handler factory to reduce duplication
  interface SaveHandlerConfig<T extends EntityData, F extends { status: string }> {
    data: F;
    editingId: string | null;
    rows: T[];
    setRows: React.Dispatch<React.SetStateAction<T[]>>;
    setEditingIdKey: EntityType;
    errorKey: keyof typeof INITIAL_ERROR_STATE;
    closeModal: () => void;
    transformData: (data: F, statusValue: string) => Partial<T>;
  }

  const createGenericSaveHandler = <T extends EntityData, F extends { status: string }>(
    config: SaveHandlerConfig<T, F>
  ) => {
    const { data, editingId, rows, setRows, setEditingIdKey, errorKey, closeModal, transformData } = config;
    const statusValue = getStatusValue(data.status);
    const transformedData = transformData(data, statusValue);

    createSaveHandler<T>({
      editingId,
      rows,
      setRows,
      setEditingIdKey,
      createUpdatedRow: (row) => ({ ...row, ...transformedData } as T),
      createNewRow: (nextIndex, formattedSerial) => ({
        id: nextIndex.toString(),
        serialNo: formattedSerial,
        ...transformedData,
      } as T),
      errorKey,
      closeModal,
    });
  };

  const handleToolSave = (data: ToolFormData) => {
    // Convert tool ID to tool name for display
    const toolName = getToolNameById(data.toolType, TOOL_OPTIONS) ?? data.toolType;

    // Check for duplicate toolType (case-insensitive, ignore same row in edit)
    const duplicate = toolsRows.some((row) => (
      row?.toolType?.trim().toLowerCase() === toolName?.trim()?.toLowerCase() &&
      (editingToolId ? row.id !== editingToolId : true)
    ));
    if (duplicate) {
      showActionAlert('customAlert', {
        title: 'Duplicate Entry',
        text: 'Duplicate Tool Type is not allowed.',
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      });
      return;
    }

    createGenericSaveHandler<ToolData, ToolFormData>({
      data,
      editingId: editingToolId,
      rows: toolsRows,
      setRows: setToolsRows,
      setEditingIdKey: SET_EDITING_ID_KEYS.TOOL,
      errorKey: ERROR_KEYS.TOOLS_REQUIRED,
      closeModal: closeToolModal,
      transformData: (data, statusValue) => ({
        toolType: getToolNameById(data.toolType, TOOL_OPTIONS) ?? data.toolType,
        status: statusValue,
      }),
    });
  };

  const handleEquipmentSave = (data: EquipmentFormData) => {
    // Convert equipment ID to equipment name for display
    const equipmentName = getEquipmentNameById(data.equipmentType, EQUIPMENT_OPTIONS) ?? data.equipmentType;

    // Check for duplicate equipmentType (case-insensitive, ignore same row in edit)
    const duplicate = equipmentRows.some((row) => (
      row?.equipmentType?.trim().toLowerCase() === equipmentName?.trim()?.toLowerCase() &&
      (editingEquipmentId ? row.id !== editingEquipmentId : true)
    ));
    if (duplicate) {
      showActionAlert('customAlert', {
        title: 'Duplicate Entry',
        text: 'Duplicate Equipment Type is not allowed.',
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      });
      return;
    }

    createGenericSaveHandler<EquipmentData, EquipmentFormData>({
      data,
      editingId: editingEquipmentId,
      rows: equipmentRows,
      setRows: setEquipmentRows,
      setEditingIdKey: SET_EDITING_ID_KEYS.EQUIPMENT,
      errorKey: ERROR_KEYS.EQUIPMENT_REQUIRED,
      closeModal: closeEquipmentModal,
      transformData: (data, statusValue) => ({
        equipmentType: getEquipmentNameById(data.equipmentType, EQUIPMENT_OPTIONS) ?? data.equipmentType,
        status: statusValue,
      }),
    });
  };

  const handleMaintenancePlanSave = (data: MaintenancePlanFormData) => {
    // Convert service type ID to service type name for display
    const serviceTypeName = getServiceTypeNameById(data.toBeDoneBy, serviceTypesData) ?? data.toBeDoneBy;
    // Convert frequency ID to frequency name for display
    const frequencyName = getFrequencyNameById(data.frequency, frequencyData) ?? data.frequency;

    // Check for duplicate: Description + ToBeDoneBy + Frequency are the same (case-insensitive, ignore same row in edit)
    const duplicate = maintenancePlanRows.some((row) => (
      stripHtml(row.maintenanceDescription).trim().toLowerCase() === stripHtml(data.maintenanceDescription).trim().toLowerCase() &&
      row?.toBeDoneBy?.trim().toLowerCase() === serviceTypeName.trim().toLowerCase() &&
      row?.frequency?.trim().toLowerCase() === frequencyName.trim().toLowerCase() &&
      (editingMaintenancePlanId ? row.id !== editingMaintenancePlanId : true) 
    ));
    if (duplicate) {
      showActionAlert('customAlert', {
        title: 'Duplicate Entry',
        text: 'Combination of Maintenance Plan Description, To be Done By, and Frequency must be unique.',
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      });
      return;
    }

    createGenericSaveHandler<MaintenancePlanData, MaintenancePlanFormData>({
      data,
      editingId: editingMaintenancePlanId,
      rows: maintenancePlanRows,
      setRows: setMaintenancePlanRows,
      setEditingIdKey: SET_EDITING_ID_KEYS.MAINTENANCE_PLAN,
      errorKey: ERROR_KEYS.MAINTENANCE_PLAN,
      closeModal: closeMaintenancePlanModal,
      transformData: (data, statusValue) => ({
        maintenanceDescription: data.maintenanceDescription,
        toBeDoneBy: getServiceTypeNameById(data.toBeDoneBy, serviceTypesData) ?? data.toBeDoneBy,
        frequency: getFrequencyNameById(data.frequency, frequencyData) ?? data.frequency,
        status: statusValue,
      }),
    });
  };

  const validateForm = () => {
    const newErrors = { ...INITIAL_ERROR_STATE };
    let isValid = true;

    // Helper function to validate array fields
    const validateArrayField = (
      value: any[] | null | undefined,
      errorKey: keyof typeof INITIAL_ERROR_STATE,
      errorMessage: string
    ) => {
      if (!value || value.length === NUMBERMAP.ZERO) {
        newErrors[errorKey] = errorMessage;
        isValid = false;
      }
    };

    // Validate status
    if (!statusId) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED;
      isValid = false;
    }

    // Validate array fields using helper
    validateArrayField(selectedSkills, "skillSetRequired", ERROR_MESSAGES.SKILL_SET_REQUIRED);
    validateArrayField(toolsRows, "toolsRequired", ERROR_MESSAGES.TOOLS_REQUIRED);
    validateArrayField(equipmentRows, "equipmentRequired", ERROR_MESSAGES.EQUIPMENT_REQUIRED);
    validateArrayField(maintenancePlanRows, "maintenancePlan", ERROR_MESSAGES.MAINTENANCE_PLAN_REQUIRED);

    setErrors(newErrors);
    return isValid;
  };

  // Helper functions to reduce cognitive complexity
  const processSkillSet = (data: any) => {
    if (data.skill_set && data.skill_set.length > NUMBERMAP.ZERO) {
      const skillIds = data.skill_set.map((skill: any) => skill.id);
      setSelectedSkills(skillIds);
      return;
    }
    if (data.skill_set_required && data.skill_set_required.length > NUMBERMAP.ZERO) {
      const skillIds = data.skill_set_required.map((skill: any) => skill.skill_id ?? skill.id);
      setSelectedSkills(skillIds);
    }
  };

  // Generic helper to process entity arrays and reduce duplication
  const processEntityArray = <T extends EntityData>(
    dataArray: any[] | null | undefined,
    mapper: (item: any, index: number) => Omit<T, 'id' | 'serialNo' | 'status'>,
    setRows: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (!dataArray || dataArray.length === NUMBERMAP.ZERO) {
      return false;
    }

    const mappedData = dataArray.map((item: any, index: number) => {
      const statusString = getStatusStringFromId(item.status_id, statusData);
      const entityData = mapper(item, index);
      return {
        id: (index + NUMBERMAP.ONE).toString(),
        serialNo: (index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString()),
        status: statusString,
        ...entityData,
      } as T;
    });

    setRows(mappedData);
    return true;
  };

  const processTools = (data: any) => {
    // Try tools_required first
    if (processEntityArray<ToolData>(
      data.tools_required,
      (tool) => ({
        toolType: getToolNameById(tool.tool_type_id, TOOL_OPTIONS) ?? tool.tool_type,
        toolId: tool.infrastructure_maintenance_tool_id,
      }),
      setToolsRows
    )) {
      return;
    }

    // Fallback to tools
    processEntityArray<ToolData>(
      data.tools,
      (tool) => ({
        toolType: getToolNameById(tool.tool_id, TOOL_OPTIONS) ?? tool.tool_name,
        toolId: tool.maintenance_plan_tool_id,
      }),
      setToolsRows
    );
  };

  const processEquipment = (data: any) => {
    processEntityArray<EquipmentData>(
      data.equipment_required,
      (equip) => ({
        equipmentType: getEquipmentNameById(
          equip.equipment_type_id ?? equip.equipment_id,
          EQUIPMENT_OPTIONS
        ) ?? equip.equipment_type ?? equip.equipment_name,
        equipmentId: equip.infrastructure_maintenance_equipment_id ?? equip.maintenance_plan_equipment_id,
      }),
      setEquipmentRows
    );
  };

  const processMaintenancePlans = (data: any) => {
    processEntityArray<MaintenancePlanData>(
      data.maintenance_plan,
      (plan) => {
        const serviceTypeId = plan.done_by_id ?? plan.maintenance_service_type_id;
        return {
          maintenanceDescription: plan.maintenance_description,
          toBeDoneBy: getServiceTypeNameById(serviceTypeId, serviceTypesData) ?? plan.done_by ?? plan.maintenance_service_type,
          frequency: getFrequencyNameById(plan.frequency_id, frequencyData) ?? plan.frequency ?? plan.frequency_name,
          maintenancePlanId: plan.infrastructure_maintenance_plan_id ?? plan.maintenance_plan_detail_id,
        };
      },
      setMaintenancePlanRows
    );
  };

  // Populate infrastructure details in create mode
  useEffect(() => {
    if (isCreateMode && infrastructureDetailsData?.data?.[NUMBERMAP.ZERO]) {
      const infrastructureDetails = infrastructureDetailsData.data[NUMBERMAP.ZERO];
      setInfrastructureCategoryName(infrastructureDetails.infrastructure_category_name ?? "");
      // Note: getInfrastructureOnboardingById returns infrastructure_type (not infrastructure_type_name)
      setInfrastructureTypeName(infrastructureDetails.infrastructure_type_name ?? infrastructureDetails.infrastructure_type ?? "");
    }
  }, [isCreateMode, infrastructureDetailsData]);

  // Populate form data from initialData when in edit mode
  useEffect(() => {
    if (!planData || !TOOL_OPTIONS?.data || !EQUIPMENT_OPTIONS?.data || !serviceTypesData?.data || !frequencyData?.data) {
      return;
    }

    setStatusId(planData.status_id);
    setInfrastructureCategoryName(planData.infrastructure_category_name ?? "");
    setInfrastructureTypeName(planData.infrastructure_type_name ?? "");

    processSkillSet(planData);
    processTools(planData);
    processEquipment(planData);
    processMaintenancePlans(planData);
  }, [planData, TOOL_OPTIONS, EQUIPMENT_OPTIONS, serviceTypesData, frequencyData, statusData]);

  // Helper to get status ID from status name
  const getStatusIdFromName = (statusName: string): number => {
    return statusData?.data?.find((s: any) => s.status_name === statusName)?.status_id ?? NUMBERMAP.ONE;
  };

  const handleSave = () => {
    if (!validateForm() || !infrastructureId) {
      return;
    }

    const tools = toolsRows.map((tool) => {
      const toolId = getToolIdByName(tool.toolType, TOOL_OPTIONS);
      const toolPayload: any = {
        tool_type_id: toolId,
        status: getStatusIdFromName(tool.status),
        infrastructure_maintenance_tool_id: tool.toolId ?? "",
      };
      return toolPayload;
    });

    const equipment = equipmentRows.map((equip) => {
      const equipmentId = getEquipmentIdByName(equip.equipmentType, EQUIPMENT_OPTIONS);
      const equipmentPayload: any = {
        equipment_type_id: equipmentId,
        status: getStatusIdFromName(equip.status),
        infrastructure_maintenance_equipment_id: equip.equipmentId ?? "",
      };
      return equipmentPayload;
    });

    const maintenancePlan = maintenancePlanRows.map((plan) => {
      const frequencyId = getFrequencyIdByName(plan.frequency, frequencyData);
      const serviceTypeId = getServiceTypeIdByName(plan.toBeDoneBy, serviceTypesData);
      const planPayload: any = {
        maintenance_description: plan.maintenanceDescription,
        done_by_id: serviceTypeId,
        frequency_id: frequencyId,
        status: getStatusIdFromName(plan.status),
        infrastructure_maintenance_plan_id: plan.maintenancePlanId ?? "",
      };
      return planPayload;
    });

    const skillSetRequired = selectedSkills.map((skill) => {
      if (typeof skill === 'number') return skill;
      const skillId = parseInt(skill.toString());
      return isNaN(skillId) ? null : skillId;
    }).filter((id): id is number => id !== null);

    const payload: any = {
      infrastructure_id: infrastructureId,
      status: statusId ?? NUMBERMAP.ONE,
      skill_set: skillSetRequired,
      tools_required: tools,
      equipment_required: equipment,
      maintenance_plan: maintenancePlan,
    };

    if (planData?.maintenance_id) {
      payload.maintenance_id = planData.maintenance_id;
    }

    postMaintenancePlan(
      { infrastructure_id: infrastructureId, payload },
      {
        onSuccess: () => {
          showActionAlert(SUCCESS_ALERT);
          router.push(ROUTE_PATHS.INFRA_ONBOARDING);
        },
        onError: () => {
          showActionAlert(FAILED_ALERT);
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  // Column definitions using utility functions
  const toolsColumns = getToolsColumns(handleEdit, handleDelete);
  const equipmentColumns = getEquipmentColumns(handleEdit, handleDelete);
  const maintenancePlanColumns = getMaintenancePlanColumns(handleEdit, handleDelete);

  const buttonConfig = [
    { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleCancel },
    { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave, loading: isSaving }
  ];

  return (
    <FormContainer>
      <GlobalLoader loading={isSaving } />
      <FormWrapper>
        <Label title={planData?.maintenance_id ? FORM_TITLES.EDIT_MAINTENANCE_PLAN : FORM_TITLES.ADD_MAINTENANCE_PLAN} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{FORM_LABELS.ONBOARDING_INFRASTRUCTURE_CATEGORY}</InputLabel>
              <Value>{infrastructureCategoryName ?? ''}</Value>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputLabel>{FORM_LABELS.ONBOARDING_INFRASTRUCTURE_TYPE}</InputLabel>
              <Value>{infrastructureTypeName ?? ''}</Value>
            </Grid2>
          </Grid2>
          {/* Tools Section */}
          <DataGridSection
            onAddRow={() => {
              setEditingIds((prev) => ({ ...prev, tool: null }));
              setModalStates((prev) => ({ ...prev, tools: true }));
            }}
            columns={toolsColumns}
            rows={toolsRows}
            title={FORM_TITLES.TOOLS_REQUIRED}
            error={errors.toolsRequired}
          />
          {/* Equipment Section */}
          <DataGridSection
            onAddRow={() => {
              setEditingIds((prev) => ({ ...prev, equipment: null }));
              setModalStates((prev) => ({ ...prev, equipment: true }));
            }}
            columns={equipmentColumns}
            rows={equipmentRows}
            title={FORM_TITLES.EQUIPMENT_REQUIRED}
            error={errors.equipmentRequired}
          />

          <Grid2 container spacing={NUMBERMAP.TWO} size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={FORM_LABELS.SKILL_SET_REQUIRED}
                options={skillSetData?.data ?? []}
                idField={FORM_KEY_FIELDS.SKILL_ID}
                valueField={FORM_VALUE_FIELDS.SKILL_NAME}
                value={selectedSkills}
                onChange={(value: Array<string | number>) => {
                  setSelectedSkills(value);
                  setErrors((prev) => ({ ...prev, skillSetRequired: "" }));
                }}
                placeholder={FORM_PLACEHOLDERS.SELECT_SKILLS}
                error={errors.skillSetRequired}
              />
            </Grid2>
          </Grid2>

          {/* Maintainance Plan */}
          <DataGridSection
            onAddRow={() => {
              setEditingIds((prev) => ({ ...prev, maintenancePlan: null }));
              setModalStates((prev) => ({ ...prev, maintenancePlan: true }));
            }}
            columns={maintenancePlanColumns}
            rows={maintenancePlanRows}
            title={FORM_TITLES.MAINTENANCE_PLAN}
            error={errors.maintenancePlan}
          />

          {/* Status at the end */}
          <Grid2 container spacing={NUMBERMAP.ONE} size={NUMBERMAP.TWELVE} sx={PY20}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown
                value={statusId?.toString() ?? null}
                onChange={(value: any) => {
                  setStatusId(Number(value));
                  setErrors((prev) => ({ ...prev, status: "" }));
                }}
                options={statusData?.data}
                keyField={FORM_KEY_FIELDS.STATUS_ID}
                valueField={FORM_VALUE_FIELDS.STATUS_NAME}
                error={errors.status}
              />
            </Grid2>
          </Grid2>

          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>

      {/* Modals */}
      <CommonModal
        title={editingToolId ? FORM_TITLES.EDIT_TOOLS_REQUIRED : FORM_TITLES.ADD_TOOLS_REQUIRED}
        open={toolsModal}
        onClose={closeToolModal}
      >
        <ToolsModal
          key={`tool-${editingToolId ?? 'new'}-${toolsModal}`}
          onClose={closeToolModal}
          onCancel={closeToolModal}
          onSave={handleToolSave}
          initialData={
            editingToolId
              ? (() => {
                  const row = toolsRows.find((row) => row.id === editingToolId);
                  if (!row) return undefined;
                  const toolId = getToolIdByName(row.toolType, TOOL_OPTIONS);
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    toolType: toolId?.toString() ?? row.toolType,
                    status: statusId?.toString() ?? row.status,
                  };
                })()
              : undefined
          }
          toolsData={TOOL_OPTIONS}
          statusData={statusData}
        />
      </CommonModal>
      <CommonModal
        title={editingEquipmentId ? FORM_TITLES.EDIT_EQUIPMENT : FORM_TITLES.ADD_EQUIPMENT}
        open={equipmentModal}
        onClose={closeEquipmentModal}
      >
        <EquipmentModal
          key={`equipment-${editingEquipmentId ?? 'new'}-${equipmentModal}`}
          onClose={closeEquipmentModal}
          onCancel={closeEquipmentModal}
          onSave={handleEquipmentSave}
          initialData={
            editingEquipmentId
              ? (() => {
                  const row = equipmentRows.find((row) => row.id === editingEquipmentId);
                  if (!row) return undefined;
                  const equipmentId = getEquipmentIdByName(row.equipmentType, EQUIPMENT_OPTIONS);
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    equipmentType: equipmentId?.toString() ?? row.equipmentType,
                    status: statusId?.toString() ?? row.status,
                  };
                })()
              : undefined
          }
          equipmentData={EQUIPMENT_OPTIONS}
          statusData={statusData}
        />
      </CommonModal>
      <CommonModal
        title={editingMaintenancePlanId ? FORM_TITLES.EDIT_MAINTENANCE_PLAN : FORM_TITLES.ADD_MAINTENANCE_PLAN}
        open={maintenancePlanModal}
        onClose={closeMaintenancePlanModal}
      >
        <MaintenancePlanModal
          key={`maintenance-${editingMaintenancePlanId ?? 'new'}-${maintenancePlanModal}`}
          onClose={closeMaintenancePlanModal}
          onCancel={closeMaintenancePlanModal}
          onSave={handleMaintenancePlanSave}
          initialData={
            editingMaintenancePlanId
              ? (() => {
                  const row = maintenancePlanRows.find((row) => row.id === editingMaintenancePlanId);
                  if (!row) return undefined;
                  const serviceTypeId = getServiceTypeIdByName(row.toBeDoneBy, serviceTypesData);
                  const frequencyId = getFrequencyIdByName(row.frequency, frequencyData);
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    toBeDoneBy: serviceTypeId?.toString() ?? row.toBeDoneBy,
                    frequency: frequencyId?.toString() ?? row.frequency,
                    status: statusId?.toString() ?? row.status,
                  };
                })()
              : undefined
          }
          frequencyData={frequencyData}
          serviceTypesData={serviceTypesData}
          statusData={statusData}
        />
      </CommonModal>
    </FormContainer>
  );
};

export default InfrastructureMaintenacePlan;