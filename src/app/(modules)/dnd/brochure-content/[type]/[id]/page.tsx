'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, RichTextEditor, showActionAlert } from '@/components/ui'
import { useParams } from 'next/navigation'
import {
  Container,
  Title,
  ContentWrapper,
} from '@/styles/modules/dnd/feasibilityStudy'
import { NUMBERMAP } from '@/constants/common'
import { magicFormSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { COMMON_CONSTANTS, BUTTONLABELS } from '@/lib/utils/common'
import {
  TYPE_MAP,
  BROCHURE_CONTAINER_VALUE,
  BROCHURE_DATA_SOURCE_MAP,
  FIELD_MAP,
  MARKETINGSTEPPER,
} from '@/constants/modules/dnd/brochureContent'
import { magicRead } from '@/lib/utils/magicRead'
import { BrochureFormData } from '@/types/modules/dnd/brochureContent'
import StepperComponent from '@/components/ui/stepper/StepperComponent'
const {
  SUCCESS_ALERT,
  FAILED_ALERT,
  INSERT,
  UPDATE,
  ACTIVE_STATUS,
  SUCCESS_CODE,
} = COMMON_CONSTANTS

const BrochureContent: React.FC = () => {
  const brochureRef = useRef(null)
  const params = useParams()
  const brochureContentId = Number(params.id)
  const urlParam = params.type
  // Find the matching type by URL param
  const typeEntry = Object.values(TYPE_MAP).find(
    (entry) => entry.urlParam === urlParam
  )
  const type = typeEntry ? typeEntry.displayTitle : ''
  const fields = FIELD_MAP[type as string] ?? []
  const key =
    BROCHURE_DATA_SOURCE_MAP[type as keyof typeof BROCHURE_DATA_SOURCE_MAP]

  const [operatorType, setOperatorType] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    fields.reduce(
      (acc, field) => {
        acc[field.dataFieldName] = ''
        return acc
      },
      {} as Record<string, string>
    )
  )

  const updateFormData = (field: keyof BrochureFormData, value: string) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      newData[field] = value
      return newData
    })
  }

  const handleSave = async () => {
    try {
      const saveResponse = await magicFormSave({
        currentFormRef: brochureRef,
        dataframeworkOperatorType: operatorType,
        dataframeworkOtherParamsBag:
          operatorType === INSERT
            ? {
              [key]: [
                {
                  fk_eqms_product_brochure_content_id: brochureContentId,
                  status: ACTIVE_STATUS,
                },
              ],
            }
            : {},
        keys:
          operatorType === UPDATE
            ? {
              [key]: {
                fk_eqms_product_brochure_content_id: brochureContentId,
              },
            }
            : {},
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
      })

      if (saveResponse.response.code === SUCCESS_CODE) {
        showActionAlert(SUCCESS_ALERT)
      } else {
        showActionAlert(FAILED_ALERT)
      }
    } catch {
      showActionAlert(FAILED_ALERT)
    }
  }

  const fetchdataFromMagicRead = async () => {
    const container = brochureRef?.current as HTMLElement
    if (!container || container.childElementCount === NUMBERMAP.ZERO) {
      return
    }

    const keys = {
      [key]: {
        fk_eqms_product_brochure_content_id: brochureContentId,
      },
    }

    const result = await magicRead(container, keys)
    const brochureContentData = result?.data?.[key]?.[0]

    if (!brochureContentData) {
      setOperatorType(INSERT)
      return
    }
    setOperatorType(UPDATE)

    /** 
    Description:  
      Object.entries(brochureContentData): This part of the code is converting the brochureContentData into an array of [key, value] pairs.
      .map(([key]) => [key, brochureContentData[key]]): Here, for each key-value pair in the initial object, we are mapping the key to a new value.
                                           The new value is fetched from brochureContentData for the corresponding key.
      Object.fromEntries(...): Finally, the Object.fromEntries() method transforms the list of key-value pairs back into an object.
    Author: Harsithiga B
    Created: 09-06-2025
    */
    const fieldMap = Object.fromEntries(
      Object.entries(brochureContentData).map(([key]) => [
        key,
        brochureContentData[key],
      ])
    )

    Object.entries(fieldMap).forEach(([field, value]) => {
      updateFormData(field as keyof BrochureFormData, value ?? '')
    })
  }

  useEffect(() => {
    if (brochureContentId) {
      const container = brochureRef.current
      if (container) {
        fetchdataFromMagicRead()
      }
    }
  }, [])

  return (
    <Grid2 container spacing={NUMBERMAP.ZERO}>
      <Grid2 size={NUMBERMAP.TWO}>
        <StepperComponent sections={MARKETINGSTEPPER(brochureContentId)} />
      </Grid2>
      <Grid2 size={NUMBERMAP.TEN}>
        <Container
          ref={brochureRef}
          id={
            BROCHURE_CONTAINER_VALUE[type as keyof typeof BROCHURE_CONTAINER_VALUE]
          }
        >
          <Title>{type}</Title>
          <ContentWrapper>
            <Grid2 container spacing={NUMBERMAP.ONE}>
              {fields.map((field) => (
                <Grid2 size={NUMBERMAP.SIX} key={field.name}>
                  <RichTextEditor
                    value={formData[field.dataFieldName]}
                    label={field.label}
                    placeholder={`Enter ${field.label}`}
                    dataSourceName={
                      BROCHURE_DATA_SOURCE_MAP[
                      type as keyof typeof BROCHURE_DATA_SOURCE_MAP
                      ]
                    }
                    dataFieldName={field.dataFieldName}
                    onChange={(val: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        [field.dataFieldName]: val,
                      }))
                    }
                  />
                </Grid2>
              ))}
            </Grid2>
          </ContentWrapper>
          <ButtonGroup
            buttons={[
              { label: BUTTONLABELS.BUTTON_LABEL_SAVE, onClick: handleSave },
            ]}
          />
        </Container>
      </Grid2>
    </Grid2>
  )
}

export default BrochureContent
