import React from 'react'
import CustomListbox from './CustomListbox'
import { TagOption } from './fileUploadTypes'

interface CreateListboxProps {
  inputValue: string
  filteredTagOptions: TagOption[][]
  tagOptionsRows: TagOption[][]
  value: string[]
  onTagSelect: (tag: TagOption) => void
  onCreateNewTag: (input: string) => void
  valueField: string
  keyField: string
}

export const createCustomListboxComponent = ({
  inputValue,
  filteredTagOptions,
  tagOptionsRows,
  value,
  onTagSelect,
  onCreateNewTag,
  valueField,
  keyField,
}: CreateListboxProps) => {
  const Component = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLElement>
  >(function CustomListboxSlot(props, ref) {
    return (
      <CustomListbox
        {...props}
        ref={ref}
        inputValue={inputValue}
        filteredTagOptions={filteredTagOptions}
        tagOptionsRows={tagOptionsRows}
        value={value}
        onTagSelect={onTagSelect}
        onCreateNewTag={onCreateNewTag}
        valueField={valueField}
        keyField={keyField}
      />
    )
  })
  return Component
}
