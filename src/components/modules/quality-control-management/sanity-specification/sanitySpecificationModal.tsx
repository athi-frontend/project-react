'use client'
import React, { useMemo } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, Description } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { NUMBERMAP } from '@/constants/common'
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  DROPDOWN_FIELDS,
  MODAL_TITLES,
  MODAL_FORM_NAMES,
} from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'
import { SanitySpecificationModalProps } from '@/types/modules/quality-control-management/sanitySpecificationChecklist'
import { MODAL_STYLES } from '@/styles/modules/dnd/verification'

/**
 * Classification: Confidential
 */

const SanitySpecificationModal: React.FC<SanitySpecificationModalProps> = ({
  open,
  onClose,
  onSave,
  editingParentGroup = null,
  specForm,
  specErrors = { group_name_id: '', specification: '', status_id: '' },
  onSpecFormChange,
  groupsData = [],
}) => {
  const { data: statusOptions } = useOrganizationStatus()
  // Transform groups data to match the expected format
  const groupOptionsArray = Array.isArray(groupsData) ? groupsData : (groupsData?.data ?? [])

  // Resolve group_name_id value: if it's a custom name, find the matching group_id, otherwise use as-is
  // For custom groups, when group_name_id is empty, use group_name as the value
  const resolvedGroupNameId = useMemo(() => {
    // If group_name_id is empty but group_name exists, it's a custom group - use group_name as value
    if (!specForm?.group_name_id && specForm?.group_name) {
      return specForm.group_name;
    }
    
    if (!specForm?.group_name_id || !groupOptionsArray.length) {
      return specForm?.group_name_id ?? '';
    }
    
    const groupKeyField = DROPDOWN_FIELDS.GROUP_NAME.KEY_FIELD;
    const groupValueField = DROPDOWN_FIELDS.GROUP_NAME.VALUE_FIELD;
    
    // Check if it's already a valid group_id
    const numericId = Number(specForm.group_name_id);
    if (!isNaN(numericId) && groupOptionsArray.some(
      (group) => group[groupKeyField]?.toString() === numericId.toString()
    )) {
      return specForm.group_name_id;
    }
    
    // Check if it matches a group_name (custom name)
    const matchedGroup = groupOptionsArray.find(
      (group) => group[groupValueField]?.toString() === specForm.group_name_id.toString()
    );
    
    if (matchedGroup) {
      return matchedGroup[groupKeyField]?.toString() ?? specForm.group_name_id;
    }
    
    // It's a truly custom/new group name, keep as-is
    return specForm.group_name_id;
  }, [specForm?.group_name_id, specForm?.group_name, groupOptionsArray]);

  // Enhance group options to include custom value if it's not in the fetched options
  const enhancedGroupOptions = useMemo(() => {
    const options = [...groupOptionsArray];
    
    // If we have a resolvedGroupNameId value that's not in the options (custom value), add it
    if (resolvedGroupNameId && resolvedGroupNameId.trim() !== '') {
      const groupKeyField = DROPDOWN_FIELDS.GROUP_NAME.KEY_FIELD;
      const groupValueField = DROPDOWN_FIELDS.GROUP_NAME.VALUE_FIELD;
      
      const valueExists = options.some(
        (option) => option[groupKeyField]?.toString() === resolvedGroupNameId.toString() ||
                        option[groupValueField]?.toString() === resolvedGroupNameId.toString()
      );
      
      if (!valueExists) {
        // Add the custom value to options so it can be displayed
        // For custom values, use the value itself as both key and value
        // Use group_name if available, otherwise use resolvedGroupNameId
        const displayValue = specForm?.group_name ?? resolvedGroupNameId;
        options.push({
          [groupKeyField]: resolvedGroupNameId,
          [groupValueField]: displayValue,
        });
      }
    }
    
    return options;
  }, [groupOptionsArray, resolvedGroupNameId, specForm?.group_name]);

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      onSave={onSave}
      title={MODAL_TITLES.ADD_SPECIFICATION}
      buttonRequired
    >
      <Grid2 container spacing={NUMBERMAP.TWO} sx={MODAL_STYLES.scrollableContainer}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.GROUP_NAME}
            placeholder={FORM_PLACEHOLDERS.GROUP_NAME}
            isDropdown
            options={enhancedGroupOptions}
            value={resolvedGroupNameId}
            onChange={(value: string) => {
              // When group is selected, also update group_name
              const selectedGroup = enhancedGroupOptions.find(
                (g) => String(g[DROPDOWN_FIELDS.GROUP_NAME.KEY_FIELD]) === value
              )
              onSpecFormChange(MODAL_FORM_NAMES.GROUP_ID, value)
              if (selectedGroup) {
                onSpecFormChange(
                  MODAL_FORM_NAMES.GROUP_NAME,
                  selectedGroup[DROPDOWN_FIELDS.GROUP_NAME.VALUE_FIELD]
                )
              } else {
                // For custom values, use the value itself as the group_name
                onSpecFormChange(
                  MODAL_FORM_NAMES.GROUP_NAME,
                  value
                )
              }
            }}
            error={specErrors?.group_name_id ?? ''}
            keyField={DROPDOWN_FIELDS.GROUP_NAME.KEY_FIELD}
            valueField={DROPDOWN_FIELDS.GROUP_NAME.VALUE_FIELD}
            disabled={editingParentGroup}
            customOption={true}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={FORM_LABELS.SPECIFICATION}
            placeholder={FORM_PLACEHOLDERS.SPECIFICATION}
            value={specForm?.specification ?? ''}
            onChange={(value: string) =>
              onSpecFormChange(MODAL_FORM_NAMES.SPECIFICATION, value)
            }
            error={specErrors?.specification ?? ''}
            // disabled={}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.STATUS}
            placeholder={FORM_PLACEHOLDERS.STATUS}
            isDropdown
            options={statusOptions?.data ?? []}
            value={specForm?.status_id ?? ''}
            onChange={(value: string) =>
              onSpecFormChange(MODAL_FORM_NAMES.STATUS_ID, value)
            }
            error={specErrors?.status_id ?? ''}
            keyField={DROPDOWN_FIELDS.STATUS.KEY_FIELD}
            valueField={DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default SanitySpecificationModal
