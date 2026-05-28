'use client'
import React, { useState, useRef, useEffect  } from 'react'
import { Grid2 } from '@mui/material'
import {
  ButtonGroup,
  RichTextEditor, showActionAlert
} from '@/components/ui'
import { useParams } from 'next/navigation'
import {
  Container,
  Title,
  ContentWrapper,
} from '@/styles/modules/dnd/feasibilityStudy'
import { NUMBERMAP } from '@/constants/common'
import { magicFormSave } from '@/lib/utils/magicSave'
import { magicRead } from '@/lib/utils/magicRead'
import magicSaveConstants from '@/constants/magicSave'
import { TYPE_MAP, CONTAINER_VALUE, DATA_SOURCE_MAP, FIELD_MAP } from '@/constants/modules/dnd/websiteContent'
import { COMMON_CONSTANTS, BUTTONLABELS } from '@/lib/utils/common'
import { WebsiteFormData } from '@/types/modules/dnd/websiteContent'
import StepperComponent from '@/components/ui/stepper/StepperComponent'
import { MARKETINGSTEPPER } from '@/constants/modules/dnd/brochureContent'
const {
  SUCCESS_ALERT,
  FAILED_ALERT,
  INSERT,
  UPDATE,
  ACTIVE_STATUS,
  SUCCESS_CODE,
} = COMMON_CONSTANTS

const WebsiteContent: React.FC = () => {
  const params = useParams()
  const websiteContentId = Number(params.id)
  const urlParam = params.type
  const typeEntry = Object.values(TYPE_MAP).find(
    (entry) => entry.urlParam === urlParam
  )
  const type = typeEntry ? typeEntry.displayTitle : ""
  const fields = FIELD_MAP[type as string] ?? []
  const websiteRef = useRef(null)
  const key = DATA_SOURCE_MAP[type as keyof typeof DATA_SOURCE_MAP]

  const [operatorType, setOperatorType] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>(() =>
      fields.reduce((acc, field) => {
        acc[field.dataFieldName] = ""
        return acc
      }, {} as Record<string, string>)
  )

  
  const updateFormData = (field: keyof WebsiteFormData, value: string) => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      newData[field] = value
      return newData
    })
  }


 const handleSave = async () => {
    try {
      const saveResponse = await magicFormSave({
        currentFormRef: websiteRef,
        dataframeworkOperatorType: operatorType,
        dataframeworkOtherParamsBag:
          operatorType === INSERT
            ? {
                [key]: [
                  {
                    fk_eqms_product_website_content_id: websiteContentId,
                    status: ACTIVE_STATUS,
                  },
                ],
              }
            : {},
        keys:
          operatorType === UPDATE
            ? {
                [key]: {
                  fk_eqms_product_website_content_id: websiteContentId,
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
    const container = websiteRef?.current as HTMLElement
    if (!container || container.childElementCount === NUMBERMAP.ZERO) {
      return
    }

    const keys = {
      [key]: {
        fk_eqms_product_website_content_id: websiteContentId,
      },
    }

    const result = await magicRead(container, keys)
    const websiteContentData = result?.data?.[key]?.[0]

    if (!websiteContentData) {
      setOperatorType(INSERT)
      return
    }

    setOperatorType(UPDATE)
    const fieldMap = Object.fromEntries(
      Object.entries(websiteContentData).map(([key]) => [
        key,
        websiteContentData[key],
      ])
    )

    Object.entries(fieldMap).forEach(([field, value]) => {
      updateFormData(field as keyof WebsiteFormData, value ?? '')
    })


  }

  useEffect(() => {
    if (websiteContentId) {
        const container = websiteRef.current
        if (container) {
          fetchdataFromMagicRead()
        }
    }
  }, [])

  return (
    <Grid2 container spacing={NUMBERMAP.ZERO} >
      <Grid2 size={NUMBERMAP.TWO} >
        <StepperComponent sections={MARKETINGSTEPPER(websiteContentId)} />
        </Grid2>
    <Grid2 size={NUMBERMAP.TEN}>
    <Container ref={websiteRef} id={CONTAINER_VALUE[type as keyof typeof CONTAINER_VALUE]}>
      <Title>{type}</Title>
      <ContentWrapper>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          {fields.map((field) => (
            <Grid2 size={NUMBERMAP.SIX} key={field.name}>
              <RichTextEditor
                value={formData[field.dataFieldName]?? ''}
                label={field.label}
                placeholder={`Enter ${field.label}`}
                dataSourceName={DATA_SOURCE_MAP[type as keyof typeof DATA_SOURCE_MAP]}
                dataFieldName={field.dataFieldName}
                onChange={(val: string) =>
                  setFormData((prev) => ({ ...prev, [field.dataFieldName]: val }))
                }
              />
            </Grid2>
          ))}
        </Grid2>
      </ContentWrapper>
      <ButtonGroup buttons={[{ label: BUTTONLABELS.BUTTON_LABEL_SAVE, onClick: handleSave }]} />
    </Container>
    </Grid2>
    </Grid2>
  )
}

export default WebsiteContent