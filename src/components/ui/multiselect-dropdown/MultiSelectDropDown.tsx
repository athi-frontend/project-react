import React, { useMemo, useState } from 'react'
import { Checkbox, TextField, useTheme, Button } from '@mui/material'
import CustomOptionRowMulti from './CustomOptionRowMulti'

import CloseIcon from '@mui/icons-material/Close'
import SelectedListModal from './SelectModal'
import { StyledChip, StyledAutocomplete, DropDownIcons } from '@/styles/components/ui/dropdown'
import {
  MultiSelectionProps,
  Member,
} from '@/types/components/ui/multiselectDropdown'
import { ErrorText, Label, Container } from '@/styles/common'
import { NUMBERMAP, MULTISELECT_LABELS } from '@/constants/common'
import { labelToId } from '@/lib/utils/formUtils'
 
const MultiSelect: React.FC<MultiSelectionProps> = ({
  options,
  idField,
  valueField,
  label,
  placeholder,
  value,
  onChange,
  error,
  dataIsAutocomplete,
  dataSourceName,
  dataFieldName,
  dataIsMultiSelect = 'false',
  disabled = false,
  customOption = false,
  customOptionLabel = 'Add custom',
  customOptionPlaceholder = 'Enter new value',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localOptions, setLocalOptions] = useState<Member[]>(options)
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [customInputValue, setCustomInputValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const theme = useTheme()
  const handleOpenModal = () => {
    setIsModalOpen(true)
  }
 
  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  React.useEffect(() => {
    setLocalOptions(options)
  }, [options])

 // Combine Select All and Custom Option together
const finalOptions = useMemo(() => {
  const selectAllOption: Member = {
    [idField]: MULTISELECT_LABELS.SELECT_ALL_ID,
    [valueField]: MULTISELECT_LABELS.SELECT_ALL,
  }

  let baseOptions = [selectAllOption, ...localOptions]
  if (customOption) {
    baseOptions = [...baseOptions, { __isAddNew__: true } as any]
  }

  return baseOptions
}, [localOptions, customOption, idField, valueField])


  const selectedMembers = Array.isArray(value)
    ? localOptions?.filter((option: Member) => value.includes(option[idField]))
    : []
 
  // Prepare Select All synthetic option
  const selectAllId = MULTISELECT_LABELS.SELECT_ALL_ID
  const allSelected =
    localOptions?.length > NUMBERMAP.ZERO && selectedMembers.length === localOptions.length
  const someSelected =
    selectedMembers.length > NUMBERMAP.ZERO && !allSelected
  
 
  return (
    <Container>
      <Label sx={{ color: disabled ? theme.palette.info.main : '' }}>
        {label}
      </Label>
      <StyledAutocomplete
        disabled={disabled}
        multiple
        id="members-selection"
        options={finalOptions}
        sx={DropDownIcons}
        disableCloseOnSelect={isAddingCustom}
        open={dropdownOpen ?? isAddingCustom}
        onOpen={() => setDropdownOpen(true)}
        onClose={() => {
          if (isAddingCustom) return
          setDropdownOpen(false)
        }}
        value={selectedMembers}
        onChange={(event, valueList) => {
          const isSelectAllClicked = valueList.some(
            (item: Member) => item[idField] === selectAllId
          )
        
          let newValueIds: string[]
        
          if (isSelectAllClicked) {
            if (allSelected) {
              // Deselect all
              newValueIds = []
            } else {
              // Select all real options
              newValueIds = localOptions.map((item) => item[idField])
            }
          } else {
            newValueIds = valueList
              .filter((item: Member) => item[idField] !== selectAllId)
              .map((item: Member) => item[idField])
          }
        
          onChange(newValueIds)
        }}
        
        getOptionLabel={(option: any) => (option.__isAddNew__ ? '' : option[valueField])}
        isOptionEqualToValue={(option: any, value: any) =>
          option[idField] === value[idField]
        }
        renderOption={(props, option: any, { selected }) => {
          if (option.__isAddNew__) {
            if (!isAddingCustom) {
              return (
                <li key="custom-option-add-button" >
                  <Button
                    fullWidth
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation()
                      setIsAddingCustom(true)
                      setDropdownOpen(true)
                    }}
                  >
                    {customOptionLabel}
                  </Button>
                </li>
              )
            }
            const handleSave = (trimmed: string) => {
              if (trimmed.length === 0) return
              const newItem: any = {
                [idField]: String(Date.now()),
                [valueField]: trimmed,
              }
              const nextOptions = [...localOptions, newItem]
              setLocalOptions(nextOptions)
              setIsAddingCustom(false)
              setCustomInputValue('')
              onChange([...(value ?? []), newItem[idField]])
              setDropdownOpen(false)
            }
            const handleCancel = () => {
              setIsAddingCustom(false)
              setCustomInputValue('')
            }
            return (
              <CustomOptionRowMulti
                key="custom-option-row-multi"
                idField={idField}
                valueField={valueField}
                placeholder={customOptionPlaceholder}
                label={label}
                customInputValue={customInputValue}
                setCustomInputValue={setCustomInputValue}
                setIsAddingCustom={setIsAddingCustom}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )
          }
          const { key, ...restProps } = props
          const isSelectAll = option[idField] === selectAllId
          return (
            <li key={option[idField]} {...restProps}>
              <Checkbox
                checked={isSelectAll ? allSelected : selected}
                indeterminate={isSelectAll ? someSelected : false}
                disabled={disabled}
              />
              {option[valueField]}
            </li>
          )
        }}
        renderInput={(params) => (
          <TextField
            error={error != ''}
            {...params}
            placeholder={selectedMembers.length === NUMBERMAP.ZERO ? placeholder : ''}
            aria-label={`Select ${label.toLowerCase()}`}
            data-sourcename={dataSourceName}
            data-fieldname={dataFieldName}
            data-is-autocomplete={dataIsAutocomplete}
            data-is-multi-select={dataIsMultiSelect}
            slotProps={{
              htmlInput: {
                ...params.inputProps,
                id: labelToId(label),
              },
            }}
          />
        )}
        renderTags={(value: any, getTagProps) =>
          value.map((option: Member, index: number) => {
            if (index < NUMBERMAP.TWO) {
              const { key, ...tagProps } = getTagProps({ index })
              return (
                <StyledChip
                  key={option[idField]} // Use unique idField here
                  label={option[valueField]}
                  {...tagProps}
                  deleteIcon={<CloseIcon />}
                  aria-label={`Remove ${option[valueField]}`}
                />
              )
            } else if (index === NUMBERMAP.TWO) {
              return (
                <StyledChip
                  key="more"
                  label={`...`}
                  onClick={handleOpenModal}
                  aria-label={`Show all selected ${label.toLowerCase()}`}
                />
              )
            } else {
              return null
            }
          })
        }
      />
      <SelectedListModal
        open={isModalOpen}
        onClose={handleCloseModal}
        listData={selectedMembers}
        idField={idField}
        valueField={valueField}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Container>
  )
}
 
export default MultiSelect