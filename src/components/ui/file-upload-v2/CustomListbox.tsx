'use client'
import React from 'react'
import { Box, Typography } from '@mui/material'
import {
  TagsRow,
  TagItem,
  NoResultsMessage,
  SearchInfoMessage,
} from '../../../styles/components/ui/fileUploadStyles'
import { TagOption } from './fileUploadTypes'
import { InlineStyles } from '@/styles/components/ui/fileUploadManagerV3'
import { NUMBERMAP } from '@/constants/common'

/**
      *Classification : Confidential
**/


interface CustomListboxProps {
  inputValue: string
  filteredTagOptions: TagOption[][]
  tagOptionsRows: TagOption[][]
  value: string[]
  valueField: string
  keyField: string
  onTagSelect: (tag: TagOption) => void
  onCreateNewTag: (inputValue: string) => void
}

const CustomListbox = React.forwardRef<HTMLDivElement, CustomListboxProps>(
  (
    {
      inputValue,
      filteredTagOptions,
      tagOptionsRows,
      value,
      onTagSelect,
      onCreateNewTag,
      valueField,
      keyField,
      ...props
    },
    ref
  ) => {

    /**
     * Function Name: CustomListbox
     * Params:inputValue,filteredTagOptions,..
     * Description: Used to filter tags and provide create tag if tags doesn't exists,
     * Author: Velmurugan,
     * Created: 12-09-2025,
     * Classification : Confidential
    **/
    const rowsToDisplay =
      inputValue.trim() !== '' ? filteredTagOptions : tagOptionsRows

    // Check if the input value exactly matches an existing tag
    const allAvailableTags = tagOptionsRows.flat()
    const exactTagMatch = allAvailableTags.some(
      (tag) => tag[valueField]?.toLowerCase() === inputValue?.toLowerCase()
    ) ?? value.some(
      (selectedKey) => selectedKey?.toLowerCase() === inputValue?.toLowerCase()
    )

    let renderedTagRows: React.ReactNode = null

    if (rowsToDisplay.length > NUMBERMAP.ZERO) {
      renderedTagRows = rowsToDisplay.map((row, i) => (
        <TagsRow key={JSON.stringify(row)}>
          {row.map((tag) => {
            const isSelected = value.includes(tag[keyField])
            return (
              <Box
                key={tag[keyField]}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onTagSelect(tag)
                }}
                sx={InlineStyles.tagBox(isSelected)}
              >
                <TagItem>{tag[valueField]}</TagItem>
              </Box>
            )
          })}
        </TagsRow>
      ))
    } else if (inputValue.trim()) {
      renderedTagRows = (
        <NoResultsMessage>
          No tags found. Type to create a new tag.
        </NoResultsMessage>
      )
    }

    const { ownerState, ...filteredProps } = props as any
    return (
      <Box {...filteredProps} ref={ref}>
        {inputValue && (
          <SearchInfoMessage>
            Showing results for "{inputValue}"
          </SearchInfoMessage>
        )}
        {renderedTagRows}
        {inputValue.trim() && !exactTagMatch && (
          <Box
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onCreateNewTag(inputValue)
            }}
            sx={InlineStyles.createTagBox}
          >
            <Typography>+ Create tag "{inputValue}"</Typography>
          </Box>
        )}
      </Box>
    )
  }
)

export default CustomListbox
