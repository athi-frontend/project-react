'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Grid2, Box, Button, List, ListItem, TextField } from '@mui/material'
import {
  RichTextEditor,
  InputField,
  DataGridTable,
  ButtonGroup,
  Label,
  ActionButton,
  showActionAlert,
} from '@/components/ui'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'
import { InputLabel } from '@/styles/components/ui/input'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import AddIcon from '@mui/icons-material/Add'
import { ICON_SIZE } from '@/styles/common'
import { BoxContainer } from '@/styles/modules/regulation/executiveSummary'
import { ButtonContainer } from '@/styles/components/ui/button'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
const { DELETE_ALERT } = COMMON_CONSTANTS
import AnnexureDropdown from '@/components/modules/regulation/annexure-dropdown/AnnexureDropdown'
/**
    Classification : Confidential
**/

import {
  DEVICE_DESCRIPTION_INFO_TEXT,
  DEVICE_DESCRIPTION_LABELS,
  DEVICE_DESCRIPTION_COLUMNS,
  DEVICE_DESCRIPTION_MODAL,
  DEVICE_DESCRIPTION_BUTTONS,
  DEVICE_DESCRIPTION_PLACEHOLDERS,
  DEVICE_DESCRIPTION_FIELDS,
  INPUT_TEXT,
  DIRECT_CONTACT,
  INDIRECT_CONTACT,
} from '@/constants/modules/regulation/deviceDescription'
import MaterialsBodyModal from '@/components/modules/regulation/device-description/MaterialsBodyModal'
import { useParams } from 'next/navigation'
import {
  useDeviceDescriptionQuery,
  useSaveDeviceDescription,
  useSpecificationAspectsQuery,
} from '@/hooks/modules/regulation/useDeviceDescription'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import type { 
  ModalState, 
  MaterialItem, 
  PredicateDeviceItem, 
  SpecificationAspect, 
  PredicateRow, 
  MaterialRow, 
  DeviceDescriptionFormData, 
  DeviceDescriptionPayload,
  MaterialsBodyFormData,
} from '@/types/modules/regulation/deviceDescriptionTypes'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { DeviceDescriptionListSx } from '@/styles/modules/regulation/deviceDescription'
import SubHeader from '@/components/modules/regulation/executive-summary/SubHeader'
import { ANNEXURE_LIST } from '@/constants/modules/regulation/annexure'

type SaveType = 'draft' | 'final';

// Helper functions for manipulating materials and predicate device data
const getContactField = (type: 'contact' | 'noncontact') => {
  return type === 'contact' ? DIRECT_CONTACT : INDIRECT_CONTACT
}

const createNewMaterialItem = (mappedItem: Omit<MaterialItem, 'id'>): MaterialItem => ({
  ...mappedItem,
  id: Date.now().toString(),
})

const updateMaterialInArray = (array: MaterialItem[], editIndex: number, mappedItem: Omit<MaterialItem, 'id'>): MaterialItem[] => {
  return array.map((m: MaterialItem, i: number) =>
    i === editIndex ? { ...mappedItem, id: m.id } : m
  )
}

const findPredicateDeviceIndex = (predicate_device: PredicateDeviceItem[], aspectId: number): number => {
  return predicate_device.findIndex(
    (p: PredicateDeviceItem) =>
      (p.product_specification_aspects_id ??
        p.specification_aspects_id) === aspectId
  )
}

const updatePredicateDevice = (predicate_device: PredicateDeviceItem[], idx: number, aspectId: number, value: string): PredicateDeviceItem[] => {
  if (idx !== -1) {
    predicate_device[idx] = {
      ...predicate_device[idx],
      specification_aspects_id: aspectId,
      predicate_device_company: value,
    }
  } else {
    predicate_device.push({
      specification_aspects_id: aspectId,
      predicate_device_company: value,
    })
  }
  return predicate_device
}

const findPredicateDevice = (predicate_device: PredicateDeviceItem[] | undefined, aspectId: number): PredicateDeviceItem | undefined => {
  if (!Array.isArray(predicate_device)) return undefined
  return predicate_device.find(
    (p: PredicateDeviceItem) =>
      (p.product_specification_aspects_id ??
        p.specification_aspects_id) === aspectId
  )
}

const createPredicateRow = (aspect: SpecificationAspect, found: PredicateDeviceItem | undefined): PredicateRow => ({
  id: aspect.id,
  serialNo: aspect.sectionNo,
  aspects: aspect.aspects ?? '',
  predicateDeviceCompany: found?.predicate_device_company ?? '',
})

const createMaterialRow = (item: MaterialItem, idx: number, type: 'contact' | 'noncontact'): MaterialRow => ({
  ...item,
  id: item.id ?? `${Date.now()}_${idx}`,
  idx,
  type,
})

const cleanContactData = (contactArray: MaterialItem[] | undefined): Omit<MaterialItem, 'id'>[] => {
  return (contactArray ?? []).map(
    ({ part_name, material }: MaterialItem) => ({ part_name, material })
  )
}

const cleanPredicateData = (predicateArray: PredicateDeviceItem[] | undefined): Omit<PredicateDeviceItem, 'product_specification_aspects_id'>[] => {
  return (predicateArray ?? []).map((item: PredicateDeviceItem) => ({
    specification_aspects_id:
      item.specification_aspects_id ??
      item.product_specification_aspects_id,
    predicate_device_company: item.predicate_device_company,
  }))
}

// DeviceSpecificationForm: Main component for device description/specification form
// Handles display, editing, and saving of device description data for a project
const DeviceSpecificationForm: React.FC = () => {
  // Destructure label and field constants for easier reference
  const {
    PAGE_TITLE,
    DOSSIER_SUBHEADER,
    GENERAL_DESCRIPTION,
    GENERIC_NAME,
    MODEL_NAME_VARIANTS,
    MODEL_NO,
    MATERIALS_OF_CONSTRUCTION,
    INTENDED_USE,
    INDICATIONS,
    INSTRUCTIONS_FOR_USE,
    CONTRAINDICATIONS,
    WARNINGS_PRECAUTIONS,
    POTENTIAL_ADVERSE_EFFECTS,
    INTENDED_PATIENT_POPULATION,
    ACCESSORIES_DESCRIPTION,
    EXPLANATION_NOVEL_FEATURES,
    PRINCIPLE_OF_OPERATION,
    GENERAL_DESCRIPTION_KEY_ELEMENTS,
    VARIOUS_CONFIGURATIONS,
    MATERIALS_SECTION,
    MATERIALS_CONTACT,
    MATERIALS_NONCONTACT,
    MEDICAL_DEVICES_IONIZING_RADIATION,
    PRODUCT_SPECIFICATION,
    PRODUCT_SPECIFICATIONS,
    REFERENCE_PREDICATE,
    PREVIOUS_GENERATION_DEVICE,
    PREDICATE_DEVICES_MARKETS,
    COMPARATIVE_ANALYSIS,
    COMPANY_NAME,
    ADD_NEW,
  } = DEVICE_DESCRIPTION_LABELS
  const {
    GENERIC_NAME: FN_GENERIC_NAME,
    MODEL_NAME_VARIANTS: FN_MODEL_NAME_VARIANTS,
    MODEL_NO: FN_MODEL_NO,
    MATERIALS_OF_CONSTRUCTION: FN_MATERIALS_OF_CONSTRUCTION,
    INTENDED_USE: FN_INTENDED_USE,
    INDICATIONS: FN_INDICATIONS,
    INSTRUCTIONS_FOR_USE: FN_INSTRUCTIONS_FOR_USE,
    CONTRAINDICATIONS: FN_CONTRAINDICATIONS,
    WARNINGS_PRECAUTIONS: FN_WARNINGS_PRECAUTIONS,
    POTENTIAL_ADVERSE_EFFECTS: FN_POTENTIAL_ADVERSE_EFFECTS,
    INTENDED_PATIENT_POPULATION: FN_INTENDED_PATIENT_POPULATION,
    ACCESSORIES_DESCRIPTION: FN_ACCESSORIES_DESCRIPTION,
    EXPLANATION_NOVEL_FEATURES: FN_EXPLANATION_NOVEL_FEATURES,
    PRINCIPLE_OF_OPERATION: FN_PRINCIPLE_OF_OPERATION,
    GENERAL_DESCRIPTION_KEY_ELEMENTS: FN_GENERAL_DESCRIPTION_KEY_ELEMENTS,
    VARIOUS_CONFIGURATIONS: FN_VARIOUS_CONFIGURATIONS,
    MEDICAL_DEVICES_IONIZING_RADIATION: FN_MEDICAL_DEVICES_IONIZING_RADIATION,
    PRODUCT_SPECIFICATIONS: FN_PRODUCT_SPECIFICATIONS,
    PREVIOUS_GENERATION_DEVICE: FN_PREVIOUS_GENERATION_DEVICE,
    PREDICATE_DEVICES_MARKETS: FN_PREDICATE_DEVICES_MARKETS,
    COMPARATIVE_ANALYSIS: FN_COMPARATIVE_ANALYSIS,
    COMPANY_NAME: FN_COMPANY_NAME,
  } = DEVICE_DESCRIPTION_FIELDS

  const { PH_MEDICAL_DEVICES_IONIZING_RADIATION, PH_PREDICATE_DEVICE_COMPANY } =
    DEVICE_DESCRIPTION_PLACEHOLDERS

  // Get project ID from route params
  const params = useParams()
  const projectID = Number(params.id)
  // Fetch device description data for the project
  const { data: deviceDescriptionData, refetch: refetchDeviceDescription } = useDeviceDescriptionQuery(projectID, false)
  // Mutation for saving device description
  const saveMutation = useSaveDeviceDescription()
  // Fetch list of specification aspects for predicate device table
  const { data: aspectsData } = useSpecificationAspectsQuery()
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave()
  // Local state for form data (mirrors API data, allows local edits)
  const [localFormData, setLocalFormData] = useState<DeviceDescriptionFormData | null>(null)
  const isInitialDataLoad = useRef(true)

  // State for modal (add/edit material)
  const [modalState, setModalState] = useState<ModalState>({
    ...DEVICE_DESCRIPTION_MODAL.DEFAULT_STATE,
    item: undefined,
  } as ModalState)

  // Trigger API call on component mount
  useEffect(() => {
    refetchDeviceDescription();
  }, [refetchDeviceDescription]);

  // Effect: Update form data when API data changes
  useEffect(() => {
    if (deviceDescriptionData?.data) {
      if (deviceDescriptionData?.data[NUMBERMAP.ZERO]) {
        setLocalFormData(deviceDescriptionData.data[NUMBERMAP.ZERO]);
      }
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [deviceDescriptionData])

  // Handles changes to any form field (updates local state)
  const handleFieldChange = (field: string, value: string | string[]) => {
    setLocalFormData((prev: DeviceDescriptionFormData | null) => {
      const updated = prev ? { ...prev, [field]: value } : null
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    })
  }

  // Opens the modal for adding a new material (contact or noncontact)
  const handleAddMaterial = (type: 'contact' | 'noncontact') => {
    setModalState({
      open: true,
      type,
      mode: DEVICE_DESCRIPTION_MODAL.MODE.ADD,
      editIndex: null,
      item: { part_name: '', material: '' },
    })
  }

  // Opens the modal for editing an existing material
  const handleEditMaterial = (
    type: 'contact' | 'noncontact',
    idx: number,
    item: MaterialItem
  ) => {
    setModalState({
      open: true,
      type,
      mode: DEVICE_DESCRIPTION_MODAL.MODE.EDIT,
      editIndex: idx,
      item: {
        part_name: item.part_name ?? '',
        material: item.material ?? '',
      },
    })
  }

  // Closes the modal and resets modal state
  const handleCloseModal = () => {
    setModalState({
      ...DEVICE_DESCRIPTION_MODAL.DEFAULT_STATE,
      item: undefined,
    })
  }

  // Saves a material (add or edit) from the modal
  const handleSaveMaterial = (item: MaterialsBodyFormData) => {
    if (!modalState.type ) return

    const contactField = getContactField(modalState.type)

    if (modalState.mode === DEVICE_DESCRIPTION_MODAL.MODE.ADD) {
      const newItem = createNewMaterialItem(item as MaterialItem)
      setLocalFormData((prev: DeviceDescriptionFormData | null) => {
        const updated = prev ? ({
          ...prev,
          [contactField]: [
            ...(prev[contactField as keyof DeviceDescriptionFormData] as MaterialItem[] ?? []),
            newItem,
          ],
        }) : null
        handleSave('draft', updated)
        return updated
      })
    } else if (
      modalState.mode === DEVICE_DESCRIPTION_MODAL.MODE.EDIT &&
      modalState.editIndex !== null
    ) {
      const editIndex = modalState.editIndex
      setLocalFormData((prev: DeviceDescriptionFormData | null) => {
        const updated = prev ? ({
          ...prev,
          [contactField]: updateMaterialInArray(
            prev[contactField as keyof DeviceDescriptionFormData] as MaterialItem[],
            editIndex,
            item as MaterialItem
          ),
        }) : null
        handleSave('draft', updated)
        return updated
      })
    }
    handleCloseModal()
  }

  // Handles deletion of a material (with confirmation)
  const handleConfirmDelete = (
    type: 'contact' | 'noncontact',
    idx: number,
    setLocalFormData: React.Dispatch<React.SetStateAction<DeviceDescriptionFormData | null>>
  ) => {
    const contactField = getContactField(type);
    setLocalFormData((prev: DeviceDescriptionFormData | null) => {
      const updated = prev
        ? {
            ...prev,
            [contactField]: (prev[contactField as keyof DeviceDescriptionFormData] as MaterialItem[]).filter(
              (_: MaterialItem, i: number) => i !== idx
            ),
          }
        : null
      handleSave('draft', updated)
      return updated
    });
  };

  const handleDeleteMaterial = (
    type: 'contact' | 'noncontact',
    idx: number
  ) => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        handleConfirmDelete(type, idx, setLocalFormData);
      }
    });
  }

  // Handles changes to predicate device company fields in the grid
  const handlePredicateCompanyChange = (aspectId: number, value: string) => {
    setLocalFormData((prev: DeviceDescriptionFormData | null) => {
      if (!prev) return null
      let predicate_device = prev.predicate_device ? [...prev.predicate_device] : []
      const idx = findPredicateDeviceIndex(predicate_device, aspectId)
      predicate_device = updatePredicateDevice(predicate_device, idx, aspectId, value)
      const updated = {
        ...prev,
        predicate_device,
      }
      handleSave('draft', updated)
      return updated
    })
  }

  // Build rows for predicate device table from aspects and local form data
  const predicateRows = Array.isArray(aspectsData?.data)
    ? aspectsData.data.map((aspect: SpecificationAspect) => {
        const found = findPredicateDevice(localFormData?.predicate_device, aspect.id)
        return createPredicateRow(aspect, found)
      })
    : []

  // Define columns for materials table using constants and GridColDef type
  const materialColumns: GridColDef[] = [
    {
      field: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.SNO.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.SNO.HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.PART_NAME.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.PART_NAME.HEADER,
      flex: NUMBERMAP.TWO,
    },
    {
      field: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.MATERIAL.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.MATERIAL.HEADER,
      flex: NUMBERMAP.TWO,
    },
    {
      field: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.ACTIONS.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.MATERIALS.ACTIONS.HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton
          onEdit={() =>
            handleEditMaterial(params.row.type, params.row.idx, params.row)
          }
          onDelete={() => handleDeleteMaterial(params.row.type, params.row.idx)}
        />
      ),
    },
  ]

  // Define columns for predicate device table
  const predicateColumns: GridColDef[] = [
    {
      field: DEVICE_DESCRIPTION_COLUMNS.PREDICATE.SNO.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.PREDICATE.SNO.HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: DEVICE_DESCRIPTION_COLUMNS.PREDICATE.ASPECTS.FIELD,
      headerName: DEVICE_DESCRIPTION_COLUMNS.PREDICATE.ASPECTS.HEADER,
      flex: NUMBERMAP.THREE,
    },
    {
      field:
        DEVICE_DESCRIPTION_COLUMNS.PREDICATE.PREDICATE_DEVICE_COMPANY.FIELD,
      headerName:
        DEVICE_DESCRIPTION_COLUMNS.PREDICATE.PREDICATE_DEVICE_COMPANY.HEADER,
      flex: NUMBERMAP.TWO,
      renderCell: (params) => (
        <TextField
          fullWidth
          value={params.row.predicateDeviceCompany ?? ''}
          placeholder={PH_PREDICATE_DEVICE_COMPANY}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation()
            }
          }}
          onChange={(e) =>
            handlePredicateCompanyChange(params.row.id, e.target.value)
          }
        />
      ),
    },
  ]

  // Prepare rows for contact and non-contact materials tables
  const contactMaterialsRows = (localFormData?.direct_contact ?? []).map(
    (item: MaterialItem, idx: number) => createMaterialRow(item, idx, 'contact')
  )
  const nonContactMaterialsRows = (localFormData?.indirect_contact ?? []).map(
    (item: MaterialItem, idx: number) => createMaterialRow(item, idx, 'noncontact')
  )

  // Utility to clean the payload before saving (removes UI-only fields, formats arrays)
  function cleanPayload(data: DeviceDescriptionFormData | null, projectId: number): DeviceDescriptionPayload {
    if (!data) {
      return {
        project_id: projectId,
        predicate_device: [],
        direct_contact: [],
        indirect_contact: [],
      }
    }
    
    // Destructure and remove unwanted fields
    const {
      generic_name,
      intended_use,
      instruction_for_use,
      indication,
      model_name,
      model_number,
      status,
      company_name,
      ...rest
    } = data
    
    // Clean predicate_device
    const predicate_device = cleanPredicateData(rest.predicate_device)
    
    // Clean direct_contact and indirect_contact (remove id)
    const direct_contact = cleanContactData(rest.direct_contact)
    const indirect_contact = cleanContactData(rest.indirect_contact)
    
    return {
      ...rest,
      project_id: projectId,
      predicate_device,
      direct_contact,
      indirect_contact,
    }
  }

  // Draft/final save handler
  function handleSave(type: SaveType, nextData?: DeviceDescriptionFormData | null) {
    if (type === 'draft') {
      const payload = cleanPayload(nextData ?? localFormData, projectID)
      draftSave({
        project_id: Number(projectID),
        form_type: 'device_description',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    saveMutation.mutate(cleanPayload(nextData ?? localFormData, projectID))
  }

  // Button config for form actions (Cancel, Save)
  const buttonConfig = [
    {
      label: DEVICE_DESCRIPTION_BUTTONS.CANCEL,
      onClick: () => {
        /* implement cancel logic */
      },
    },
    {
      label: DEVICE_DESCRIPTION_BUTTONS.SAVE,
      onClick: () => handleSave('final'),
      loading: saveMutation.isPending,
    },
  ]

  // Helper to get model number as array (handles string or array input)
  const getModelNoItems = (): string[] => {
    const value = localFormData?.[FN_MODEL_NO]
    if (Array.isArray(value)) return value as string[]
    if (typeof value === 'string' && value.trim())
      return value.split(',').map((item) => item.trim())
    return []
  }

  // Helper function to render model number list as MUI List
  const renderModelNoList = () => (
    <List sx={DeviceDescriptionListSx} component="span">
      {getModelNoItems().map((item: string, idx: number) => (
        <ListItem key={`model-no-${item}-${idx}`}>{item}</ListItem>
      ))}
    </List>
  )

  // Helper function to render annexure dropdown (stubbed with static data)
  const renderAnnexureDropdown = () => (
    <Grid2 sx={STYLE5}>
      <AnnexureDropdown
        items={ANNEXURE_LIST}
      />
    </Grid2>
  )

  // Helper function to render add material button
  const renderAddMaterialButton = (type: 'contact' | 'noncontact') => (
    <Button
      variant="outlined"
      onClick={() => handleAddMaterial(type)}
    >
      <AddIcon sx={ICON_SIZE} />
      {ADD_NEW}
    </Button>
  )

  // Helper function to render materials section (table + add button)
  const renderMaterialsSection = (type: 'contact' | 'noncontact', title: string, rows: MaterialRow[]) => (
    <Grid2 size={NUMBERMAP.TWELVE}>
      <Box sx={BoxContainer}>
        <InputLabel>{title}</InputLabel>
        {renderAddMaterialButton(type)}
      </Box>
      <DataGridTable
        showAddButton
        rows={rows}
        columns={materialColumns}
        idField="id"
        hideFooter={true}
        checkboxSelection={false}
      />
    </Grid2>
  )

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={PAGE_TITLE} />
        <FormContent>
          <Grid2 sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={DOSSIER_SUBHEADER} />
            </Grid2>
          </Grid2>
          <Grid2 sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={GENERAL_DESCRIPTION} />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={GENERIC_NAME}
                label={GENERIC_NAME}
                value={(localFormData?.[FN_GENERIC_NAME] as string) ?? '-'}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={MODEL_NAME_VARIANTS}
                label={MODEL_NAME_VARIANTS}
                value={
                  Array.isArray(localFormData?.[FN_MODEL_NAME_VARIANTS])
                    ? (localFormData[FN_MODEL_NAME_VARIANTS] as string[]).join(', ')
                    : (localFormData?.[FN_MODEL_NAME_VARIANTS] as string) ?? '-'
                }
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={MODEL_NO}
                label={MODEL_NO}
                value={renderModelNoList()}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={MATERIALS_OF_CONSTRUCTION}
                value={(localFormData?.[FN_MATERIALS_OF_CONSTRUCTION] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_MATERIALS_OF_CONSTRUCTION, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={INTENDED_USE}
                label={INTENDED_USE}
                value={(localFormData?.[FN_INTENDED_USE] as string) ?? '-'}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={INDICATIONS}
                label={INDICATIONS}
                value={(localFormData?.[FN_INDICATIONS] as string) ?? '-'}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={INSTRUCTIONS_FOR_USE}
                label={INSTRUCTIONS_FOR_USE}
                value={(localFormData?.[FN_INSTRUCTIONS_FOR_USE] as string) ?? '-'}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={CONTRAINDICATIONS}
                value={(localFormData?.[FN_CONTRAINDICATIONS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_CONTRAINDICATIONS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={WARNINGS_PRECAUTIONS}
                value={(localFormData?.[FN_WARNINGS_PRECAUTIONS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_WARNINGS_PRECAUTIONS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={POTENTIAL_ADVERSE_EFFECTS}
                value={(localFormData?.[FN_POTENTIAL_ADVERSE_EFFECTS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_POTENTIAL_ADVERSE_EFFECTS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              {INTENDED_PATIENT_POPULATION}
              <RichTextEditor
                label=""
                value={(localFormData?.[FN_INTENDED_PATIENT_POPULATION] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_INTENDED_PATIENT_POPULATION, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              {ACCESSORIES_DESCRIPTION}
              <RichTextEditor
                label=""
                value={(localFormData?.[FN_ACCESSORIES_DESCRIPTION] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_ACCESSORIES_DESCRIPTION, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={EXPLANATION_NOVEL_FEATURES}
                value={(localFormData?.[FN_EXPLANATION_NOVEL_FEATURES] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_EXPLANATION_NOVEL_FEATURES, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRINCIPLE_OF_OPERATION}
                value={(localFormData?.[FN_PRINCIPLE_OF_OPERATION] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_PRINCIPLE_OF_OPERATION, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={GENERAL_DESCRIPTION_KEY_ELEMENTS}
                value={
                  (localFormData?.[FN_GENERAL_DESCRIPTION_KEY_ELEMENTS] as string) ?? ''
                }
                onChange={(value) =>
                  handleFieldChange(FN_GENERAL_DESCRIPTION_KEY_ELEMENTS, value)
                }
                placeholder={INPUT_TEXT}
                infoText={DEVICE_DESCRIPTION_INFO_TEXT.PRODUCT_SPECIFICATION}
              />
              {renderAnnexureDropdown()}
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={VARIOUS_CONFIGURATIONS}
                value={(localFormData?.[FN_VARIOUS_CONFIGURATIONS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_VARIOUS_CONFIGURATIONS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={MATERIALS_SECTION} />
            </Grid2>
            {renderMaterialsSection('contact', MATERIALS_CONTACT, contactMaterialsRows)}
            {renderMaterialsSection('noncontact', MATERIALS_NONCONTACT, nonContactMaterialsRows)}
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={MEDICAL_DEVICES_IONIZING_RADIATION}
                placeholder={PH_MEDICAL_DEVICES_IONIZING_RADIATION}
                value={
                  (localFormData?.[FN_MEDICAL_DEVICES_IONIZING_RADIATION] as string) ?? ''
                }
                onChange={(value: string) =>
                  handleFieldChange(
                    FN_MEDICAL_DEVICES_IONIZING_RADIATION,
                    value
                  )
                }
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={PRODUCT_SPECIFICATION} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PRODUCT_SPECIFICATIONS}
                value={(localFormData?.[FN_PRODUCT_SPECIFICATIONS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_PRODUCT_SPECIFICATIONS, value)
                }
                placeholder={INPUT_TEXT}
                infoText={DEVICE_DESCRIPTION_INFO_TEXT.PRODUCT_SPECIFICATION}
              />
              {renderAnnexureDropdown()}
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={REFERENCE_PREDICATE} />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREVIOUS_GENERATION_DEVICE}
                value={(localFormData?.[FN_PREVIOUS_GENERATION_DEVICE] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_PREVIOUS_GENERATION_DEVICE, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PREDICATE_DEVICES_MARKETS}
                value={(localFormData?.[FN_PREDICATE_DEVICES_MARKETS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_PREDICATE_DEVICES_MARKETS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={COMPARATIVE_ANALYSIS}
                value={(localFormData?.[FN_COMPARATIVE_ANALYSIS] as string) ?? ''}
                onChange={(value) =>
                  handleFieldChange(FN_COMPARATIVE_ANALYSIS, value)
                }
                placeholder={INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InfoField
                key={COMPANY_NAME}
                label={COMPANY_NAME}
                value={(localFormData?.[FN_COMPANY_NAME] as string) || '-'}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <DataGridTable
                showAddButton
                rows={predicateRows}
                columns={predicateColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <ButtonContainer sx={STYLE5}>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
      {/* Modals for add/edit materials */}
      <MaterialsBodyModal
        open={modalState.open}
        onClose={handleCloseModal}
        onSave={handleSaveMaterial}
        defaultValues={modalState.item}
        title={
          modalState.type === 'contact'
            ? MATERIALS_CONTACT
            : MATERIALS_NONCONTACT
        }
      />
    </FormContainer>
  )
}

export default DeviceSpecificationForm
