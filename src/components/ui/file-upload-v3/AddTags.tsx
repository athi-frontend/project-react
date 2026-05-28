'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Chip, TextField } from '@mui/material'
import TagItem, { TagType } from '../file-upload-v2/TagItem'

import {
  createCustomListboxSlot,
  CustomPaperComponent,
  CustomPopperComponent,
} from './CustomBox'
import {
  InputContainer,
  InputLabel,
  StyledAutocomplete,
  TagsContainer2,
  InlineStyles,
  TagsRow
} from '@/styles/components/ui/fileUploadManagerV3'
import { NUMBERMAP } from '@/constants/common'

// Inline styles moved to the top


const TagBox = ({
  tag,
  isSelected,
  onSelect,
}: {
  tag: TagType
  isSelected: boolean
  onSelect: (tag: TagType) => void
}) => (
  <Box
    key={tag.tag_id}
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      onSelect(tag)
    }}
    sx={InlineStyles.tagBox(isSelected)}
  >
    <TagItem tag={tag} />
  </Box>
)

const renderTagRows = (
  rows: TagType[][],
  selectedTags: TagType[],
  handleTagSelect: (tag: TagType) => void
) => {
  return rows.map((row) => (
    <TagsRow key={JSON.stringify(row)}>
      {row.map((tag) => {
        const isSelected = selectedTags.some(
          (selectedTag) => selectedTag.tag_id === tag.tag_id
        )
        return (
          <TagBox
            key={tag.tag_id}
            tag={tag}
            isSelected={isSelected}
            onSelect={handleTagSelect}
          />
        )
      })}
    </TagsRow>
  ))
}

const renderCreateNewTag = (
  inputValue: string,
  selectedTags: TagType[],
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  createNewTag: (input: string) => TagType
) => (
  <Box
    onClick={(e) => {
      e.preventDefault()
      e.stopPropagation()
      const newTag = createNewTag(inputValue)
      setSelectedTags([...selectedTags, newTag])
      setInputValue('')
    }}
    sx={InlineStyles.createTagBox}
  >
    <Typography>+ Create tag "{inputValue}"</Typography>
  </Box>
)

const AddTags: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<TagType[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filteredTagOptions, setFilteredTagOptions] = useState<TagType[][]>([])

  const tagOptions = useMemo(() => [], [])

  const flattenedTagOptions = useMemo(() => tagOptions.flat(), [tagOptions])

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredTagOptions([...tagOptions])
      return
    }

    const matchingTags = flattenedTagOptions.filter((tag) =>
      tag.tag_name.toLowerCase().includes(inputValue.toLowerCase())
    )

    if (matchingTags.length === 0) {
      setFilteredTagOptions([])
      return
    }

    const groupedTags: TagType[][] = []
    for (let i = 0; i < matchingTags.length; i += NUMBERMAP.FOUR) {
      groupedTags.push(matchingTags.slice(i, i + NUMBERMAP.FOUR))
    }

    setFilteredTagOptions(groupedTags)
  }, [inputValue, tagOptions, flattenedTagOptions])

  const handleAutocompleteChange = (
    _event: React.SyntheticEvent,
    newTags: TagType[]
  ) => {
    setSelectedTags(newTags)
  }

  const handleTagSelect = (tag: TagType) => {
    const isSelected = selectedTags.some(
      (selectedTag) => selectedTag.tag_id === tag.tag_id
    )

    if (isSelected) {
      setSelectedTags(
        selectedTags.filter((selectedTag) => selectedTag.tag_id !== tag.tag_id)
      )
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const createNewTag = (inputValue: string): TagType => ({
    tag_id: `new-${Date.now()}`,
    tag_name: inputValue,
  })

  const filterOptions = useMemo(() => {
    return (options: TagType[], params: { inputValue: string }) => {
      const isExisting = options.some(
        (option) =>
          option.tag_name.toLowerCase() === params.inputValue.toLowerCase()
      )

      if (params.inputValue !== '' && !isExisting) {
        return [...options, createNewTag(params.inputValue)]
      }

      return options
    }
  }, [])
  const CustomListboxSlot = createCustomListboxSlot({
    inputValue,
    tagOptions,
    filteredTagOptions,
    selectedTags,
    handleTagSelect,
    renderTagRows,
    renderCreateNewTag,
    setSelectedTags,
    setInputValue,
    createNewTag,
  })
  return (
    <TagsContainer2>
      <InputContainer>
        <InputLabel>Add Tags*</InputLabel>
        <StyledAutocomplete
          multiple
          options={flattenedTagOptions}
          value={selectedTags}
          onChange={handleAutocompleteChange}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
          getOptionLabel={(option) => option.tag_name}
          isOptionEqualToValue={(option, value) =>
            option.tag_id === value.tag_id
          }
          freeSolo
          PopperComponent={CustomPopperComponent}
          PaperComponent={CustomPaperComponent}
          renderOption={() => null}
          filterOptions={filterOptions}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.tag_name}
                {...getTagProps({ index })}
                key={option.tag_id}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Add your Tags here"
              variant="outlined"
            />
          )}
          slots={{
            listbox: CustomListboxSlot,
          }}
        />
      </InputContainer>
    </TagsContainer2>
  )
}

export default AddTags
