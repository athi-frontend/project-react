"use client";
import React, { useState, useEffect, useRef } from "react";
import { Grid2, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGridTable, ButtonGroup, Label, ActionButton, MultiSelect, InputField } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP, STATUS_VALUE } from "@/constants/common";
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { ButtonContainer } from "@/styles/components/ui/button";
import { errorTextSx } from "@/styles/common";
import { COMMON_CONSTANTS, stripHtml } from '@/lib/utils/common';
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import ToolsModal from "./ToolsModal";
import EquipmentModal from "./EquipmentModal";
import MaintenancePlanModal from "./MaintenancePlanModal";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { removeFieldsFromFormData } from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import {
  MaintenancePlanFormProps,
  ToolData,
  EquipmentData,
  MaintenancePlanData,
  ToolFormData,
  EquipmentFormData,
  MaintenancePlanFormData,
  ToolApiResponse,
  EquipmentApiResponse,
  FrequencyApiResponse,
  ServiceTypeApiResponse,
  ToolPayload,
  EquipmentPayload,
  MaintenancePlanPayload,
  MaintenancePlanPostPayload,
} from "@/types/modules/infrastructure-management/maintenancePlan";
import { 
  ERROR_MESSAGES, 
  ENTITY_TYPES,
  MAINTENANCE_PLAN_LIST_PATH,
  FORM_FIELDS,
  FORM_HEADERS,
  FORM_LABELS,
  FORM_TITLES,
  FORM_PLACEHOLDERS,
  FORM_KEY_FIELDS,
  FORM_VALUE_FIELDS,
  FORM_ID_FIELD,
  FORM_BUTTON_LABELS,
  FORM_DEFAULT_VALUES,
  INITIAL_ERROR_STATE,
  CONTEXT_TYPE,
} from "@/constants/modules/infrastructure-management/maintenancePlan";
import { useServiceTypes, useFrequency, usePostMaintenancePlan, useInfrastructureCategory, useInfrastructureType } from "@/hooks/modules/infrastructure-management/useMaintenancePlan";
import { useTools, useEquipment } from '@/hooks/modules/dnd/useInstallationProcedure';
import { useSkills } from '@/hooks/modules/hr/useRoleDefinition'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { SUCCESS_ALERT, FAILED_ALERT } from "@/constants/modules/dnd/formTeam";

/**
 * Classification : Confidential
 **/
const { DELETE_ALERT } = COMMON_CONSTANTS;

const MaintenancePlan: React.FC<MaintenancePlanFormProps> = ({
  infrastructureCategoryValue,
  infrastructureTypeValue,
  onInfrastructureCategoryChange,
  onInfrastructureTypeChange,
  maintenanceId,
  initialData,
}) => {
  const router = useRouter();
  const isAddMode = !maintenanceId;
  const initialDraftLoading = useRef(true);
  const { data: TOOL_OPTIONS } = useTools();
  const { data: serviceTypesData } = useServiceTypes();
  const { data: frequencyData } = useFrequency();
  const { data: EQUIPMENT_OPTIONS } = useEquipment();
  const { data: infrastructureCategoryData } = useInfrastructureCategory();
  const { data: infrastructureTypeData } = useInfrastructureType();
  const { data: skillSetData } = useSkills();
  const { data: statusData } = useOrganizationStatus();
  const { mutate: postMaintenancePlan, isPending: isSaving } = usePostMaintenancePlan();
  const [toolsModal, setToolsModal] = useState(false);
  const [equipmentModal, setEquipmentModal] = useState(false);
  const [maintenancePlanModal, setMaintenancePlanModal] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
  const [editingMaintenancePlanId, setEditingMaintenancePlanId] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<Array<string | number>>([]);
  const [toolsRows, setToolsRows] = useState<ToolData[]>([]);
  const [equipmentRows, setEquipmentRows] = useState<EquipmentData[]>([]);
  const [maintenancePlanRows, setMaintenancePlanRows] = useState<MaintenancePlanData[]>([]);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);

  // Draft save hook
  const maintenanceIdForDraft = isAddMode ? null : maintenanceId;
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: CONTEXT_TYPE.MAINTENANCE_PLAN,
    context_instance_id: maintenanceIdForDraft,
    enableFetch: false
  });

  // Use internal state if props are not provided (for backward compatibility)
  const [internalFormData, setInternalFormData] = useState<{
    infrastructureCategory: string;
    infrastructureType: string;
    status_id: number | null;
  }>({
    infrastructureCategory: FORM_DEFAULT_VALUES.INFRASTRUCTURE_CATEGORY,
    infrastructureType: FORM_DEFAULT_VALUES.INFRASTRUCTURE_TYPE,
    status_id: null,
  });

  // Get current values - use props if provided, otherwise use internal state
  const currentCategoryValue = infrastructureCategoryValue ?? internalFormData.infrastructureCategory;
  const currentTypeValue = infrastructureTypeValue ?? internalFormData.infrastructureType;

  const handleEdit = (row: ToolData | EquipmentData | MaintenancePlanData, type: 'tool' | 'equipment' | 'maintenancePlan') => {
    if (type === ENTITY_TYPES.TOOL) {
      setEditingToolId(row.id);
      setToolsModal(true);
    } else if (type === ENTITY_TYPES.EQUIPMENT) {
      setEditingEquipmentId(row.id);
      setEquipmentModal(true);
    } else if (type === ENTITY_TYPES.MAINTENANCE_PLAN) {
      setEditingMaintenancePlanId(row.id);
      setMaintenancePlanModal(true);
    }
  };

  const handleDelete = async (id: string, type: 'tool' | 'equipment' | 'maintenancePlan') => {
    const result = await showActionAlert(DELETE_ALERT);
    if (result.isConfirmed) {
      if (type === ENTITY_TYPES.TOOL) {
        const updated = toolsRows.map((row) =>
          row.id === id
            ? { ...row, status: "Inactive" }
            : row
        );
        setToolsRows(updated);
          const updatedFormData = {
            infrastructureCategory: currentCategoryValue,
            infrastructureType: currentTypeValue,
            status_id: internalFormData.status_id,
          };
          handleDraftSave(updatedFormData, updated);
        
      } else if (type === ENTITY_TYPES.EQUIPMENT) {
        const updated = equipmentRows.map((row) =>
          row.id === id
            ? { ...row, status: "Inactive" }
            : row
        );
        setEquipmentRows(updated);
          const updatedFormData = {
            infrastructureCategory: currentCategoryValue,
            infrastructureType: currentTypeValue,
            status_id: internalFormData.status_id,
          };
          handleDraftSave(updatedFormData, undefined, updated);
        
      } else if (type === ENTITY_TYPES.MAINTENANCE_PLAN) {
        const updated = maintenancePlanRows.map((row) =>
          row.id === id
            ? { ...row, status: "Inactive" }
            : row
        );
        setMaintenancePlanRows(updated);
          const updatedFormData = {
            infrastructureCategory: currentCategoryValue,
            infrastructureType: currentTypeValue,
            status_id: internalFormData.status_id,
          };
          handleDraftSave(updatedFormData, undefined, undefined, updated);
        
      }
    }
  };

  const handleDraftSave = (formDataToSave?: { infrastructureCategory?: string; infrastructureType?: string; status_id?: number | null }, toolsToSave?: ToolData[], equipmentToSave?: EquipmentData[], maintenancePlansToSave?: MaintenancePlanData[], skillsToSave?: Array<string | number>) => {
    const toolsToUse = toolsToSave ?? toolsRows;
    const equipmentToUse = equipmentToSave ?? equipmentRows;
    const maintenancePlansToUse = maintenancePlansToSave ?? maintenancePlanRows;
    const skillsToUse = skillsToSave ?? selectedSkills;

    const formData = {
      infrastructureCategory: formDataToSave?.infrastructureCategory ?? currentCategoryValue,
      infrastructureType: formDataToSave?.infrastructureType ?? currentTypeValue,
      status_id: formDataToSave?.status_id ?? internalFormData.status_id,
    };

    const cleaned = removeFieldsFromFormData(formData, []);

    const payload = {
      id: maintenanceIdForDraft ?? new Date().getTime(),
      ...cleaned,
      selectedSkills: skillsToUse,
      toolsRows: toolsToUse,
      equipmentRows: equipmentToUse,
      maintenancePlanRows: maintenancePlansToUse,
      type: 'draft',
    }

    draftSave({
      form_type: CONTEXT_TYPE.MAINTENANCE_PLAN,
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const handleToolSave = (data: ToolFormData) => {
    // Convert tool ID to tool name for display
    const toolName = findToolName(data.toolType) || data.toolType;
    // Convert status_id to status name for display
    const statusValue = statusData?.data?.find((s: any) => s.status_id === Number(data.status))?.status_name ?? data.status;

    // Check for duplicate toolType (case-insensitive, only for Active rows, ignore same row in edit)
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

    let updatedTools: ToolData[] = [];
    if (editingToolId) {
      // Update existing tool - preserve database ID
      updatedTools = toolsRows.map((row) =>
        row.id === editingToolId
          ? {
              ...row,
              toolType: toolName,
              status: statusValue,
              // toolId is already preserved from existing row
            }
          : row
      );
      setToolsRows(updatedTools);
      setEditingToolId(null);
    } else {
      // Add new tool - no database ID for new records
      const nextIndex = toolsRows.length + NUMBERMAP.ONE;
      const formattedSerial = nextIndex.toString().padStart(NUMBERMAP.TWO, "0");
      const newRow: ToolData = {
        id: nextIndex.toString(),
        serialNo: formattedSerial,
        toolType: toolName,
        status: statusValue,
        // No toolId for new records
      };
      updatedTools = [...toolsRows, newRow];
      setToolsRows(updatedTools);
    }
    setErrors((prev) => ({ ...prev, toolsRequired: "" }));
    setToolsModal(false);
    if (!initialDraftLoading.current) {
      const updatedFormData = {
        infrastructureCategory: currentCategoryValue,
        infrastructureType: currentTypeValue,
        status_id: internalFormData.status_id,
      };
      handleDraftSave(updatedFormData, updatedTools);
    }
  };


  const handleEquipmentSave = (data: EquipmentFormData) => {
    // Convert equipment ID to equipment name for display
    const equipmentName = findEquipmentName(data.equipmentType) || data.equipmentType;
    // Convert status_id to status name for display
    const statusValue = statusData?.data?.find((s: any) => s.status_id === Number(data.status))?.status_name ?? data.status;

    // Check for duplicate equipmentType (case-insensitive, only for Active rows, ignore same row in edit)
    const duplicate = equipmentRows.some((row) => (
      row?.equipmentType?.trim().toLowerCase() === equipmentName?.trim().toLowerCase() &&
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

    let updatedEquipment: EquipmentData[] = [];
    if (editingEquipmentId) {
      // Update existing equipment - preserve database ID
      updatedEquipment = equipmentRows.map((row) =>
        row.id === editingEquipmentId
          ? {
              ...row,
              equipmentType: equipmentName,
              status: statusValue,
              // equipmentId is already preserved from existing row
            }
          : row
      );
      setEquipmentRows(updatedEquipment);
      setEditingEquipmentId(null);
    } else {
      // Add new equipment - no database ID for new records
      const nextIndex = equipmentRows.length + NUMBERMAP.ONE;
      const formattedSerial = nextIndex.toString().padStart(NUMBERMAP.TWO, "0");
      const newRow: EquipmentData = {
        id: nextIndex.toString(),
        serialNo: formattedSerial,
        equipmentType: equipmentName,
        status: statusValue,
        // No equipmentId for new records
      };
      updatedEquipment = [...equipmentRows, newRow];
      setEquipmentRows(updatedEquipment);
    }
    setErrors((prev) => ({ ...prev, equipmentRequired: "" }));
    setEquipmentModal(false);
    if (!initialDraftLoading.current) {
      const updatedFormData = {
        infrastructureCategory: currentCategoryValue,
        infrastructureType: currentTypeValue,
        status_id: internalFormData.status_id,
      };
      handleDraftSave(updatedFormData, undefined, updatedEquipment);
    }
  };


  const handleMaintenancePlanSave = (data: MaintenancePlanFormData) => {
    // Convert service type ID to service type name for display
    const serviceTypeName = findServiceTypeName(data.toBeDoneBy) || data.toBeDoneBy;
    // Convert frequency ID to frequency name for display
    const frequencyName = findFrequencyName(data.frequency) || data.frequency;
    // Convert status_id to status name for display
    const statusValue = statusData?.data?.find((s: any) => s.status_id === Number(data.status))?.status_name ?? data.status;

    // Check for duplicate: Description + ToBeDoneBy + Frequency are the same (case-insensitive, only for Active, ignore same row in edit)
    const duplicate = maintenancePlanRows.some((row) => (
      stripHtml(row.maintenanceDescription).trim().toLowerCase() === stripHtml(data.maintenanceDescription).trim().toLowerCase() &&
      row?.toBeDoneBy?.trim().toLowerCase() === (findServiceTypeName(data.toBeDoneBy) || data.toBeDoneBy).trim().toLowerCase() &&
      row?.frequency?.trim().toLowerCase() === (findFrequencyName(data.frequency) || data.frequency).trim().toLowerCase() &&
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

    let updatedMaintenancePlans: MaintenancePlanData[] = [];
    if (editingMaintenancePlanId) {
      // Update existing maintenance plan - preserve database ID
      updatedMaintenancePlans = maintenancePlanRows.map((row) =>
        row.id === editingMaintenancePlanId
          ? {
              ...row,
              maintenanceDescription: data.maintenanceDescription,
              toBeDoneBy: serviceTypeName,
              frequency: frequencyName,
              status: statusValue,
              // maintenancePlanId is already preserved from existing row
            }
          : row
      );
      setMaintenancePlanRows(updatedMaintenancePlans);
      setEditingMaintenancePlanId(null);
    } else {
      // Add new maintenance plan - no database ID for new records
      const nextIndex = maintenancePlanRows.length + NUMBERMAP.ONE;
      const formattedSerial = nextIndex.toString().padStart(NUMBERMAP.TWO, "0");
      const newRow: MaintenancePlanData = {
        id: nextIndex.toString(),
        serialNo: formattedSerial,
        maintenanceDescription: data.maintenanceDescription,
        toBeDoneBy: serviceTypeName,
        frequency: frequencyName,
        status: statusValue,
        // No maintenancePlanId for new records
      };
      updatedMaintenancePlans = [...maintenancePlanRows, newRow];
      setMaintenancePlanRows(updatedMaintenancePlans);
    }
    setErrors((prev) => ({ ...prev, maintenancePlan: "" }));
    setMaintenancePlanModal(false);
    if (!initialDraftLoading.current) {
      const updatedFormData = {
        infrastructureCategory: currentCategoryValue,
        infrastructureType: currentTypeValue,
        status_id: internalFormData.status_id,
      };
      handleDraftSave(updatedFormData, undefined, undefined, updatedMaintenancePlans);
    }
  };


  const validateForm = () => {
    const newErrors = { ...INITIAL_ERROR_STATE };
    let isValid = true;

    // Validate Infrastructure Category
    if (!currentCategoryValue || 
        currentCategoryValue === FORM_DEFAULT_VALUES.INFRASTRUCTURE_CATEGORY || 
        currentCategoryValue.trim() === "") {
      newErrors.infrastructureCategory = ERROR_MESSAGES.INFRASTRUCTURE_CATEGORY_REQUIRED;
      isValid = false;
    }

    // Validate Infrastructure Type
    if (!currentTypeValue || 
        currentTypeValue === FORM_DEFAULT_VALUES.INFRASTRUCTURE_TYPE || 
        currentTypeValue.trim() === "") {
      newErrors.infrastructureType = ERROR_MESSAGES.INFRASTRUCTURE_TYPE_REQUIRED;
      isValid = false;
    }

    // Validate Status
    if (!internalFormData.status_id) {
      newErrors.status = ERROR_MESSAGES.STATUS_REQUIRED;
      isValid = false;
    }

    if (!selectedSkills || selectedSkills.length === NUMBERMAP.ZERO) {
      newErrors.skillSetRequired = ERROR_MESSAGES.SKILL_SET_REQUIRED;
      isValid = false;
    }

    // Validate Tools Required
    if (!toolsRows || toolsRows.length === NUMBERMAP.ZERO) {
      newErrors.toolsRequired = ERROR_MESSAGES.TOOLS_REQUIRED;
      isValid = false;
    }

    // Validate Equipment Required
    if (!equipmentRows || equipmentRows.length === NUMBERMAP.ZERO) {
      newErrors.equipmentRequired = ERROR_MESSAGES.EQUIPMENT_REQUIRED;
      isValid = false;
    }

    // Validate Maintenance Plan
    if (!maintenancePlanRows || maintenancePlanRows.length === NUMBERMAP.ZERO) {
      newErrors.maintenancePlan = ERROR_MESSAGES.MAINTENANCE_PLAN_REQUIRED;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  // Helper function to find tool ID by tool name
  const findToolId = (toolName: string): number | null => {
    const tool = TOOL_OPTIONS?.data?.find((t: ToolApiResponse) => t.tool_name === toolName);
    return tool?.tool_id ?? null;
  };

  // Helper function to find tool name by tool ID
  const findToolName = (toolId: string | number): string | null => {
    const tool = TOOL_OPTIONS?.data?.find((t: ToolApiResponse) => t.tool_id === Number(toolId));
    return tool?.tool_name ?? null;
  };

  // Helper function to find equipment ID by equipment name
  const findEquipmentId = (equipmentName: string): number | null => {
    const equipment = EQUIPMENT_OPTIONS?.data?.find((e: EquipmentApiResponse) => e.equipment_name === equipmentName);
    return equipment?.equipment_id ?? null;
  };

  // Helper function to find equipment name by equipment ID
  const findEquipmentName = (equipmentId: string | number): string | null => {
    const equipment = EQUIPMENT_OPTIONS?.data?.find((e: EquipmentApiResponse) => e.equipment_id === Number(equipmentId));
    return equipment?.equipment_name ?? null;
  };

  // Helper function to find frequency ID by frequency name
  const findFrequencyId = (frequencyName: string): number | null => {
    const frequency = frequencyData?.data?.find((f: FrequencyApiResponse) => f.frequency_name === frequencyName);
    return frequency?.id ?? null;
  };

  // Helper function to find frequency name by frequency ID
  const findFrequencyName = (frequencyId: string | number): string | null => {
    const frequency = frequencyData?.data?.find((f: FrequencyApiResponse) => f.id === Number(frequencyId));
    return frequency?.frequency_name ?? null;
  };

  // Helper function to map responsibility key to service type ID
  const findServiceTypeId = (responsibilityName: string): number | null => {
    // If serviceTypesData is available, try to find a match by name
    if (serviceTypesData?.data) {
      const serviceType = serviceTypesData.data.find((st: ServiceTypeApiResponse) => 
        st.maintenance_service_type === responsibilityName
      );
      if (serviceType) return serviceType.id;
    }
    
    return null;
  };

  // Helper function to find service type name by service type ID
  const findServiceTypeName = (serviceTypeId: string | number): string | null => {
    const serviceType = serviceTypesData?.data?.find((st: ServiceTypeApiResponse) => st.id === Number(serviceTypeId));
    return serviceType?.maintenance_service_type ?? null;
  };

  // Helper function to convert status_id to status string (for display)
  const getStatusString = (statusId: number): string => {
    const status = statusData?.data?.find((s: any) => s.status_id === statusId);
    return status?.status_name ?? (statusId === NUMBERMAP.ONE ? "Active" : "Inactive");
  };

  // Reset form and fetch draft when maintenanceId changes
  useEffect(() => {
    setInternalFormData({
      infrastructureCategory: FORM_DEFAULT_VALUES.INFRASTRUCTURE_CATEGORY,
      infrastructureType: FORM_DEFAULT_VALUES.INFRASTRUCTURE_TYPE,
      status_id: null,
    });
    setSelectedSkills([]);
    setToolsRows([]);
    setEquipmentRows([]);
    setMaintenancePlanRows([]);
    setErrors(INITIAL_ERROR_STATE);
    if (isAddMode) {
      fetchDraft();
    }
  }, [maintenanceId, isAddMode, fetchDraft]);

  const setInfrastructureCategory = (value: string) => {
    if (onInfrastructureCategoryChange) {
      onInfrastructureCategoryChange(value);
    } else {
      setInternalFormData(prev => ({ ...prev, infrastructureCategory: value }));
    }
  };

  const setInfrastructureType = (value: string) => {
    if (onInfrastructureTypeChange) {
      onInfrastructureTypeChange(value);
    } else {
      setInternalFormData(prev => ({ ...prev, infrastructureType: value }));
    }
  };

  const loadArrayData = (value: any[], setter: (value: any[]) => void) => {
    if (Array.isArray(value) && value.length > NUMBERMAP.ZERO) {
      setter(value);
    }
  };

  const loadDraftData = (data: any) => {
    if (data.infrastructureCategory) {
      setInfrastructureCategory(data.infrastructureCategory);
    }
    if (data.infrastructureType) {
      setInfrastructureType(data.infrastructureType);
    }
    if (data.status_id) {
      setInternalFormData(prev => ({ ...prev, status_id: data.status_id }));
    }
    loadArrayData(data.selectedSkills, setSelectedSkills);
    loadArrayData(data.toolsRows, setToolsRows);
    loadArrayData(data.equipmentRows, setEquipmentRows);
    loadArrayData(data.maintenancePlanRows, setMaintenancePlanRows);
  }

  // Update form data when API data is loaded (for edit mode)
  useEffect(() => {
    if (isAddMode || initialData) {
      initialDraftLoading.current = false;
    }
  }, [initialData, isAddMode]);

  // Load draft data
  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data);
      initialDraftLoading.current = false;
    }
  }, [draftData]);

  const updateTables = (initialData) => {
          // Populate tools
          if (initialData.tools && initialData.tools.length > NUMBERMAP.ZERO) {
            const tools = initialData.tools.map((tool, index) => {
              const toolName = findToolName(tool.tool_id) || tool.tool_name;
              const statusString = getStatusString(tool.status_id);
              return {
                id: (index + NUMBERMAP.ONE).toString(),
                serialNo: (index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, "0"),
                toolType: toolName,
                status: statusString,
                toolId: tool.maintenance_plan_tool_id, // Store database ID for updates
              };
            });
            setToolsRows(tools);
          }
    
          // Populate equipment
          if (initialData.equipment_required && initialData.equipment_required.length > NUMBERMAP.ZERO) {
            const equipment = initialData.equipment_required.map((equip, index) => {
              const equipmentName = findEquipmentName(equip.equipment_id) || equip.equipment_name;
              const statusString = getStatusString(equip.status_id);
              return {
                id: (index + NUMBERMAP.ONE).toString(),
                serialNo: (index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, "0"),
                equipmentType: equipmentName,
                status: statusString,
                equipmentId: equip.maintenance_plan_equipment_id, // Store database ID for updates
              };
            });
            setEquipmentRows(equipment);
          }
    
          // Populate maintenance plan details
          if (initialData.maintenance_plan && initialData.maintenance_plan.length > NUMBERMAP.ZERO) {
            const maintenancePlans = initialData.maintenance_plan.map((plan, index) => {
              const serviceTypeName = findServiceTypeName(plan.maintenance_service_type_id) || plan.maintenance_service_type;
              const frequencyName = findFrequencyName(plan.frequency_id) || plan.frequency_name;
              const statusString = getStatusString(plan.status_id);
              return {
                id: (index + NUMBERMAP.ONE).toString(),
                serialNo: (index + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, "0"),
                maintenanceDescription: plan.maintenance_description,
                toBeDoneBy: serviceTypeName,
                frequency: frequencyName,
                status: statusString,
                maintenancePlanId: plan.maintenance_plan_detail_id, // Store database ID for updates
              };
            });
            setMaintenancePlanRows(maintenancePlans);
          }
  }
  // Populate form data from initialData when in edit mode
  useEffect(() => {
    if (initialData && TOOL_OPTIONS?.data && EQUIPMENT_OPTIONS?.data && serviceTypesData?.data && frequencyData?.data && !initialData?.type) {
      // Set status - use status_id directly
      setInternalFormData(prev => ({
        ...prev,
        status_id: initialData.status_id,
      }));

      // Populate skill sets
      if (initialData.skill_set_required && initialData.skill_set_required.length > NUMBERMAP.ZERO) {
        const skillIds = initialData.skill_set_required.map(skill => skill.skill_id);
        setSelectedSkills(skillIds);
      }

      updateTables(initialData);
    }else if(initialData?.type){
      setSelectedSkills(initialData?.selectedSkills??[])
      setMaintenancePlanRows(initialData?.maintenancePlanRows??[]);
      setEquipmentRows(initialData?.equipmentRows ?? [])
      setToolsRows(initialData?.toolsRows)
      setInternalFormData(prev => ({
        ...prev,
        status_id: initialData.status_id,
      }));
    }
  }, [initialData, TOOL_OPTIONS, EQUIPMENT_OPTIONS, serviceTypesData, frequencyData]);

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Clear draft on successful save
    clearDraftSave();

    // Validate and map tools to API format
    const tools = toolsRows.map((tool): ToolPayload => {
      const toolId = findToolId(tool.toolType);
      // Find status_id from status name
      const statusId = statusData?.data?.find((s: any) => s.status_name === tool.status)?.status_id ?? NUMBERMAP.ONE;
      const toolPayload: ToolPayload = {
        tool_type_id: toolId,
        tool_status: statusId,
      };
      
      // Include tool_id only for updates (when toolId exists)
      if (tool.toolId) {
        toolPayload.tool_id = tool.toolId;
      }
      
      return toolPayload;
    });

    // Validate and map equipment to API format
    const equipment = equipmentRows.map((equip): EquipmentPayload => {
      const equipmentId = findEquipmentId(equip.equipmentType);
      // Find status_id from status name
      const statusId = statusData?.data?.find((s: any) => s.status_name === equip.status)?.status_id ?? NUMBERMAP.ONE;
      const equipmentPayload: EquipmentPayload = {
        equipment_type_id: equipmentId,
        equipment_status: statusId,
      };
      
      // Include equipment_id only for updates (when equipmentId exists)
      if (equip.equipmentId) {
        equipmentPayload.equipment_id = equip.equipmentId;
      }
      
      return equipmentPayload;
    });

    // Validate and map maintenance plan to API format
    const maintenancePlan = maintenancePlanRows.map((plan): MaintenancePlanPayload => {
      const frequencyId = findFrequencyId(plan.frequency);
      const serviceTypeId = findServiceTypeId(plan.toBeDoneBy);
      // Find status_id from status name
      const statusId = statusData?.data?.find((s: any) => s.status_name === plan.status)?.status_id ?? NUMBERMAP.ONE;
      const planPayload: MaintenancePlanPayload = {
        maintenance_description: plan.maintenanceDescription,
        to_be_done: serviceTypeId,
        frequency: frequencyId,
        maintenance_status: statusId,
      };
      
      // Include maintenance_plan_id only for updates (when maintenancePlanId exists)
      if (plan.maintenancePlanId) {
        planPayload.maintenance_plan_id = plan.maintenancePlanId;
      }
      
      return planPayload;
    });

    // Map skill set to numbers
    const skillSetRequired = selectedSkills.map((skill) => {
      if (typeof skill === 'number') return skill;
      const skillId = parseInt(skill.toString());
      return isNaN(skillId) ? null : skillId;
    }).filter((id): id is number => id !== null);

    // Parse infrastructure category and type
    const infraCategoryId = parseInt(currentCategoryValue);
    const infraTypeId = parseInt(currentTypeValue);

    // Prepare API payload
    const payload: MaintenancePlanPostPayload = {
      infra_category_id: infraCategoryId,
      infra_type: infraTypeId,
      status: internalFormData.status_id ?? NUMBERMAP.ONE,
      skill_set_required: skillSetRequired,
      tools: tools,
      equipment_required: equipment,
      maintenance_plan: maintenancePlan,
    };

    // Add maintenance_id only for update
    if (maintenanceId) {
      payload.maintenance_id = parseInt(maintenanceId.toString());
    }

    // Call API
    postMaintenancePlan(payload, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
        router.push(MAINTENANCE_PLAN_LIST_PATH);
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      },
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(MAINTENANCE_PLAN_LIST_PATH);
  };

  const getStatusValue = (status: string) => {
    // Use STATUS_VALUE to match list page behavior (Active -> 1, Inactive -> 0)
    return STATUS_VALUE[status as keyof typeof STATUS_VALUE] ?? NUMBERMAP.ZERO;
  };

  const toolsColumns: GridColDef[] = [
    { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
    { field: FORM_FIELDS.TOOL_TYPE, headerName: FORM_HEADERS.TOOL_TYPE, flex: NUMBERMAP.TWO },
    {
      field: FORM_FIELDS.STATUS,
      headerName: FORM_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <StatusTypography value={getStatusValue(params.value as string)} />
      ),
    },
    {
      field: FORM_FIELDS.ACTIONS,
      headerName: FORM_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton 
          onEdit={() => handleEdit(params.row, ENTITY_TYPES.TOOL)} 
          onDelete={() => handleDelete(params.id.toString(), ENTITY_TYPES.TOOL)} 
          deleteDisabled={!getStatusValue(params.row.status as string)}
        />
      ),
    },
  ];

  const equipmentColumns: GridColDef[] = [
    { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
    { field: FORM_FIELDS.EQUIPMENT_TYPE, headerName: FORM_HEADERS.EQUIPMENT_TYPE, flex: NUMBERMAP.TWO },
    {
      field: FORM_FIELDS.STATUS,
      headerName: FORM_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <StatusTypography value={getStatusValue(params.value as string)} />
      ),
    },
    {
      field: FORM_FIELDS.ACTIONS,
      headerName: FORM_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton 
          onEdit={() => handleEdit(params.row, ENTITY_TYPES.EQUIPMENT)} 
          onDelete={() => handleDelete(params.id.toString(), ENTITY_TYPES.EQUIPMENT)} 
          deleteDisabled={!getStatusValue(params.row.status as string)}
        />
      ),
    },
  ];

  const maintenancePlanColumns: GridColDef[] = [
    { field: FORM_FIELDS.SERIAL_NO, headerName: FORM_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE },
    { field: FORM_FIELDS.MAINTENANCE_DESCRIPTION, headerName: FORM_HEADERS.MAINTENANCE_DESCRIPTION, flex: NUMBERMAP.THREE, tooltip: true, 
      renderCell: (params) => (
           stripHtml(params?.value ?? '' as string)
      ),
    },
    { field: FORM_FIELDS.TO_BE_DONE_BY, headerName: FORM_HEADERS.TO_BE_DONE_BY, flex: NUMBERMAP.TWO },
    { field: FORM_FIELDS.FREQUENCY, headerName: FORM_HEADERS.FREQUENCY, flex: NUMBERMAP.TWO },
    {
      field: FORM_FIELDS.STATUS,
      headerName: FORM_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <StatusTypography value={getStatusValue(params.value as string)} />
      ),
    },
    {
      field: FORM_FIELDS.ACTIONS,
      headerName: FORM_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton 
          onEdit={() => handleEdit(params.row, ENTITY_TYPES.MAINTENANCE_PLAN)} 
          onDelete={() => handleDelete(params.id.toString(), ENTITY_TYPES.MAINTENANCE_PLAN)} 
          deleteDisabled={!getStatusValue(params.row.status as string)}
        />
      ),
    },
  ];

  const buttonConfig = [
    { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleCancel },
    { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave, loading: isSaving }
  ];

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isSaving ?? isFetchingDraft} />
      <FormWrapper>
        <Label title={maintenanceId ? FORM_TITLES.EDIT_MAINTENANCE_PLAN : FORM_TITLES.ADD_MAINTENANCE_PLAN} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_CATEGORY}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_CATEGORY}
                isDropdown
                value={currentCategoryValue}
                onChange={(value: string) => {
                  const updatedFormData = {
                    infrastructureCategory: value,
                    infrastructureType: currentTypeValue,
                    status_id: internalFormData.status_id,
                  };
                  if (onInfrastructureCategoryChange) {
                    onInfrastructureCategoryChange(value);
                  } else {
                    setInternalFormData(prev => ({ ...prev, infrastructureCategory: value }));
                  }
                  setErrors((prev) => ({ ...prev, infrastructureCategory: "" }));
                  if (!initialDraftLoading.current) {
                    handleDraftSave(updatedFormData);
                  }
                }}
                options={infrastructureCategoryData?.data ?? []}
                keyField={FORM_KEY_FIELDS.INFRASTRUCTURE_CATEGORY_ID}
                valueField={FORM_VALUE_FIELDS.INFRASTRUCTURE_CATEGORY_NAME}
                error={errors.infrastructureCategory}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_TYPE}
                placeholder={FORM_PLACEHOLDERS.SELECT_INFRASTRUCTURE_TYPE}
                isDropdown
                value={currentTypeValue}
                onChange={(value: string) => {
                  const updatedFormData = {
                    infrastructureCategory: currentCategoryValue,
                    infrastructureType: value,
                    status_id: internalFormData.status_id,
                  };
                  if (onInfrastructureTypeChange) {
                    onInfrastructureTypeChange(value);
                  } else {
                    setInternalFormData(prev => ({ ...prev, infrastructureType: value }));
                  }
                  setErrors((prev) => ({ ...prev, infrastructureType: "" }));
                  if (!initialDraftLoading.current) {
                    handleDraftSave(updatedFormData);
                  }
                }}
                options={infrastructureTypeData?.data ?? []}
                keyField={FORM_KEY_FIELDS.INFRASTRUCTURE_TYPE_ID}
                valueField={FORM_VALUE_FIELDS.INFRASTRUCTURE_TYPE_NAME}
                error={errors.infrastructureType}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.SELECT_STATUS}
                isDropdown
                value={internalFormData.status_id?.toString() ?? null}
                onChange={(value: any) => {
                  const updatedFormData = {
                    infrastructureCategory: currentCategoryValue,
                    infrastructureType: currentTypeValue,
                    status_id: Number(value),
                  };
                  setInternalFormData(prev => ({ ...prev, status_id: Number(value) }));
                  setErrors((prev) => ({ ...prev, status: "" }));
                  if (!initialDraftLoading.current) {
                    handleDraftSave(updatedFormData);
                  }
                }}
                options={statusData?.data}
                keyField={FORM_KEY_FIELDS.STATUS_ID}
                valueField={FORM_VALUE_FIELDS.STATUS_NAME}
                error={errors.status}
              />
            </Grid2>
          </Grid2>
          {/* Tools Section */}
          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <DataGridTable
              showAddButton
              onAddRow={() => {
                setEditingToolId(null);
                setToolsModal(true);
              }}
              columns={toolsColumns}
              rows={toolsRows}
              idField={FORM_ID_FIELD}
              hideFooter
              title={FORM_TITLES.TOOLS_REQUIRED}
            />
            {errors.toolsRequired && (
              <Typography
                sx={errorTextSx}
              >
                {errors.toolsRequired}
              </Typography>
            )}
          </Grid2>
          {/* Equipment Section */}
          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <DataGridTable
              showAddButton
              onAddRow={() => {
                setEditingEquipmentId(null);
                setEquipmentModal(true);
              }}
              columns={equipmentColumns}
              rows={equipmentRows}
              idField={FORM_ID_FIELD}
              hideFooter
              title={FORM_TITLES.EQUIPMENT_REQUIRED}
            />
            {errors.equipmentRequired && (
              <Typography
                sx={errorTextSx}
              >
                {errors.equipmentRequired}
              </Typography>
            )}
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.SIX, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={FORM_LABELS.SKILL_SET_REQUIRED}
                options={skillSetData?.data ?? []}
                idField={FORM_KEY_FIELDS.SKILL_ID}
                valueField={FORM_VALUE_FIELDS.SKILL_NAME}
                value={selectedSkills}
                onChange={(value) => {
                  const updatedFormData = {
                    infrastructureCategory: currentCategoryValue,
                    infrastructureType: currentTypeValue,
                    status_id: internalFormData.status_id,
                  };
                  setSelectedSkills(value);
                  if (!initialDraftLoading.current) {
                    handleDraftSave(updatedFormData, undefined, undefined, undefined, value);
                  }
                  setErrors((prev) => ({ ...prev, skillSetRequired: "" }));
                }}
                placeholder={FORM_PLACEHOLDERS.SELECT_SKILLS}
                error={errors.skillSetRequired}
              />
            </Grid2>
          </Grid2>

          {/* Maintainance Plan */}
          <Grid2 size={NUMBERMAP.TWELVE} sx={STYLE5}>
            <DataGridTable
              showAddButton
              onAddRow={() => {
                setEditingMaintenancePlanId(null);
                setMaintenancePlanModal(true);
              }}
              columns={maintenancePlanColumns}
              rows={maintenancePlanRows}
              idField={FORM_ID_FIELD}
              hideFooter
              title={FORM_TITLES.MAINTENANCE_PLAN}
            />
            {errors.maintenancePlan && (
              <Typography
                sx={errorTextSx}
              >
                {errors.maintenancePlan}
              </Typography>
            )}
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
        onClose={() => {
          setToolsModal(false);
          setEditingToolId(null);
        }}
      >
        <ToolsModal
          key={`tool-${editingToolId ?? 'new'}-${toolsModal}`}
          onClose={() => {
            setToolsModal(false);
            setEditingToolId(null);
          }}
          onCancel={() => {
            setToolsModal(false);
            setEditingToolId(null);
          }}
          onSave={handleToolSave}
          initialData={
            editingToolId
              ? (() => {
                  const row = toolsRows.find((row) => row.id === editingToolId);
                  if (!row) return undefined;
                  // Convert tool name back to tool ID for the modal
                  const toolId = findToolId(row.toolType);
                  // Convert status name back to status_id for the modal
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    toolType: toolId?.toString() || row.toolType,
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
        onClose={() => {
          setEquipmentModal(false);
          setEditingEquipmentId(null);
        }}
      >
        <EquipmentModal
          key={`equipment-${editingEquipmentId ?? 'new'}-${equipmentModal}`}
          onClose={() => {
            setEquipmentModal(false);
            setEditingEquipmentId(null);
          }}
          onCancel={() => {
            setEquipmentModal(false);
            setEditingEquipmentId(null);
          }}
          onSave={handleEquipmentSave}
          initialData={
            editingEquipmentId
              ? (() => {
                  const row = equipmentRows.find((row) => row.id === editingEquipmentId);
                  if (!row) return undefined;
                  // Convert equipment name back to equipment ID for the modal
                  const equipmentId = findEquipmentId(row.equipmentType);
                  // Convert status name back to status_id for the modal
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    equipmentType: equipmentId?.toString() || row.equipmentType,
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
        onClose={() => {
          setMaintenancePlanModal(false);
          setEditingMaintenancePlanId(null);
        }}
      >
        <MaintenancePlanModal
          key={`maintenance-${editingMaintenancePlanId ?? 'new'}-${maintenancePlanModal}`}
          onClose={() => {
            setMaintenancePlanModal(false);
            setEditingMaintenancePlanId(null);
          }}
          onCancel={() => {
            setMaintenancePlanModal(false);
            setEditingMaintenancePlanId(null);
          }}
          onSave={handleMaintenancePlanSave}
          initialData={
            editingMaintenancePlanId
              ? (() => {
                  const row = maintenancePlanRows.find((row) => row.id === editingMaintenancePlanId);
                  if (!row) return undefined;
                  // Convert service type name back to service type ID for the modal
                  const serviceTypeId = findServiceTypeId(row.toBeDoneBy);
                  // Convert frequency name back to frequency ID for the modal
                  const frequencyId = findFrequencyId(row.frequency);
                  // Convert status name back to status_id for the modal
                  const statusId = statusData?.data?.find((s: any) => s.status_name === row.status)?.status_id ?? row.status;
                  return {
                    ...row,
                    toBeDoneBy: serviceTypeId?.toString() || row.toBeDoneBy,
                    frequency: frequencyId?.toString() || row.frequency,
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

export default MaintenancePlan;