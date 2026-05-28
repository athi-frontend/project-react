import React, { useMemo, useState } from 'react'
import { Autocomplete, Popper, Box } from '@mui/material'
import {
  InputContainer,
  InputLabel,
  InputLabelContainer,
  StyledTextField,
} from '@/styles/components/ui/input'
import { InputFieldProps, Member } from '@/types/components/ui/dropDown'
import { ErrorText, FullWidth, INPUT_FIELD_STYLE } from '@/styles/common'
import InfoHover from '../info-hover/InfoHover'
import { labelToId } from '@/lib/utils/formUtils'
import { DropDownIcons, iconstyles, POPPERSTYLE } from '@/styles/components/ui/dropdown'
import { HiddenPopper } from '@/components/shared/HidePopper'
import CustomOptionRow from './CustomOptionRow'
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import CircleIcon from '@mui/icons-material/Circle';
/**
    *Classification : Confidential
**/

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  isDropdown,
  isMultiSelect,
  value,
  onChange,
  error,
  options = [],
  keyField,
  valueField,
  type,
  endAdornment,
  disabled = false,
  dataIsAutocomplete,
  dataSourceName,
  dataFieldName,
  infoText,
  icon,
  maxLength = null,
  hasEditable = false,
  customOption = false,
  customOptionLabel = 'Add custom',
  isCompleted = false,
  customOptionPlaceholder = 'Enter new value'
}) => {
  const [localOptions, setLocalOptions] = useState<any[]>(options)
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [customInputValue, setCustomInputValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const emitSingleChange = (selectedId: string) => {
    (onChange as (value: string) => void)(selectedId)
  }

  // Keep local options in sync when parent options change (guarded)
  const optionsMemoString = useMemo(() => JSON.stringify(options ?? []), [options])
  React.useEffect(() => {
    try {
      const parsed = JSON.parse(optionsMemoString)
      setLocalOptions(parsed)
    } catch {
      // no-op
    }
  }, [optionsMemoString])

  const computedOptions = useMemo(() => {
    if (customOption && !isMultiSelect) {
      return [...localOptions, { __isAddNew__: true }]
    }
    return localOptions
  }, [customOption, isMultiSelect, localOptions])

  const handleSaveCustom = (trimmed: string) => {
    if (!keyField || !valueField) return
    if (trimmed.length === 0) return
    const newItem: any = {
      [keyField]: trimmed,
      [valueField]: trimmed,
    }
    const nextOptions = [...localOptions, newItem]
    setLocalOptions(nextOptions)
    setIsAddingCustom(false)
    setCustomInputValue('')
    emitSingleChange(String(newItem[keyField as string]))
    setDropdownOpen(false)
  }

  const handleCancelCustom = () => {
    setIsAddingCustom(false)
    setCustomInputValue('')
  }

  const getSelectedOptions = () => {
    if (!keyField || !valueField) {
      return isMultiSelect ? [] : null
    }

    if (isMultiSelect) {
      const selected = (value as string[])
        .map((id) =>
          localOptions.find((option) => String(option[keyField]) === String(id))
        )
        .filter((option) => option !== undefined) as Member[]
      return selected
    } else {
      const selected = value
        ? localOptions.find((option) => String(option[keyField]) === String(value))
        : null
      return selected ?? null
    }
  }

  const getOptionsLable = (option: any) => {
    if ((option).__isAddNew__) return ''
    return String(option[valueField as keyof typeof option] ?? '')
  }
  const renderLabel = (option, restProps) => {
    if (isCompleted) {
      return (
        <Box key={keyField ? option[keyField as string] : JSON.stringify(option)} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <li key={keyField ? option[keyField as string] : JSON.stringify(option)} {...restProps} style={FullWidth}>
            {String(valueField ? option[valueField as string] : '')}
          </li>
          <CircleIcon sx={{ ...iconstyles, color: option['is_completed'] ? 'text.secondary' : 'text.default' }} />
          <DomainVerificationIcon sx={{ ...iconstyles, color: option['is_completed'] ? 'text.default' : 'text.disabled' }} />
        </Box>
      )
    }
    return (
      <li key={keyField ? option[keyField as string] : JSON.stringify(option)} {...restProps} style={FullWidth}>
        {String(valueField ? option[valueField as string] : '')}
      </li>
    )
  }
  return (
    <InputContainer>
      <InputLabelContainer>
        <InputLabel>{label}</InputLabel>
        {infoText && (
          <InfoHover infoText={String(infoText)} />
        )}
      </InputLabelContainer>

      {isDropdown || isMultiSelect ? (
        <Autocomplete
          id={labelToId(label)}
          disabled={disabled}
          multiple={isMultiSelect}
          slots={{
            popper: hasEditable ? HiddenPopper : Popper,
          }}
          disableClearable={hasEditable}
          options={computedOptions}
          disableCloseOnSelect={isAddingCustom}
          slotProps={{
            paper: {
              sx: POPPERSTYLE,
            },
          }}
          sx={DropDownIcons}
          open={dropdownOpen ?? isAddingCustom}
          onOpen={() => setDropdownOpen(true)}
          onClose={(event, reason) => {
            if (isAddingCustom) return
            setDropdownOpen(false)
          }}
          isOptionEqualToValue={(option, value) => {
            if ((option).__isAddNew__ || (value).__isAddNew__) return false
            return (
              option[keyField as keyof typeof option] ===
              value[keyField as keyof typeof option]
            )
          }}
          getOptionLabel={(option: any) => {
            if ((option).__isAddNew__) return ''
            return String(option[valueField as keyof typeof option] ?? '')
          }}
          value={getSelectedOptions()}
          onChange={(_, newValue) => {
            if (!keyField) return;

            if (isMultiSelect) {
              const selectedValues = (newValue as Member[]).map((item: any) =>
                String(item[keyField])
              );
              (onChange as (value: string[]) => void)(selectedValues);
            } else {
              const selectedValue = newValue ? String(newValue[keyField]) : '';
              (onChange as (value: string) => void)(selectedValue);
              if (!isAddingCustom) setDropdownOpen(false)
            }
          }}
          getOptionDisabled={(option) => option.disabled}
          renderOption={(props, option) => {
            // Custom "Add new" row
            if ((option).__isAddNew__) {
              return (
                <CustomOptionRow
                  key="custom-option-row"
                  placeholder={customOptionPlaceholder}
                  customInputValue={customInputValue}
                  setCustomInputValue={setCustomInputValue}
                  isAddingCustom={isAddingCustom}
                  setIsAddingCustom={(v) => {
                    setIsAddingCustom(v)
                    if (v) setDropdownOpen(true)
                  }}
                  customOptionLabel={customOptionLabel}
                  onSave={handleSaveCustom}
                  onCancel={handleCancelCustom}
                />
              )
            }
            const { key, ...restProps } = props
            return renderLabel(option,restProps)
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
          getOptionKey={(option) => getOptionsLable(option)}
        />
      ) : (
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
          InputProps={{ endAdornment }}
          disabled={disabled}
        />
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  )
}

export default InputField
