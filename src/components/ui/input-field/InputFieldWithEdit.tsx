import React, { useMemo, useState } from 'react'
import { Autocomplete, Popper, Box, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import {
  InputContainer,
  InputLabel,
  InputLabelContainer,
  StyledTextField,
} from '@/styles/components/ui/input'
import { InputFieldWithEditProps, Member } from '@/types/components/ui/dropDown'
import { ErrorText, FullWidth, INPUT_FIELD_STYLE } from '@/styles/common'
import InfoHover from '../info-hover/InfoHover'
import { labelToId } from '@/lib/utils/formUtils'
import { DropDownIcons, iconstyles, POPPERSTYLE } from '@/styles/components/ui/dropdown'
import { HiddenPopper } from '@/components/shared/HidePopper'
import CustomOptionRow from './CustomOptionRow'
import DomainVerificationIcon from '@mui/icons-material/DomainVerification'
import CircleIcon from '@mui/icons-material/Circle'
/**
    *Classification : Confidential
**/

const InputFieldWithEdit: React.FC<InputFieldWithEditProps> = ({
  label,
  placeholder,
  isDropdown,
  isMultiSelect,
  value,
  onChange,
  error,
  options = [],
  keyFieldForEdit,
  valueFieldForEdit,
  type,
  endAdornment,
  disabledForEdit = false,
  dataIsAutocomplete,
  dataSourceName,
  dataFieldName,
  infoText,
  icon,
  maxLength = null,
  hasEditableForEdit = false,
  customOption = false,
  customOptionLabel = 'Add custom',
  isCompleted = false,
  customOptionPlaceholder = 'Enter new value',
  showEditIcon = false,
  onEditSave,
  editModalTitle = 'Edit Name',
  editPlaceholder = 'Enter new name',
  onEditValidate
}) => {
  const [localOptions, setLocalOptions] = useState<any[]>(options)
  const [isAddingCustomForEdit, setIsAddingCustomForEdit] = useState(false)
  const [customInputValue, setCustomInputValue] = useState('')
  const [dropdownOpenForEdit, setDropdownOpenForEdit] = useState(false)
  const [isEditing, setIsEditing] = useState(false) // Track if we're in edit mode (via edit icon)
  const [customInputError, setCustomInputError] = useState<string | null>(null) // Error for custom input
  const [pendingOptionUpdate, setPendingOptionUpdate] = useState<{ key: string; value: string } | null>(null) // Track pending option update

  const emitSingleChange = (selectedId: string) => {
    (onChange as (value: string) => void)(selectedId)
  }

  // Keep local options in sync when parent options change (guarded)
  const optionsMemoString = useMemo(() => JSON.stringify(options ?? []), [options])
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(optionsMemoString)
      // If we have a pending update, apply it when options are updated (modal saved)
      if (pendingOptionUpdate && keyFieldForEdit && valueFieldForEdit) {
        const updatedOptions = parsed.map((option: any) => {
          if (String(option[keyFieldForEdit as keyof typeof option]) === pendingOptionUpdate.key) {
            return {
              ...option,
              [valueFieldForEdit]: pendingOptionUpdate.value,
            }
          }
          return option
        })
        setLocalOptions(updatedOptions)
        setPendingOptionUpdate(null) // Clear pending update after applying
      } else {
        setLocalOptions(parsed)
      }
    } catch {
      // no-op
    }
  }, [optionsMemoString, pendingOptionUpdate, keyFieldForEdit, valueFieldForEdit])
  
  // Clear pending update when value changes externally (modal cancelled or reset)
  React.useEffect(() => {
    if (pendingOptionUpdate) {
      // If the value no longer matches the pending update key, clear it (modal was cancelled/reset)
      if (!value || String(value) !== pendingOptionUpdate.key) {
        setPendingOptionUpdate(null)
      }
    }
  }, [value, pendingOptionUpdate])


  const computedOptionsForEdit = useMemo(() => {
    // When editing, only show the custom input (hide other options)
    if (isEditing && isAddingCustomForEdit) {
      return [{ __isAddNew__: true }]
    }
    
    // Don't show pending updates in dropdown - only show original options until modal is saved
    if (customOption && !isMultiSelect) {
      return [...localOptions, { __isAddNew__: true }]
    }
    return localOptions
  }, [customOption, isMultiSelect, localOptions, isEditing, isAddingCustomForEdit])

  const handleSaveCustom = (trimmed: string) => {
    if (!keyFieldForEdit || !valueFieldForEdit) return
    if (trimmed.length === 0) {
      setCustomInputError('This field is required')
      return
    }
    
    // Validate if validation function is provided (when editing)
    if (isEditing && onEditValidate) {
      const validationError = onEditValidate(trimmed)
      if (validationError) {
        setCustomInputError(validationError)
        return // Don't save if validation fails
      }
    }
    
    // Clear error if validation passes
    setCustomInputError(null)
    
    if (isEditing && value && keyFieldForEdit && valueFieldForEdit) {
      // We're editing an existing value - don't update localOptions yet
      // Just track the pending update and call onEditSave
      // The dropdown will show the updated value via pendingOptionUpdate
      setPendingOptionUpdate({
        key: String(value),
        value: trimmed,
      })
      
      // Call onEditSave if provided (this updates the form data)
      if (onEditSave) {
        onEditSave(trimmed)
      } else {
        // Default: emit change with the same key but updated value
        emitSingleChange(String(value))
      }
    } else {
      // We're adding a new custom value
      const newItem: any = {
        [keyFieldForEdit]: trimmed,
        [valueFieldForEdit]: trimmed,
      }
      const nextOptions = [...localOptions, newItem]
      setLocalOptions(nextOptions)
      emitSingleChange(String(newItem[keyFieldForEdit as string]))
    }
    
    setIsAddingCustomForEdit(false)
    setIsEditing(false)
    setCustomInputValue('')
    setDropdownOpenForEdit(false)
  }

  const handleCancelCustom = () => {
    setIsAddingCustomForEdit(false)
    setIsEditing(false)
    setCustomInputValue('')
    setCustomInputError(null)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (value && typeof value === 'string') {
      const selectedOption = localOptions.find(
        (option) => String(option[keyFieldForEdit as keyof typeof option]) === String(value)
      )
      if (selectedOption && valueFieldForEdit ) {
        const currentValue = String(selectedOption[valueFieldForEdit as keyof typeof selectedOption] ?? value)
        setCustomInputValue(currentValue)
      } else {
        setCustomInputValue(value)
      }
      setIsEditing(true) // Set edit mode
      setIsAddingCustomForEdit(true) // Show custom input
      setDropdownOpenForEdit(true) // Open dropdown
    }
  }


  const getSelectedOptionsForEdit = () => {
    if (!keyFieldForEdit || !valueFieldForEdit) {
      return isMultiSelect ? [] : null
    }

    if (isMultiSelect) {
      const selected = (value as string[])
        .map((id) =>
          localOptions.find((option) => String(option[keyFieldForEdit]) === String(id))
        )
        .filter((option) => option !== undefined) as Member[]
      return selected
    } else {
      const selected = value
        ? localOptions.find((option) => String(option[keyFieldForEdit]) === String(value))
        : null
      return selected ?? null
    }
  }

  const getOptionsLableForEdit = (option: any) => {
    if ((option).__isAddNew__) return ''
    return String(option[valueFieldForEdit as keyof typeof option] ?? '')
  }

  const renderLabelForEdit = (option: any, restProps: any) => {
    if (isCompleted) {
      return (
        <Box key={keyFieldForEdit ? option[keyFieldForEdit as string] : JSON.stringify(option)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <li key={keyFieldForEdit ? option[keyFieldForEdit as string] : JSON.stringify(option)} {...restProps} style={FullWidth}>
            {String(valueFieldForEdit ? option[valueFieldForEdit as string] : '')}
          </li>
          <CircleIcon sx={{ ...iconstyles, color: option['is_completed'] ? 'text.secondary' : 'text.default' }} />
          <DomainVerificationIcon sx={{ ...iconstyles, color: option['is_completed'] ? 'text.default' : 'text.disabled' }} />
        </Box>
      )
    }
    return (
      <li key={keyFieldForEdit ? option[keyFieldForEdit as string] : JSON.stringify(option)} {...restProps} style={FullWidth}>
        {String(valueFieldForEdit ? option[valueFieldForEdit as string] : '')}
      </li>
    )
  }

  const selectedOption = useMemo(() => {
    if (!value || !keyFieldForEdit) return null
    return localOptions.find((option) => String(option[keyFieldForEdit]) === String(value))
  }, [value, localOptions, keyFieldForEdit])

  const showEditButton = showEditIcon && value && selectedOption && !disabledForEdit

  return (
      <InputContainer>
        <InputLabelContainer>
          <InputLabel>{label}</InputLabel>
          {infoText && (
            <InfoHover infoText={String(infoText)} />
          )}
        </InputLabelContainer>

        {isDropdown || isMultiSelect ? (
          <Box sx={{ position: 'relative' }}>
            <Autocomplete
              id={labelToId(label)}
              disabled={disabledForEdit}
              multiple={isMultiSelect}
              slots={{
                popper: hasEditableForEdit ? HiddenPopper : Popper,
              }}
              disableClearable={hasEditableForEdit}
              options={computedOptionsForEdit}
              disableCloseOnSelect={isAddingCustomForEdit}
              slotProps={{
                paper: {
                  sx: POPPERSTYLE,
                },
              }}
              sx={DropDownIcons}
              open={dropdownOpenForEdit ?? isAddingCustomForEdit}
              onOpen={() => setDropdownOpenForEdit(true)}
              onClose={(event, reason) => {
                if (isAddingCustomForEdit) return
                setDropdownOpenForEdit(false)
              }}
              isOptionEqualToValue={(option, value) => {
                if ((option).__isAddNew__ || (value).__isAddNew__) return false
                return (
                  option[keyFieldForEdit as keyof typeof option] ===
                  value[keyFieldForEdit as keyof typeof option]
                )
              }}
              getOptionLabel={(option: any) => {
                if ((option).__isAddNew__) return ''
                return String(option[valueFieldForEdit as keyof typeof option] ?? '')
              }}
              value={getSelectedOptionsForEdit()}
              onChange={(_, newValue) => {
                if (!keyFieldForEdit) return;

                if (isMultiSelect) {
                  const selectedValues = (newValue as Member[]).map((item: any) =>
                    String(item[keyFieldForEdit])
                  );
                  (onChange as (value: string[]) => void)(selectedValues);
                } else {
                  const selectedValue = newValue ? String(newValue[keyFieldForEdit]) : '';
                  (onChange as (value: string) => void)(selectedValue);
                  if (!isAddingCustomForEdit) setDropdownOpenForEdit(false)
                }
              }}
              getOptionDisabled={(option) => option.disabled}
              renderOption={(props, option) => {
                // Custom "Add new" row
                if ((option).__isAddNew__) {
                  return (
                    <CustomOptionRow
                      key="custom-option-row"
                      placeholder={isEditing ? editPlaceholder : customOptionPlaceholder}
                      customInputValue={customInputValue}
                      setCustomInputValue={(v) => {
                        setCustomInputValue(v)
                        // Clear error when user starts typing
                        if (customInputError) {
                          setCustomInputError(null)
                        }
                      }}
                      isAddingCustom={isAddingCustomForEdit}
                      setIsAddingCustom={(v) => {
                        setIsAddingCustomForEdit(v)
                        if (v) setDropdownOpenForEdit(true)
                      }}
                      customOptionLabel={isEditing ? 'Save' : customOptionLabel}
                      onSave={handleSaveCustom}
                      onCancel={handleCancelCustom}
                      error={customInputError}
                    />
                  )
                }
                // Hide other options when editing
                if (isEditing && isAddingCustomForEdit) {
                  return null
                }
                const { key, ...restProps } = props
                return renderLabelForEdit(option, restProps)
              }}
              renderInput={(params) => {
                return (
                  <StyledTextField
                    {...params}
                    placeholder={placeholder}
                    error={!!error}
                    data-is-autocomplete={dataIsAutocomplete}
                    data-sourcename={dataSourceName}
                    data-fieldname={dataFieldName}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {showEditButton && (
                            <IconButton
                              size="small"
                              onClick={handleEditClick}
                              sx={{
                                padding: '4px',
                                marginRight: '8px',
                              }}
                              disabled={disabledForEdit}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                          {icon && (
                            <span
                              style={INPUT_FIELD_STYLE}
                            >
                              {icon}
                            </span>
                          )}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )
              }}
              getOptionKey={(option) => getOptionsLableForEdit(option)}
            />
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <StyledTextField
              placeholder={placeholder}
              fullWidth
              value={value}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) =>
                (onChange as (value: string) => void)(e.target.value)
              }
              id={labelToId(label)}
              error={!!error}
              type={type}
              slotProps={{
                htmlInput: {
                  'data-sourcename': dataSourceName,
                  'data-fieldname': dataFieldName,
                  'maxLength': maxLength,
                },
              }}
              InputProps={{
                endAdornment: (
                  <>
                    {showEditButton && (
                      <IconButton
                        size="small"
                        onClick={handleEditClick}
                        sx={{
                          padding: '4px',
                          marginRight: '8px',
                        }}
                        disabled={disabledForEdit}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    {endAdornment}
                  </>
                ),
              }}
              disabled={disabledForEdit}
            />
          </Box>
        )}

        {error && <ErrorText>{error}</ErrorText>}
      </InputContainer>

  )
}

export default InputFieldWithEdit
