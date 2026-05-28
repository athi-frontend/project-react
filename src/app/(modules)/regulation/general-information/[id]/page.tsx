'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Grid2 } from '@mui/material'
import {
  RichTextEditor,
  Label,
  ButtonGroup,
  DataGridTable,
} from '@/components/ui'
import {
  FormContainer,
  FormWrapper,
  FormContent,
} from '@/styles/modules/user/userOnboard'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { ButtonContainer } from '@/styles/components/ui/button'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import {
  useGeneralInformation,
  useUpdateGeneralInformation,
} from '@/hooks/modules/regulation/useGeneralInformation'
import { useParams } from 'next/navigation'
import { GeneralInformationData } from '@/types/modules/regulation/generalInformation'
/**
    Classification : Confidential
**/

import {
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  DEPARTMENT_TABLE_COLUMNS,
  INFO_TEXT,
  SECTION_TITLES,
  FIELD_NAMES,
  TOOLBAR,
} from '@/constants/modules/regulation/generalInformation'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import SubHeader from '@/components/modules/regulation/executive-summary/SubHeader'
import { EditorLabel } from '@/styles/components/ui/input'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

type SaveType = 'draft' | 'final'

const GeneralInformation: React.FC = () => {
  const params = useParams()
  const organizationSiteId = Number(params.id)

  const { data: generalInformationData, refetch: refetchGeneralInformation } =
    useGeneralInformation(organizationSiteId, false)
  const updateMutation = useUpdateGeneralInformation()
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    context_type: 'organization_site'  
  })

  const [formData, setFormData] = useState<Partial<GeneralInformationData>>({
    site: '',
    site_address: '',
    company_profile: '',
    facility_profile: '',
    manufacturing_activity: '',
    other_manufacturing_activity: '',
    exact_address: '',
    product_manufactured_type: '',
    site_short_description: '',
    outside_tech_assistance: '',
    qms_short_description: '',
    department_user_counts: [],
  })
  const isInitialDataLoad = useRef(true)

  // Trigger API call on component mount
  useEffect(() => {
    refetchGeneralInformation();
  }, [refetchGeneralInformation]);

  const handleInputChange = (
    name: keyof GeneralInformationData,
    value: string | null
  ) => {
    setFormData((prevData) => {
      const updated = { ...prevData, [name]: value }
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    })
  }

  // Bind department grid: use department_user_counts from API
  const departmentData = (formData?.department_user_counts ?? []).map(
    (dept: any) => ({
      id: dept.department_id.toString(),
      department: dept.department_name,
      noOfEffectivePersonnel: dept.user_count.toString(),
    })
  )

  // Update form data when API data is loaded
  useEffect(() => {
    if (generalInformationData) {
      setFormData(generalInformationData?.data[0])
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    }
  }, [generalInformationData])

  const buildPayload = (fd: Partial<GeneralInformationData>) => {
    const deptRows = (fd?.department_user_counts ?? []).map((dept: any) => ({
      id: dept.department_id?.toString?.() ?? '',
      noOfEffectivePersonnel: dept.user_count?.toString?.() ?? '0',
    }))
    const employees_engaged = deptRows.map((d: any) => ({
      department_id: Number(d.id),
      no_of_effective_personnel: Number(d.noOfEffectivePersonnel),
    }))
    return {
      ...fd,
      organization_site_id: organizationSiteId,
      employees_engaged,
    }
  }

  function handleSave(type: SaveType, next?: Partial<GeneralInformationData>) {
    if (type === 'draft') {
      const payload = buildPayload(next ?? formData)
      draftSave({
        project_id: Number(organizationSiteId),
        form_type: 'general_information',
        form_data: payload,
        timestamp: new Date().toISOString(),
      })
      return
    }
    clearDraftSave()
    updateMutation.mutate({
      formData: buildPayload(next ?? formData),
    })
  }

  const handleCancel = () => {
    // Handle cancel logic
  }

  const buttonConfig = [
    { label: BUTTON_LABEL.CANCEL, onClick: handleCancel },
    { label: BUTTON_LABEL.SAVE, onClick: () => handleSave('final') },
  ]

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={SECTION_TITLES.GENERAL_INFORMATION} />
        <FormContent>
          <>
            {/* Basic Information */}
            <SubHeader title={SECTION_TITLES.BRIEF_INFORMATION} />
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={FIELD_LABELS.NAME_OF_FIRM}
                  value={formData?.site ?? '-'}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <InfoField
                  label={FIELD_LABELS.ADDRESS}
                  value={formData?.site_address ?? '-'}
                />
              </Grid2>
            </Grid2>

            {/* Company Information */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.COMPANY_PROFILE}
                  value={formData?.company_profile ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.COMPANY_PROFILE, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.FACILITY_PROFILE}
                  value={formData?.facility_profile ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.FACILITY_PROFILE, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
            </Grid2>

            {/* Manufacturing Activities */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.MANUFACTURING_ACTIVITY}
                  value={formData?.manufacturing_activity ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.MANUFACTURING_ACTIVITY, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.OTHER_MANUFACTURING_ACTIVITY}
                  value={formData?.other_manufacturing_activity ?? ''}
                  onChange={(value) =>
                    handleInputChange(
                      FIELD_NAMES.OTHER_MANUFACTURING_ACTIVITY,
                      value
                    )
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
            </Grid2>

            {/* Site Details */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.EXACT_ADDRESS}
                  value={formData?.exact_address ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.EXACT_ADDRESS, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.PRODUCT_MANUFACTURED_TYPE}
                  value={formData?.product_manufactured_type ?? ''}
                  onChange={(value) =>
                    handleInputChange(
                      FIELD_NAMES.PRODUCT_MANUFACTURED_TYPE,
                      value
                    )
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
            </Grid2>

            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.SITE_SHORT_DESCRIPTION}
                  toolbaroptions={TOOLBAR}
                  value={formData?.site_short_description ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.SITE_SHORT_DESCRIPTION, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
            </Grid2>

            {/* Department Table */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <EditorLabel>Number of employees engaged for different activities</EditorLabel>
                <DataGridTable
                  showAddButton
                  rows={departmentData}
                  columns={DEPARTMENT_TABLE_COLUMNS}
                  hideFooter={true}
                  checkboxSelection={false}
                />
              </Grid2>
            </Grid2>

            {/* Quality Management System */}
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.OUTSIDE_TECH_ASSISTANCE}
                  value={formData?.outside_tech_assistance ?? ''}
                  onChange={(value) =>
                    handleInputChange(
                      FIELD_NAMES.OUTSIDE_TECH_ASSISTANCE,
                      value
                    )
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                />
              </Grid2>
              <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                <RichTextEditor
                  label={FIELD_LABELS.QMS_SHORT_DESCRIPTION}
                  value={formData?.qms_short_description ?? ''}
                  onChange={(value) =>
                    handleInputChange(FIELD_NAMES.QMS_SHORT_DESCRIPTION, value)
                  }
                  placeholder={FIELD_PLACEHOLDERS.INPUT_TEXT}
                  infoText={INFO_TEXT.QMS_DESCRIPTION}
                />
              </Grid2>
            </Grid2>

            {/* Action Buttons */}
            <ButtonContainer>
              <ButtonGroup buttons={buttonConfig} />
            </ButtonContainer>
          </>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  )
}

export default GeneralInformation
