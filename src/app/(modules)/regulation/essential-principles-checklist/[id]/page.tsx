'use client'
import React, { useEffect, useState } from 'react'
import {
  ESSENTIAL_PRINCIPLES_CHECKLIST_CONSTANTS,
  ESSENTIAL_PRINCIPLES_CHECKLIST_COLUMNS,
  ERROR_MESSAGES,
  ESSENTIAL_PRINCIPLES_CHECKLIST_MODAL,
  INITIAL_FORM_DATA,
  FIELD_ESSENTIAL_PRINCIPLE,
  FIELD_SPECIFICATION,
  FIELD_RELEVANT,
  FIELD_DOCUMENT_REF,
  FIELD_COMPLIES,
} from '@/constants/modules/regulation/essentialPrinciplesChecklist'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  FormData,
  FormErrors,
} from '@/types/modules/regulation/essentialPrinciplesChecklist'
import {
  useEssentialPrinciplesChecklistAll,
  useCreateEssentialPrinciplesChecklist,
  useUpdateEssentialPrinciplesChecklist,
  useDeleteEssentialPrinciplesChecklist,
  useEssentialPrinciplesChecklistById,
} from '@/hooks/modules/regulation/useEssentialPrinciplesChecklist'
/**
    Classification : Confidential
**/

import {
  ActionButton,
  DataTable,
  Description,
  InputField,
  RadioButtonGroup,
  showActionAlert,
} from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer } from '@/styles/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { Grid2 } from '@mui/material'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { useParams } from 'next/navigation'
import { NUMBERMAP, radioOptions } from '@/constants/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
const {
  EMPTY_ARRAY_LENGTH,
  VALUE_NO,
  VALUE_YES,
  INDEX_ONE,
  INDEX_ZERO,
  DELETE_ALERT,
  ACTIONS_FIELD,
  ACTIONS_HEADER,
  IN_ACTIVE_STATUS
} = COMMON_CONSTANTS

const { TITLE, ID_FIELD } = ESSENTIAL_PRINCIPLES_CHECKLIST_CONSTANTS
const {
  SNO,
  ESSENTIAL_PRINCIPLE,
  IS_RELEVANT,
  SPECIFICATION,
  IS_COMPLIES,
  DOCUMENT_REF_JUSTIFICATION,
} = ESSENTIAL_PRINCIPLES_CHECKLIST_COLUMNS
const { PLACEHOLDERS, LABELS } = ESSENTIAL_PRINCIPLES_CHECKLIST_MODAL

const EssentialPrice: React.FC = () => {
  const params = useParams()
  const PROJECT_ID = Number(params.id)
  const { draftSave, clearDraftSave ,isDraftSaving} = useDraftSave()
  
  const { data: checklistData, isLoading, refetch: refetchChecklistData } =
    useEssentialPrinciplesChecklistAll(PROJECT_ID)
  const {mutate:createCheckList,isSuccess:createStatus} = useCreateEssentialPrinciplesChecklist()
  const {mutate:updateChecklist,isSuccess:updateStatus} = useUpdateEssentialPrinciplesChecklist()
  const deleteChecklist = useDeleteEssentialPrinciplesChecklist()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { data: fetchedChecklistItem, refetch: refetchChecklistItem } =
    useEssentialPrinciplesChecklistById(editingId ?? NUMBERMAP.ZERO, false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData[FIELD_ESSENTIAL_PRINCIPLE].trim()) {
      newErrors[FIELD_ESSENTIAL_PRINCIPLE] = ERROR_MESSAGES.essentialPrinciple
    }
    if (!formData[FIELD_RELEVANT]) {
      newErrors[FIELD_RELEVANT] = ERROR_MESSAGES.relevant
    }
    if (!formData[FIELD_SPECIFICATION].trim()) {
      newErrors[FIELD_SPECIFICATION] = ERROR_MESSAGES.specification
    }
    if (!formData[FIELD_COMPLIES]) {
      newErrors[FIELD_COMPLIES] = ERROR_MESSAGES.complies
    }
    if (!formData[FIELD_DOCUMENT_REF].trim()) {
      newErrors[FIELD_DOCUMENT_REF] = ERROR_MESSAGES.documentRef
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
     if (!isInitialLoad) {
        handleDraftSave(updated)
      }
      
      return updated
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleDraftSave = (formData: FormData) => {
    const payload = {
      project_id: PROJECT_ID,
      id:PROJECT_ID,
      essential_principle: formData[FIELD_ESSENTIAL_PRINCIPLE],
      is_relevant:
        formData[FIELD_RELEVANT] === VALUE_YES.toLowerCase()
          ? INDEX_ONE
          : INDEX_ZERO,
      specification: formData[FIELD_SPECIFICATION],
      is_complies:
        formData[FIELD_COMPLIES] === VALUE_YES.toLowerCase()
          ? INDEX_ONE
          : INDEX_ZERO,
      document_ref_justification: formData[FIELD_DOCUMENT_REF],
      type:'draft'
    }
    
    draftSave({
      project_id: PROJECT_ID,
      form_type: 'essential_principles_checklist',
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  const getSpecificCheckList = () =>{
    return checklistData?.data?.find((checklist)=>checklist.type)
  }

  useEffect(()=>{
    if(createStatus || updateStatus || isDraftSaving){
      refetchChecklistData()
    }
  },[createStatus , updateStatus , isDraftSaving])
  const handleAdd = () => {
    setEditingId(null)
    if(getSpecificCheckList()){
      const fetchedData = getSpecificCheckList()
          setFormData({
        [FIELD_ESSENTIAL_PRINCIPLE]: fetchedData.essential_principle ?? '',
        [FIELD_RELEVANT]:
          fetchedData.is_relevant === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_SPECIFICATION]: fetchedData.specification ?? '',
        [FIELD_COMPLIES]:
          fetchedData.is_complies === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_DOCUMENT_REF]: fetchedData.document_ref_justification ?? '',
      } as FormData)
    }else{
       setFormData(INITIAL_FORM_DATA)
    }
    setErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        deleteChecklist.mutate(id)
      }
    })
  }

  const handleSave = () => {
    if (!validateForm()) return
    
    // Clear draft save when saving
    clearDraftSave()
    
    // Trim all values before saving
    const trimmedFormData: FormData = {
      [FIELD_ESSENTIAL_PRINCIPLE]: formData[FIELD_ESSENTIAL_PRINCIPLE].trim(),
      [FIELD_RELEVANT]: formData[FIELD_RELEVANT].trim(),
      [FIELD_SPECIFICATION]: formData[FIELD_SPECIFICATION].trim(),
      [FIELD_COMPLIES]: formData[FIELD_COMPLIES].trim(),
      [FIELD_DOCUMENT_REF]: formData[FIELD_DOCUMENT_REF].trim(),
    }
    const payload = {
      project_id: PROJECT_ID,
      principles_checklist: trimmedFormData[FIELD_ESSENTIAL_PRINCIPLE],
      is_relevant:
        trimmedFormData[FIELD_RELEVANT] === VALUE_YES.toLowerCase()
          ? INDEX_ONE
          : INDEX_ZERO,
      specification_standard_subclause_reference:
        trimmedFormData[FIELD_SPECIFICATION],
      is_complies:
        trimmedFormData[FIELD_COMPLIES] === VALUE_YES.toLowerCase()
          ? INDEX_ONE
          : INDEX_ZERO,
      document_reference_notes: trimmedFormData[FIELD_DOCUMENT_REF],
    }
    if (editingId !== null) {
      updateChecklist({ id: editingId, payload })
    } else {
      createCheckList(payload)
    }
    handleClose()
  }

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA)
    setEditingId(null)
    setIsModalOpen(false)
    setErrors({})
  }

  const columns = [
    { field: SNO.FIELD, headerName: SNO.HEADER, flex: NUMBERMAP.HALF },
    {
      field: ESSENTIAL_PRINCIPLE.FIELD,
      headerName: ESSENTIAL_PRINCIPLE.HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: IS_RELEVANT.FIELD,
      headerName: IS_RELEVANT.HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const val = params.value
        let displayValue = ''
        if (val === INDEX_ONE) {
          displayValue = VALUE_YES
        } else if (val === INDEX_ZERO) {
          displayValue = VALUE_NO
        }
        return displayValue
      },
    },
    { field: SPECIFICATION.FIELD, headerName: SPECIFICATION.HEADER, flex: NUMBERMAP.ONE_HALF },
    {
      field: IS_COMPLIES.FIELD,
      headerName: IS_COMPLIES.HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const val = params.value
        let displayValue = ''
        if (val === INDEX_ONE) {
          displayValue = VALUE_YES
        } else if (val === INDEX_ZERO) {
          displayValue = VALUE_NO
        }
        return displayValue
      },
    },
    {
      field: DOCUMENT_REF_JUSTIFICATION.FIELD,
      headerName: DOCUMENT_REF_JUSTIFICATION.HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: ACTIONS_FIELD,
      headerName: ACTIONS_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          deleteDisabled={params.row.type?NUMBERMAP.ONE:NUMBERMAP.ZERO}
          onDelete={() => handleDelete(params.row.id)}
          onEdit={() => {
            if(params.row.type){
                const fetchedData = params.row
                      setFormData({
        [FIELD_ESSENTIAL_PRINCIPLE]: fetchedData.essential_principle ?? '',
        [FIELD_RELEVANT]:
          fetchedData.is_relevant === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_SPECIFICATION]: fetchedData.specification ?? '',
        [FIELD_COMPLIES]:
          fetchedData.is_complies === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_DOCUMENT_REF]: fetchedData.document_ref_justification ?? '',
      } as FormData)
                setIsModalOpen(true)
            }else{
              handleEdit(params.row.id)
            }

          }}
          disabled={params.row.status === IN_ACTIVE_STATUS}
        />
      ),
    },
  ]

  useEffect(() => {
    if (fetchedChecklistItem?.data) {
      const fetchedData = fetchedChecklistItem?.data[NUMBERMAP.ZERO]
      setFormData({
        [FIELD_ESSENTIAL_PRINCIPLE]: fetchedData.essential_principle ?? '',
        [FIELD_RELEVANT]:
          fetchedData.is_relevant === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_SPECIFICATION]: fetchedData.specification ?? '',
        [FIELD_COMPLIES]:
          fetchedData.is_complies === INDEX_ONE
            ? VALUE_YES.toLowerCase()
            : VALUE_NO.toLowerCase(),
        [FIELD_DOCUMENT_REF]: fetchedData.document_ref_justification ?? '',
      } as FormData)
      setErrors({})
    }
  }, [fetchedChecklistItem])

  useEffect(() => {
    if (Number(editingId)) {
      refetchChecklistItem()
    }
  }, [editingId])

  // Set initial load to false after data is loaded
  useEffect(() => {
    if (checklistData) {
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        setIsInitialLoad(false);
      }, NUMBERMAP.THOUSAND);
    }
  }, [checklistData])

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <CommonSharedTale
        title={TITLE}
        pathName={'#'}
        hanldeClick={handleAdd}
        Table={
          <DataTable
            rows={checklistData?.data ?? []}
            columns={columns}
            IdField={ID_FIELD}
            checkbox={false}
            loading={isLoading}
          />
        }
      />
      <CommonModal
        buttonRequired
        onClose={handleClose}
        onSave={handleSave}
        title={TITLE}
        open={isModalOpen}
      >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={POPUP_STYLE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={LABELS.ESSENTIAL_PRINCIPLE}
              placeholder={PLACEHOLDERS.ESSENTIAL_PRINCIPLE}
              value={formData[FIELD_ESSENTIAL_PRINCIPLE]}
              onChange={(value: string | string[]) =>
                handleInputChange(FIELD_ESSENTIAL_PRINCIPLE, value as string)
              }
              error={errors[FIELD_ESSENTIAL_PRINCIPLE] ?? ''}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RadioButtonGroup
              onChange={(value) =>
                handleInputChange(FIELD_RELEVANT, value as string)
              }
              label={LABELS.RELEVANT}
              name={FIELD_RELEVANT}
              value={formData[FIELD_RELEVANT]}
              options={radioOptions}
              error={errors[FIELD_RELEVANT]}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={LABELS.SPECIFICATION}
              placeholder={PLACEHOLDERS.SPECIFICATION}
              value={formData[FIELD_SPECIFICATION]}
              onChange={(value) =>
                handleInputChange(FIELD_SPECIFICATION, value)
              }
              error={errors[FIELD_SPECIFICATION] ?? ''}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RadioButtonGroup
              onChange={(value) =>
                handleInputChange(FIELD_COMPLIES, value as string)
              }
              label={LABELS.COMPLIES}
              name={FIELD_COMPLIES}
              value={formData[FIELD_COMPLIES]}
              options={radioOptions}
              error={errors[FIELD_COMPLIES]}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <Description
              label={LABELS.DOCUMENT_REF_JUSTIFICATION}
              placeholder={PLACEHOLDERS.DOCUMENT_REF_JUSTIFICATION}
              value={formData[FIELD_DOCUMENT_REF]}
              onChange={(value) => handleInputChange(FIELD_DOCUMENT_REF, value)}
              error={errors[FIELD_DOCUMENT_REF] ?? ''}
            />
          </Grid2>
        </Grid2>
      </CommonModal>
    </PageContainer>
  )
}

export default EssentialPrice
