/**
 * Classification: Confidential
 */
'use client'
import React, { useState } from 'react'
import { Box, useTheme, IconButton } from '@mui/material'
import { Add, Minus } from 'iconsax-react'
import { DataTable, ActionButton } from '@/components/ui'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'
import { TEAM_DETAILS_TABLE } from '@/constants/modules/quality-control-management/formTeam'
import {
  TeamMember,
  TeamGroup,
  ExpandableTeamTableProps,
} from '@/types/modules/quality-control-management/formTeam'
import {
  QCFormTeamIconStyles,
  QCFormTeamAddNewButtonStyles,
  QCFormTeamTableContainerStyles,
  QCFormTeamAddNewButtonContainerStyles,
  QCFormTeamDataTableWrapperStyles,
  QCFormTeamIconButtonStyles,
  QCFormTeamSnoTextStyles,
} from '@/styles/modules/quality-control-management/formTeam'

const ExpandableTeamTable: React.FC<ExpandableTeamTableProps> = ({
  groups,
  onEditMember,
  onDeleteMember,
  onAddNew,
}) => {
  const theme = useTheme()
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())

  const toggleGroup = (groupId: number): void => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  // Transform groups into flat data for DataTable with nested rows
  const tableRows = groups.flatMap((group: TeamGroup, groupIndex: number) => {
    const isGroupExpanded = expandedGroups.has(group.id)
    return [
      {
        id: `${TEAM_DETAILS_TABLE.ID_PREFIX.GROUP}${group.id}`,
        isGroup: true,
        groupId: group.id,
        groupIndex,
        category: group.category,
        isExpanded: isGroupExpanded,
        expandedMarker: isGroupExpanded
          ? TEAM_DETAILS_TABLE.EXPANDED_MARKERS.EXPANDED
          : TEAM_DETAILS_TABLE.EXPANDED_MARKERS.COLLAPSED,
      },
      ...(isGroupExpanded
        ? group.members.map((member: TeamMember, memberIndex: number) => ({
            id: member.id,
            isGroup: false,
            groupId: group.id,
            isMemberRow: true,
            sno: String(memberIndex + NUMBERMAP.ONE).padStart(TEAM_DETAILS_TABLE.PADDING.PADDING_LENGTH, TEAM_DETAILS_TABLE.PADDING.ZERO_PADDING),
            category: member.skillRequired,
            resource: member.resource,
            responsibility: member.responsibility,
            status: member.statusValue,
            statusValue: member.statusValue, // Pass status value for delete disable
            member: member.memberData ?? member,
          }))
        : []),
    ]
  })

  const columns: GridColDef[] = [
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.ACTION,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.SNO,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.SNO,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return (
            <Box
              sx={QCFormTeamIconStyles}
              onClick={() => toggleGroup(params.row.groupId)}
            >
              <IconButton
                size="small"
                sx={QCFormTeamIconButtonStyles}
              >
                {params.row.isExpanded ? (
                  <Minus size={NUMBERMAP.TWENTY} color={theme.palette.text.primary} />
                ) : (
                  <Add size={NUMBERMAP.TWENTY} color={theme.palette.text.primary} />
                )}
              </IconButton>
              <Box component="span" sx={QCFormTeamSnoTextStyles}>
                {String(params.row.groupIndex + NUMBERMAP.ONE).padStart(TEAM_DETAILS_TABLE.PADDING.PADDING_LENGTH, TEAM_DETAILS_TABLE.PADDING.ZERO_PADDING)}
              </Box>
            </Box>
          )
        }
        return params.row.sno
      },
    },
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.CATEGORY,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.SKILL_REQUIRED,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.SKILL_REQUIRED,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return params.row.category
        }
        return params.row.category
      },
    },
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.RESOURCE,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.RESOURCE,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.RESOURCE,
      sortable: false,
      filterable: false,
    },
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.RESPONSIBILITY,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.RESPONSIBILITY,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.RESPONSIBILITY,
      sortable: false,
      filterable: false,
    },
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.STATUS,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.STATUS,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.STATUS,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return null
        }
        const statusValue = params.row.statusValue ?? NUMBERMAP.ONE
        
        return (
          <StatusTypography value={statusValue} />
        )
      },
    },
    {
      field: TEAM_DETAILS_TABLE.COLUMN_FIELDS.ACTIONS,
      headerName: TEAM_DETAILS_TABLE.COLUMNS.ACTIONS,
      flex: TEAM_DETAILS_TABLE.COLUMN_FLEX.ACTIONS,
      renderCell: (params: GridRenderCellParams) => {
        if (params.row.isGroup) {
          return null
        }
        return (
          <ActionButton
            onEdit={() => onEditMember(params.row.member ?? params.row)}
            onDelete={() => onDeleteMember(params.row.id)}
            deleteDisabled={params.row.statusValue === NUMBERMAP.TWO}
          />
        )
      },
    },
  ]

  return (
    <Box sx={QCFormTeamTableContainerStyles}>
      {onAddNew && (
        <Box sx={QCFormTeamAddNewButtonContainerStyles}>
          <Box
            onClick={onAddNew}
            sx={QCFormTeamAddNewButtonStyles}
          >
            
            {TEAM_DETAILS_TABLE.BUTTON_TEXT.ADD_NEW}
          </Box>
        </Box>
      )}

      <Box sx={QCFormTeamDataTableWrapperStyles}>
        <DataTable
          rows={tableRows}
          columns={columns}
          IdField="id"
          customClassName={TEAM_DETAILS_TABLE.CUSTOM_CLASS_NAME}
        />
      </Box>
    </Box>
  )
}

export default ExpandableTeamTable
