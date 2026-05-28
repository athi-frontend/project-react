'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { TagType } from '../file-upload-v2/TagItem'
import {
  CustomPopper,
  CustomPaper,
  SearchInfoMessage,
  NoResultsMessage,
} from '../../../styles/components/ui/fileUploadStyles'
import { TagsRow ,InlineStylesCustomBox,ListboxContainer} from '@/styles/components/ui/fileUploadManagerV3'



export const CustomPopperComponent = (props: any) => {
  return <CustomPopper {...props} placement="bottom-start" />
}

export const CustomPaperComponent = (props: any) => {
  return <CustomPaper {...props} />
}

interface CustomListboxProps {
  inputValue: string
  tagOptions: TagType[][]
  filteredTagOptions: TagType[][]
  selectedTags: TagType[]
  handleTagSelect: (tag: TagType) => void
  renderTagRows: (
    rows: TagType[][],
    selectedTags: TagType[],
    handleTagSelect: (tag: TagType) => void
  ) => React.ReactNode
  renderCreateNewTag: (
    inputValue: string,
    selectedTags: TagType[],
    setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    createNewTag: (input: string) => TagType
  ) => React.ReactNode
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  createNewTag: (input: string) => TagType
}

export const createCustomListboxSlot = (props: CustomListboxProps) => {
  const {
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
  } = props

  return function CustomListbox(
    listboxProps: React.HTMLAttributes<HTMLElement>
  ) {
    const { children, ...other } = listboxProps

    const showCreateOption =
      inputValue.trim() !== '' &&
      !tagOptions
        .flat()
        .some((tag) => tag.tag_name.toLowerCase() === inputValue.toLowerCase())

    let contentToRender

    if (filteredTagOptions.length > 0) {
      contentToRender = renderTagRows(
        filteredTagOptions,
        selectedTags,
        handleTagSelect
      )
    } else if (inputValue.trim() === '') {
      contentToRender = renderTagRows(tagOptions, selectedTags, handleTagSelect)
    } else {
      contentToRender = (
        <NoResultsMessage>No matching tags found</NoResultsMessage>
      )
    }

    return (
      <ListboxContainer {...other}>
        {inputValue.trim() !== '' && (
          <SearchInfoMessage>
            {filteredTagOptions.length > 0
              ? 'Click on a tag to select it'
              : 'No matching tags found'}
          </SearchInfoMessage>
        )}

        {contentToRender}

        {showCreateOption &&
          renderCreateNewTag(
            inputValue,
            selectedTags,
            setSelectedTags,
            setInputValue,
            createNewTag
          )}
      </ListboxContainer>
    )
  }
}

export const createCustomListboxComponent = (props: {
  inputValue: string
  filteredTagOptions: TagType[][]
  tagOptionsRows: TagType[][]
  value: string[]
  onTagSelect: (tag: TagType) => void
  onCreateNewTag: (input: string) => void
  valueField: string
  keyField: string
}) => {
  const {
    inputValue,
    filteredTagOptions,
    tagOptionsRows,
    value,
    onTagSelect,
    onCreateNewTag,
    valueField,
    keyField,
  } = props

  const renderTag = (
    tag: any,
    keyField: string,
    valueField: string,
    value: any[],
    onTagSelect: (tag: any) => void
  ) => {
    const isSelected = value.includes(tag[keyField])

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      onTagSelect(tag)
    }

    return (
      <Box key={tag[keyField]} onClick={handleClick} sx={InlineStylesCustomBox.outerBox(isSelected)}>
        <Box sx={InlineStylesCustomBox.innerBox}>{tag[valueField]}</Box>
      </Box>
    )
  }

  return function CustomListbox(
    listboxProps: React.HTMLAttributes<HTMLElement>
  ) {
    const { children, ...other } = listboxProps

    const showCreateOption =
      inputValue.trim() !== '' &&
      !tagOptionsRows
        .flat()
        .some(
          (tag: any) =>
            tag[valueField].toLowerCase() === inputValue.toLowerCase()
        )

    let renderedContent

    if (filteredTagOptions.length > 0) {
      renderedContent = filteredTagOptions.map((row) => (
        <TagsRow key={JSON.stringify(row)}>
          {row.map((tag: any) =>
            renderTag(tag, keyField, valueField, value, onTagSelect)
          )}
        </TagsRow>
      ))
    } else if (inputValue.trim() === '') {
      renderedContent = tagOptionsRows.map((row) => (
        <TagsRow key={JSON.stringify(row)}>
          {row.map((tag: any) =>
            renderTag(tag, keyField, valueField, value, onTagSelect)
          )}
        </TagsRow>
      ))
    } else {
      renderedContent = (
        <NoResultsMessage>No matching tags found</NoResultsMessage>
      )
    }

    return (
      <ListboxContainer {...other}>
        {inputValue.trim() !== '' && (
          <SearchInfoMessage>
            {filteredTagOptions.length > 0
              ? 'Click on a tag to select it'
              : 'No matching tags found'}
          </SearchInfoMessage>
        )}

        {renderedContent}

        {showCreateOption && (
          <Box
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCreateNewTag(inputValue)
            }}
            sx={InlineStylesCustomBox.createTagBox}
          >
            <Typography>+ Create tag "{inputValue}"</Typography>
          </Box>
        )}
      </ListboxContainer>
    )
  }
}
