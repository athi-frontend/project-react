'use client'
import React, { useState, useEffect } from 'react'
import {
  MenuItemType,
  MainContentComponentProps,
} from '@/types/modules/dnd/functionalBlock'
import { InputField, Description } from '@/components/ui'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import {
  HeaderSection,
  ContentWrapper,
  ContentContainer,
  HeaderContent,
  HeaderTitle,
  FormSection,
  FormContent,
  FormFields,
  FormFieldContainer,
  DescriptionContainer,
  DescriptionContent,
  ButtonContainer,
} from '@/styles/modules/dnd/functionalBlock'
import { Grid2 } from '@mui/material'
import { FIELD_LABEL_MAP, FIELD_ORDER, FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'
import { useParams } from 'next/navigation'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
/**
      *Classification : Confidential
**/
const { GENERAL, FORMTITLES, ERRORS, INPUTFIELDS } =
  FUNCTIONAL_BLOCK_CONSTANTS

const MainContentComponent: React.FC<MainContentComponentProps> = ({
  onSave,
  onCancel,
  editingItem,
  action_control,
  isLoading,
  taskComments,
  reviewerList,
  blockTitle = '',
  onPermissionChange
}) => {
  const [title, setTitle] = useState<string>(GENERAL.EMPTY_STRING)
  const [description, setDescription] = useState<string>(GENERAL.EMPTY_STRING)
  const [titleError, setTitleError] = useState<string>(GENERAL.EMPTY_STRING)
  const [descriptionError, setDescriptionError] = useState<string>(
    GENERAL.EMPTY_STRING
  )
  const [formTitle, setFormTitle] = useState<string>(
    FORMTITLES.FORM_TITLE_ADD_NEW_ITEM(blockTitle)
  )
  const [hasEditPermission, setHasEditPermission] = useState(true)
  const params = useParams()
  const projectId = Number(params.id)
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.name ?? GENERAL.EMPTY_STRING)
      setDescription(editingItem.description ?? GENERAL.EMPTY_STRING)
      setFormTitle(
        editingItem.type === MenuItemType.MAIN
          ? FORMTITLES.FORM_TITLE_EDIT_MAIN_BLOCK(blockTitle)
          : FORMTITLES.FORM_TITLE_EDIT_SUB_BLOCK(blockTitle)
      )
    } else {
      setTitle(GENERAL.EMPTY_STRING)
      setDescription(GENERAL.EMPTY_STRING)
      setFormTitle(FORMTITLES.FORM_TITLE_ADD_NEW_ITEM(blockTitle))
    }
  }, [editingItem, blockTitle])

  const handleTitleChange = (value: string | string[]) => {
    const newTitle = Array.isArray(value)
      ? (value[0] ?? GENERAL.EMPTY_STRING)
      : value
    setTitle(newTitle)
    /**
     * Function Name: 
     * Params: 
     * Description: Clear title error when user starts typing,
     * Author: Madhumitha,
     * Created: 23-08-2025,
      *Modified:
      *Classification : Confidential
**/ 
    if (titleError) {
      setTitleError(GENERAL.EMPTY_STRING)
    }
  }

  const handleDescriptionChange = (value: string | string[]) => {
    const newDescription = Array.isArray(value)
      ? (value[0] ?? GENERAL.EMPTY_STRING)
      : value
    setDescription(newDescription)

    /**
     * Function Name: 
     * Params: 
     * Description: Clear description error when user starts typing,
     * Author: Madhumitha,
     * Created: 23-08-2025,
      *Modified:
      *Classification : Confidential
**/  
    if (descriptionError) {
      setDescriptionError(GENERAL.EMPTY_STRING)
    }
  }

  const handleSave = () => {
    let isValid = true

    if (!title.trim()) {
      setTitleError(ERRORS.ERROR_TITLE_REQUIRED)
      isValid = false
    } else {
      setTitleError(GENERAL.EMPTY_STRING)
    }

    if (!description.trim()) {
      setDescriptionError(ERRORS.ERROR_DESCRIPTION_REQUIRED)
      isValid = false
    } else {
      setDescriptionError(GENERAL.EMPTY_STRING)
    }

    if (!isValid) {
      // Use validateAndFocusFirstEmptyField for focus management
      const formData = { title, description }
      validateAndFocusFirstEmptyField(formData, FIELD_ORDER, FIELD_LABEL_MAP)
      return
    }

    // Only call onSave if validation passes
      onSave(title, description, editingItem)
      setTitle(GENERAL.EMPTY_STRING)
      setDescription(GENERAL.EMPTY_STRING)
  }


  return (
    <ContentContainer>
      <ContentWrapper>
        <HeaderSection>
          <HeaderContent>
            <HeaderTitle>{formTitle}</HeaderTitle>
          </HeaderContent>
        </HeaderSection>
        <FormSection >
          <FormContent>
            <FormFields sx={{pointerEvents: !hasEditPermission ? 'none' : 'auto'}}>
              <FormFieldContainer>
                <Grid2 size={{ md: 8 }}>
                  <InputField
                    label={INPUTFIELDS.INPUT_LABEL_TITLE}
                    placeholder={INPUTFIELDS.INPUT_PLACEHOLDER_TITLE}
                    value={title}
                    onChange={handleTitleChange}
                    error={titleError}
                  />
                </Grid2>
                <Grid2 size={{ md: 8 }}>
                  <DescriptionContainer>
                    <DescriptionContent>
                      <Description
                        label={INPUTFIELDS.INPUT_LABEL_DESCRIPTION}
                        placeholder={INPUTFIELDS.INPUT_PLACEHOLDER_DESCRIPTION}
                        value={description}
                        onChange={handleDescriptionChange}
                        error={descriptionError}
                      />
                    </DescriptionContent>
                  </DescriptionContainer>
                </Grid2>
                
              </FormFieldContainer>
            </FormFields>
            <FormFieldContainer>
            <CommentsHistory
              comments={taskComments ?? []}
            />
            </FormFieldContainer>
            <ButtonContainer>
                  <ReviewerModalManager 
                    isLoading={isLoading}
                    permissions={action_control?.permissions ?? []}
                    projectId={projectId}
                    menuName={action_control?.formName}
                    menuId={action_control?.menuId}
                    onPermissionChange={(hasPermission) => {
                      setHasEditPermission(hasPermission)
                      onPermissionChange?.(hasPermission)
                    }}
                    customHandlers={{
                      handleSave,
                      handleCancel: onCancel,
                    }}
                    reviewerList={reviewerList}
                  />
              </ButtonContainer>  
          </FormContent>
        </FormSection>
       
      </ContentWrapper>
    </ContentContainer>
  )
}

export default MainContentComponent
