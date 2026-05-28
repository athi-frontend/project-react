'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  TextField,
  Modal,
  IconButton,
  Chip,
  Box,
  Typography,
  Tooltip,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import {
  TagsContainer,
  InputContainer,
  InputLabel,
  StyledAutocomplete,
  TagsRow,
  ModalTagItem,
  TagsEnterKey,
  ErrorText,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  EllipsisChip,
} from '../../../styles/components/ui/fileUploadStyles'
import { CloseButton, CloseButtonWrapper } from '@/styles/components/ui/button'
import { TagOption, TagsInputProps } from '../file-upload-v2/fileUploadTypes'
import {
  CustomPopperComponent,
  CustomPaperComponent,
} from '../file-upload-v2/CustomPopperWrapper'
import { createCustomListboxComponent } from '../file-upload-v2/CustomListboxComponentWrapper'
import { NUMBERMAP } from '@/constants/common'

const TagsInput: React.FC<TagsInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  options,
  keyField = 'tag_value',
  valueField = 'tag_value',
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filteredTagOptions, setFilteredTagOptions] = useState<TagOption[][]>(
    []
  )

  const tagOptionsRows = useMemo(() => {
    const rows: TagOption[][] = []
    for (let i = 0; i < options.length; i += NUMBERMAP.FOUR) {
      rows.push(options.slice(i, i + NUMBERMAP.FOUR))
    }
    return rows
  }, [options])
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredTagOptions([...tagOptionsRows])
      return
    }
    const matchingTags = options.filter((tag) =>
      tag[valueField]?.toLowerCase().includes(inputValue?.toLowerCase())
    )
    const groupedTags: TagOption[][] = []
    for (let i = 0; i < matchingTags.length; i += NUMBERMAP.FOUR) {
      groupedTags.push(matchingTags.slice(i, i + NUMBERMAP.FOUR))
    }
    setFilteredTagOptions(groupedTags)
  }, [inputValue, options, tagOptionsRows, valueField])

  const selectedTagOptions = useMemo(() => {
    return value.map((tagKey) => {
      const foundTag = options.find((option) => option[keyField] === tagKey)
      if (!foundTag) {
        const fallbackTag: TagOption = {
          [keyField]: tagKey,
          [valueField]: tagKey,
        }
        return fallbackTag
      }
      return foundTag
    })
  }, [value, options, keyField, valueField])
  const handleAutocompleteChange = (
    _: React.SyntheticEvent,
    newTags: TagOption[]
  ) => {
    onChange(newTags.map((tag) => tag[keyField]))
  }

  const createNewTag = (input: string): TagOption => ({
    [keyField]: input,
    [valueField]: input,
  })

  const handleTagSelect = (tag: TagOption) => {
    const isSelected = value.includes(tag[keyField])
    onChange(
      isSelected
        ? value.filter((k) => k !== tag[keyField])
        : [...value, tag[keyField]]
    )
    setInputValue('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === TagsEnterKey.enter) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
  

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const handleRemoveTag = (tagKey: string) => {
    onChange(value.filter((key) => key !== tagKey))
  }

  const filterOptions = useMemo(() => {
    return (opts: unknown[], params: { inputValue: string }) => {
      const typedOpts = opts as TagOption[]
      const exists = typedOpts.some(
        (opt) =>
          opt[valueField]?.toLowerCase() === params.inputValue?.toLowerCase()
      )
      // Also check if the tag already exists in selected values to prevent duplicates
      const alreadySelected = value.some(
        (selectedKey) => selectedKey?.toLowerCase() === params.inputValue?.toLowerCase()
      )
      return params.inputValue !== '' && !exists && !alreadySelected
        ? [...typedOpts, createNewTag(params.inputValue)]
        : typedOpts
    }
  }, [valueField, keyField, value])

  const renderTags = (val: unknown[], getTagProps: any) => {
    const typedVal = val as TagOption[]
    if (typedVal.length <= NUMBERMAP.TWO) {
      return typedVal.map((option, i) => (
        <Chip
          label={option[valueField]}
          {...getTagProps({ index: i })}
          key={option[keyField]}
        />
      ))
    }
    return (
      <>
        <Chip
          label={typedVal[NUMBERMAP.ZERO][valueField]}
          {...getTagProps({ index: NUMBERMAP.ZERO })}
          key={typedVal[NUMBERMAP.ZERO][keyField]}
        />
        <Chip
          label={typedVal[NUMBERMAP.ONE][valueField]}
          {...getTagProps({ index: NUMBERMAP.ONE })}
          key={typedVal[NUMBERMAP.ONE][keyField]}
        />
        <EllipsisChip
          icon={<MoreHorizIcon />}
          label={`+${typedVal.length - NUMBERMAP.TWO}`}
          onClick={(e) => {
            e.stopPropagation()
            handleOpenModal()
          }}
        />
      </>
    )
  }

  const CustomListbox = createCustomListboxComponent({
    inputValue,
    filteredTagOptions,
    tagOptionsRows,
    value,
    onTagSelect: handleTagSelect,
    onCreateNewTag: (input) => {
      // Check if tag already exists (case-insensitive)
      const tagExists = value.some(
        (existingTag) => existingTag?.toLowerCase() === input?.toLowerCase()
      ) ?? options.some(
        (option) => option[valueField]?.toLowerCase() === input?.toLowerCase()
      )
      
      if (!tagExists) {
        const newTag = createNewTag(input)
        onChange([...value, newTag[keyField]])
      }
      setInputValue('')
    },
    valueField,
    keyField,
  })
  return (
    <TagsContainer>
      <InputContainer>
        <InputLabel>{label}</InputLabel>
        <StyledAutocomplete
          multiple
          options={options?.filter((option) => option[valueField] !== null)}
          value={selectedTagOptions}
          onChange={(event: React.SyntheticEvent, value: unknown) =>
            handleAutocompleteChange(event, value as TagOption[])
          }
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          getOptionLabel={(opt) => (opt as TagOption)[valueField]}
          isOptionEqualToValue={(opt, val) => (opt as TagOption)[keyField] === (val as TagOption)[keyField]}
          freeSolo
          filterOptions={filterOptions}
          renderTags={renderTags}
          renderOption={() => null}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              variant="outlined"
              error={!!error}
              onKeyDown={handleKeyDown}
            />
          )}
          slots={{
            listbox: CustomListbox,
            popper: CustomPopperComponent,
            paper: CustomPaperComponent,
          }}
          slotProps={{
            listbox: {
              filteredTagOptions,
              tagOptionsRows,
              value,
              onTagSelect: handleTagSelect,
              onCreateNewTag: (input: string) => {
                // Check if tag already exists (case-insensitive)
                const tagExists = value.some(
                  (existingTag) => existingTag?.toLowerCase() === input?.toLowerCase()
                ) ?? options.some(
                  (option) => option[valueField]?.toLowerCase() === input?.toLowerCase()
                )
                
                if (!tagExists) {
                  const newTag = createNewTag(input)
                  onChange([...value, newTag[keyField]])
                }
                setInputValue('')
              },
              valueField,
              keyField,
            },
          }}
        ></StyledAutocomplete>
        {error && <ErrorText>{error}</ErrorText>}
      </InputContainer>

      {}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>Selected Tags</ModalTitle>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </ModalHeader>
          <Box sx={{ maxHeight: NUMBERMAP.FOURHUNDRED, overflow: 'auto' }}>
            {selectedTagOptions.length ? (
              selectedTagOptions
                .reduce<TagOption[][]>((acc, tag, i) => {
                  const row = Math.floor(i / NUMBERMAP.FOUR)
                  acc[row] = acc[row] ?? []
                  acc[row].push(tag)
                  return acc
                }, [])
                .map((row, i) => (
                  <TagsRow key={JSON.stringify(row)}>
                    {row.map((tag) => (
                      <Tooltip title="Click to remove" key={tag[keyField]}>
                        <Box
                          onClick={() => handleRemoveTag(tag[keyField])}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': { opacity: 0.7 },
                          }}
                        >
                          <ModalTagItem>{tag[valueField]}</ModalTagItem>
                        </Box>
                      </Tooltip>
                    ))}
                  </TagsRow>
                ))
            ) : (
              <Typography>No tags selected</Typography>
            )}
          </Box>
          <CloseButtonWrapper>
            <CloseButton variant="outlined" onClick={handleCloseModal}>
              Close
            </CloseButton>
          </CloseButtonWrapper>
        </ModalContainer>
      </Modal>
    </TagsContainer>
  )
}

export default TagsInput
