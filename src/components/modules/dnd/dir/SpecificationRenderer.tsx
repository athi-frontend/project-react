import React from 'react'
import { Grid2, Box } from '@mui/material'
import { ButtonGroup, DataTable, Label } from '@/components/ui'
import LifetimeOfDevice from '@/components/modules/dnd/specification/LifetimeOfDevice'
import { SPECIFICATION_FORM_ID, SPECIFICATION_NAMES, ADD_NEW, DEVICE_NAME,SPECIFICATION_SCHEMA } from '@/constants/modules/dnd/dirSpecificataion'
import { gridMarginStyles, grid2SectionStyles, gridSectionStyles } from '@/styles/modules/dnd/dirSpecification'
import { NUMBERMAP } from '@/constants/common'
import magicSaveConstants from '@/constants/magicSave'
import CommonSpecificationPage from '../specification-form/CommonMainPage'

interface StepData {
  id: number
  specificationApplicabilityID: number
  title: string
  subtitle: string
}

interface SpecificationContentProps {
  specificationName: string
  projectID: any
  gridRef: React.RefObject<any>
  deviceDataResponse: any[]
  deviceColumns: any[]
  physicalLoading: boolean
  stepList: StepData[]
  currentStep: number | null
  physicalDataResponse: any[]
  stepConfig: any
  defaultColumns: any[]
  openForm: string | null
  specificationInputId: number
  specificationTitle: string
  currentSpecificationApplicabilityId: number
  accessoriesConsumablesApplicabilityId: number
  designSpecificationTypeId: number
  handleToggle: (formName: string) => void
  refetch: () => void
  setDomUpdate: (value: boolean | ((prev: boolean) => boolean)) => void
}

/**
 * Helper function to render main specification content
 * 
 * Author: Assistant
 * Date: Current
 * Description: Extracted from DIRSpecification component to reduce cognitive complexity
 * Classification: Confidential
 */
export const renderSpecificationContent = (props: SpecificationContentProps) => {
  const {
    specificationName,
    projectID,
    gridRef,
    deviceDataResponse,
    deviceColumns,
    physicalLoading,
    stepList,
    currentStep,
    physicalDataResponse,
    stepConfig,
    defaultColumns,
    openForm,
    specificationInputId,
    specificationTitle,
    currentSpecificationApplicabilityId,
    accessoriesConsumablesApplicabilityId,
    designSpecificationTypeId,
    handleToggle,
    refetch,
    setDomUpdate
  } = props;
  const { LIFETIME_DEVICE, DEVICE_COMPATIBILITY, RISK_CONTROL_MEASURES, STERILIZATION_REQUIREMENTS ,DEVICE_NAME_FORM} = SPECIFICATION_NAMES;
  
  // Handle empty specifications
  if (specificationName === RISK_CONTROL_MEASURES || specificationName === STERILIZATION_REQUIREMENTS) {
    return <Box sx={gridSectionStyles}></Box>;
  }
  
  // Handle lifetime device specification
  if (specificationName === LIFETIME_DEVICE) {
    return (
      <LifetimeOfDevice
        projectID={Number(projectID)}
        specificationName={specificationName}
        specificationApplicabilityId={currentSpecificationApplicabilityId}
      />
    );
  }
  
  // Handle other specifications
  return (
    <Box ref={gridRef} id={specificationName === SPECIFICATION_NAMES.SHELF_LIFE ? SPECIFICATION_FORM_ID.SHELF_LIFE : SPECIFICATION_FORM_ID.OTHER_SPECIFICATION_FORM_ID}>
      <>
        {specificationName === DEVICE_COMPATIBILITY && (
          <>
            <Grid2 container>
              <Grid2 size={{ md: NUMBERMAP.SIX }} sx={gridMarginStyles}>
                <Label title={DEVICE_NAME} />
              </Grid2>
              <Grid2 size={{ md: NUMBERMAP.SIX }} sx={grid2SectionStyles}>
                <ButtonGroup
                  buttons={[
                    {
                      label: ADD_NEW,
                      onClick: () => handleToggle(DEVICE_NAME_FORM),
                      icon: '',
                    },
                  ]}
                />
              </Grid2>
            </Grid2>
            <Box ref={() => setDomUpdate(true)}>
              <DataTable
                rows={deviceDataResponse ?? []}
                columns={deviceColumns}
                IdField={SPECIFICATION_SCHEMA.ID}
                checkbox={false}
                loading={physicalLoading}
                customClassName={magicSaveConstants.CUSTOM_CLASS_NAME}
              />
            </Box>
          </>
        )}
        <Grid2 container>
          <Grid2 size={{ md: NUMBERMAP.SIX }} sx={gridMarginStyles}>
            {stepList?.length > NUMBERMAP.ZERO && (
              <Label
                key={JSON.stringify(stepList)}
                title={
                  stepList.find((step) => step.id === currentStep)?.title ?? ''
                }
              />
            )}
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }} sx={grid2SectionStyles}>
            <ButtonGroup
              buttons={[
                {
                  label: ADD_NEW,
                  onClick: () => handleToggle(specificationName),
                  icon: '',
                },
              ]}
            />
          </Grid2>
        </Grid2>
        <Box ref={() => setDomUpdate(true)}>
          <DataTable
            rows={physicalDataResponse ?? []}
            columns={stepConfig[currentStep ?? 0]?.columns ?? defaultColumns}
            IdField={SPECIFICATION_SCHEMA.ID}
            checkbox={false}
            loading={physicalLoading}
            customClassName={magicSaveConstants.CUSTOM_CLASS_NAME}
          />
        </Box>
        {openForm && (
          <CommonSpecificationPage
            key={openForm}
            pageName={
              openForm === DEVICE_NAME_FORM
                ? DEVICE_NAME_FORM
                : specificationTitle
            }
            isopen={true}
            specificationInputId={specificationInputId}
            toggleState={() => handleToggle(openForm)}
            specificationApplicabilityId={
              openForm === DEVICE_NAME_FORM
                ? NUMBERMAP.ZERO
                : currentSpecificationApplicabilityId
            }
            designSpecificationTypeId = {designSpecificationTypeId}
            refetchForm={refetch}
            accessoriesConsumablesApplicabilityId={
              accessoriesConsumablesApplicabilityId
            }
          />
        )}
      </>
    </Box>
  )
};
