import React, { useState, useEffect } from 'react'
import { AddSpecificationModalProps } from '@/types/modules/dnd/pnd'
import { PND_MODAL_TEXTS } from '@/constants/modules/dnd/pnd'
import { pndModalFieldKeys } from '@/lib/modules/dnd/pnd'
import { Form } from '@/styles/modules/dnd/pnd'
import { ButtonGroup, InputField } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'

const AddSpecificationModal: React.FC<AddSpecificationModalProps> = ({
  hasEditable,
  open,
  onClose,
  onSave,
  specification,
}) => {
  const [formData, setFormData] = useState({ parameter: '', specification: '' })
  const [errors, setErrors] = useState<{
    parameter?: string
    specification?: string
  }>({})

  useEffect(() => {
    setErrors({})
    if (specification) {
      setFormData({
        parameter: specification.parameter,
        specification: specification.specification,
      })
    } else {
      setFormData({ parameter: '', specification: '' })
    }
  }, [specification, open])

  const handleChange = (value: string, name: string) => {
    if(hasEditable) return
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = () => {
    if(hasEditable) return
    const trimmedData = {
      parameter: formData.parameter.trim(),
      specification: formData.specification.trim(),
    }

    let newErrors: { parameter?: string; specification?: string } = {}

    if (!trimmedData.parameter) {
      newErrors.parameter = PND_MODAL_TEXTS.PARAMETER_REQUIRED
    }
    if (!trimmedData.specification) {
      newErrors.specification = PND_MODAL_TEXTS.SPECIFICATION_REQUIRED
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const dataToSave = specification?.id
      ? { id: specification.id, ...trimmedData }
      : { ...trimmedData }

    onSave(dataToSave)
  }

  return (
    <CommonModal open={open} onClose={onClose} title={specification
            ? PND_MODAL_TEXTS.EDIT_TITLE
            : PND_MODAL_TEXTS.ADD_TITLE}>
        <Form>
          <InputField
            label={PND_MODAL_TEXTS.PARAMETER_LABEL}
            placeholder={PND_MODAL_TEXTS.PARAMETER_LABEL_PLACEHOLDER}
            name={pndModalFieldKeys.parameter}
            value={formData.parameter}
            onChange={(e: string) => {
              handleChange(e, 'parameter')
            }}
            error={errors.parameter}
          />
          <InputField
            label={PND_MODAL_TEXTS.SPECIFICATION_LABEL}
            placeholder={PND_MODAL_TEXTS.SPECIFICATION_LABEL_PLACEHOLDER}
            name={pndModalFieldKeys.specification}
            value={formData.specification}
            onChange={(e: string) => {
              handleChange(e, 'specification')
            }}
            multiline
            rows={4}
            error={errors.specification}
          />

          <ButtonGroup
            buttons={[
              { label: PND_MODAL_TEXTS.CANCEL_BUTTON, onClick: onClose },
              {
                label: PND_MODAL_TEXTS.SAVE_BUTTON,
                onClick: () => {
                  handleSubmit()
                },
              },
            ]}
          />
          {}
        </Form>
    </CommonModal>
  )
}

export default AddSpecificationModal
