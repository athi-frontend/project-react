import {
  CustomPopper,
  CustomPaper,
  SearchInfoMessage,
  NoResultsMessage,
} from '../../../styles/components/ui/fileUploadStyles'
import { PopperProps } from '@mui/material/Popper'
import { PaperProps } from '@mui/material/Paper'
import React from 'react'

export const CustomPopperComponent = (props: PopperProps) => {
  return <CustomPopper {...props} placement="bottom-start" />
}

export const CustomPaperComponent = (props: PaperProps) => {
  return <CustomPaper {...props} />
}

interface CustomListboxProps extends React.HTMLAttributes<HTMLDivElement> {
  inputValue: string
  filteredTagOptions: TagOption[][]
  tagOptions: TagOption[][]
  selectedTags: TagOption[]
  handleTagSelect: (tag: TagOption) => void
  renderTagRows: (
    rows: TagOption[][],
    selectedTags: TagOption[],
    handleTagSelect: (tag: TagOption) => void
  ) => React.ReactNode
  renderCreateNewTag: (
    inputValue: string,
    selectedTags: TagOption[],
    setSelectedTags: React.Dispatch<React.SetStateAction<TagOption[]>>,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    createNewTag: (input: string) => TagOption
  ) => React.ReactNode
  setSelectedTags: React.Dispatch<React.SetStateAction<TagOption[]>>
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  createNewTag: (input: string) => TagOption
}

export const CustomListboxComponent = React.forwardRef<
  HTMLDivElement,
  CustomListboxProps
>(function CustomListboxComponent(props, ref) {
  const {
    inputValue,
    filteredTagOptions,
    tagOptions,
    selectedTags,
    handleTagSelect,
    renderTagRows,
    renderCreateNewTag,
    setSelectedTags,
    setInputValue,
    createNewTag,
    ...rest
  } = props

  const hasInput = inputValue.trim() !== ''
  const hasFilteredResults = filteredTagOptions.length > 0

  let tagListContent: React.ReactNode

  if (hasInput) {
    tagListContent = hasFilteredResults ? (
      renderTagRows(filteredTagOptions, selectedTags, handleTagSelect)
    ) : (
      <NoResultsMessage>
        No tags found. Type to create a new tag.
      </NoResultsMessage>
    )
  } else {
    tagListContent = renderTagRows(tagOptions, selectedTags, handleTagSelect)
  }

  const showCreateNew = hasInput && !hasFilteredResults

  return (
    <div ref={ref} {...rest}>
      {hasInput && (
        <SearchInfoMessage>
          Showing results for "{inputValue}"
        </SearchInfoMessage>
      )}

      {tagListContent}

      {showCreateNew &&
        renderCreateNewTag(
          inputValue,
          selectedTags,
          setSelectedTags,
          setInputValue,
          createNewTag
        )}
    </div>
  )
})

export const createCustomListboxSlot = ({
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
}: any) => {
  const ListboxSlot = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLElement>
  >(function ListboxSlot(props, ref) {
    return (
      <CustomListboxComponent
        {...props}
        ref={ref}
        inputValue={inputValue}
        tagOptions={tagOptions}
        filteredTagOptions={filteredTagOptions}
        selectedTags={selectedTags}
        handleTagSelect={handleTagSelect}
        renderTagRows={renderTagRows}
        renderCreateNewTag={renderCreateNewTag}
        setSelectedTags={setSelectedTags}
        setInputValue={setInputValue}
        createNewTag={createNewTag}
      />
    )
  })

  return ListboxSlot
}
