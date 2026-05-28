'use client'
import React, { useState, useEffect } from 'react'
import { Grid2, Box } from '@mui/material'
import { InputField } from '@/components/ui'
import { numberValidation } from '@/lib/utils/common'
import { COST_FORM_FIELDS } from '@/lib/modules/dnd/feasibilityStudy'
import {
  StringFormField,
  CostInputFormProps,
} from '@/types/modules/dnd/feasibilityStudy'
import {
  FormContainer,
  HeaderSection,
  HeaderTitle,
  CostItemsWrapper,
  CostLabelContainer,
  CostItemContainer,
  CostLabel,
  CostInputContainer,
  InputContainer,
  grid2Container,
  getCostValidationBoxStyles,
} from '@/styles/modules/dnd/feasibilityStudy'

const CostInputForm: React.FC<CostInputFormProps> = ({
  initialData = {
    productCost: '',
    equipmentCost: '',
    developmentalCost: '',
    manufacturingCost: '',
    otherCost: '',
  },
  errors = {
    productCost: '',
    equipmentCost: '',
    developmentalCost: '',
    manufacturingCost: '',
    otherCost: '',
  },
  onCostChange = () => {},
  onErrorChange = () => {},
  hasEditable
}) => {
  const [formData, setFormData] = useState({
    productCost: initialData.productCost ?? '',
    equipmentCost: initialData.equipmentCost ?? '',
    developmentalCost: initialData.developmentalCost ?? '',
    manufacturingCost: initialData.manufacturingCost ?? '',
    otherCost: initialData.otherCost ?? '',
  })

  useEffect(() => {
    if (
      initialData.productCost !== formData.productCost ||
      initialData.equipmentCost !== formData.equipmentCost ||
      initialData.developmentalCost !== formData.developmentalCost ||
      initialData.manufacturingCost !== formData.manufacturingCost ||
      initialData.otherCost !== formData.otherCost
    ) {
      setFormData({
        productCost: initialData.productCost ?? '',
        equipmentCost: initialData.equipmentCost ?? '',
        developmentalCost: initialData.developmentalCost ?? '',
        manufacturingCost: initialData.manufacturingCost ?? '',
        otherCost: initialData.otherCost ?? '',
      })
    }
  }, [initialData])

  const handleInputChange = (costType: string) => (value: string) => {
    if (!numberValidation.test(value) && value !== '' || hasEditable) return

    setFormData((prev) => ({
      ...prev,
      [costType]: value,
    }))

    onCostChange(costType, value)

    if (errors[costType as StringFormField]) {
      onErrorChange(costType, '')
    }
  }

  return (
    <FormContainer>
      <HeaderSection>
        <HeaderTitle>Cost</HeaderTitle>
      </HeaderSection>

      <CostItemsWrapper>
        <Grid2 container>
          <Grid2 sx={grid2Container}>
            <CostLabelContainer>
              {COST_FORM_FIELDS.map((item, index) => (
                <CostItemContainer
                  key={item.field}
                  isLast={index === COST_FORM_FIELDS.length - 1}
                >
                  <CostLabel>{item.label}</CostLabel>
                </CostItemContainer>
              ))}
            </CostLabelContainer>
          </Grid2>

          <Grid2 sx={grid2Container}>
            <CostInputContainer>
              {COST_FORM_FIELDS.map((item, index) => (
                <Box
                  className="cost-validation"
                  key={item.field}
                  sx={getCostValidationBoxStyles(
                    index,
                    COST_FORM_FIELDS.length
                  )}
                >
                  <InputContainer>
                    <InputField
                      label=""
                      placeholder={item.placeholder}
                      value={formData[item.field as keyof typeof formData]}
                      onChange={handleInputChange(item.field)}
                      error={errors[item.field] ?? ''}
                      maxLength={item.maxLength}
                    />
                  </InputContainer>
                </Box>
              ))}
            </CostInputContainer>
          </Grid2>
        </Grid2>
      </CostItemsWrapper>
    </FormContainer>
  )
}

export default CostInputForm
