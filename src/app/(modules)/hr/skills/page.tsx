'use client'
import React, { useState, useEffect } from 'react'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer } from '@/styles/common'
import AddSkillPopupForm from '@/components/modules/hr/skills/AddSkillsForm'
import { Skill } from '@/types/modules/hr/skill'
import { useFetchAllSkills } from '@/hooks/modules/hr/useSkill'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { magicGridRowSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import {
  ACTIVE,
  ADD,
  EDIT,
  SUCCESS_COLOR,
  ERROR_COLOR,
  PATHNAME,
  SKILL,
  SKILL_COLUMN,
  SKILL_ID,
  FORM_ID,
  DATA_SOURCE_NAME,
  DATA_FIELD_NAME,
  DELETE_DATA_GRID,
  DELETE,
  UPDATE,
  ACTIVE_STATE,
  INACTIVE_STATE,
  DATA_GRID_ROW,
} from '@/constants/modules/hr/skill'
import { FAILED, SUCCESS } from '@/constants/modules/dnd/pnd'
import { NUMBERMAP } from '@/constants/common'
/**
*Classification : Confidential
**/
const SkillsList: React.FC = () => {
  const [skillModal, setSkillModal] = useState(false)
  const [editSkillModal, setEditSkillModal] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
  const { data: skills, isLoading, refetch } = useFetchAllSkills()
  const [tableData, setTableData] = useState<Skill[]>([])
  const [draftSkills, setDraftSkills] = useState<Skill[]>([])
  useEffect(() => {
    if(skills?.data) {
      const tableData = skills.data.map((item: Skill, index: number) => ({
        ...item,
        id: item.skill_id,
        sno: index + NUMBERMAP.ONE,
        status: item.status ?? NUMBERMAP.ZERO,
      }))
      setTableData(tableData)
    }
  }, [skills])
  const handleDelete = async (e: React.MouseEvent, skillId: number) => {
    const currentTarget = e.currentTarget

    const result = await showActionAlert(DELETE)
    if (result.isConfirmed) {
      const currentSkill = tableData.find((skill) => skill.skill_id === skillId)
      const currentStatus =
        currentSkill?.status === ACTIVE ? NUMBERMAP.ONE : NUMBERMAP.ZERO
      const newStatus =
        currentStatus === NUMBERMAP.ONE ? NUMBERMAP.ZERO : NUMBERMAP.ONE

      currentTarget.setAttribute(
        magicSaveConstants.DATA_STATUS,
        newStatus.toString()
      )
      if ('value' in currentTarget) {
        currentTarget.value = newStatus.toString()
      }

      try {
        const response = await magicGridRowSave({
          containerID: FORM_ID,
          scopedEvents: currentTarget,
          eventClass: DELETE_DATA_GRID,
          dataframeworkOperatorType: UPDATE,
          dataframeworkOtherParamsBag: {},
          keys: {
            [DATA_SOURCE_NAME]: {
              [SKILL_ID]: skillId,
            },
          },
          diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
        })

        if (
          response &&
          'response' in response &&
          (response.response as any)?.code ===
            magicSaveConstants.STATUS_CODES.SUCCESS_CODE
        ) {
          showActionAlert(SUCCESS)
          refetch()
        } else {
          showActionAlert(FAILED)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        showActionAlert(FAILED)
      }
    }
  }

  const columns: GridColDef[] = [
    {
      field: SKILL_COLUMN.SNO.FIELD,
      headerName: SKILL_COLUMN.SNO.HEADERNAME,
      width: SKILL_COLUMN.SNO.WIDTH,
      flex: NUMBERMAP.ONE
    },
    {
      field: SKILL_COLUMN.SKILL.SKILL_NAME,
      headerName: SKILL_COLUMN.SKILL.HEADERNAME,
      width: SKILL_COLUMN.SKILL.WIDTH,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return params.value
      },
    },
    {
      field: SKILL_COLUMN.STATUS.FIELD,
      headerName: SKILL_COLUMN.STATUS.HEADERNAME,
      width: SKILL_COLUMN.STATUS.WIDTH,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box color={params.value === ACTIVE ? SUCCESS_COLOR : ERROR_COLOR}>
            {params.value === ACTIVE ? ACTIVE_STATE : INACTIVE_STATE}
          </Box>
        )
      },
    },
    {
      field: SKILL_COLUMN.ACTIONS.FIELD,
      headerName: SKILL_COLUMN.ACTIONS.HEADERNAME,
      width: SKILL_COLUMN.ACTIONS.WIDTH,
      sortable: false,
      flex: NUMBERMAP.HALF,
      renderCell: (params: GridRenderCellParams) => {
        const skillId = params.row?.skill_id
        if (!skillId) {
          return null
        }
        const status = params.row.status ?? NUMBERMAP.ZERO
        return (
          <ActionButton
            onEdit={() => {
              setSelectedSkillId(skillId)
              setEditSkillModal(true)
              setSkillModal(true)
            }}
            onDelete={(e: React.MouseEvent) => handleDelete(e, skillId)}
            dataSourceName={DATA_SOURCE_NAME}
            disabled={!params.row.status}
            dataFieldName={DATA_FIELD_NAME}
            dataStatus={status.toString()}
            value={status.toString()}
          />
        )
      },
    },
  ]

  const handleDraftSkills = () => {
    const draftSkillsData = skills?.data?.filter((draftSkill: Skill) => {
      return draftSkill.type === 'draft'
    })
    setDraftSkills(draftSkillsData ?? [])
  }

  const handleCloseModal = () => {
    setEditSkillModal(false)
    setSkillModal(false)
    setSelectedSkillId(null)
  }
  return (
    <PageContainer>
      <CommonSharedTale
        title={SKILL}
        pathName={PATHNAME}
        hanldeClick={() => {
          handleDraftSkills()
          setSkillModal(true)
        }}
        Table={
          <div id={FORM_ID}>
            <DataTable
              rows={tableData}
              columns={columns}
              IdField={SKILL_ID}
              checkbox={false}
              loading={isLoading}
              customClassName={DATA_GRID_ROW}
            />
          </div>
        }
      />
  
        <AddSkillPopupForm
           skillModal = {skillModal}
          editSkillModal = {editSkillModal}
           onClose={() => {
            handleCloseModal()
          }}
          draftSkills={draftSkills}
          mode={editSkillModal?EDIT:ADD}
          skillId={selectedSkillId ?? undefined}
          onSave={() => {
            setEditSkillModal(false)
            setSelectedSkillId(null)
            refetch()
          }}
        />
    </PageContainer>
  )
}

export default SkillsList
