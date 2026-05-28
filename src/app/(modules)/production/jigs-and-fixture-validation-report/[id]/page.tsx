'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { ActionButton, DataGridTable, showActionAlert } from '@/components/ui'
import { P20P40 } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import {
  useJigFixturesValidationReports,
  useUpsertJigFixturesValidationReport,
  useDeleteJigFixturesValidationReport
} from '@/hooks/modules/production/useCommonProductionDropDownHook'
import { useParams } from 'next/navigation'
import JigsFixtureValidationModal from '@/components/modules/production/jigs-and-fixture-report/JigsFixtureValidationModal'
import { JigsFixtureValidationFormProps, JigsFixtureValidation } from "@/types/modules/production/jigsAndFixtureValidation"
import CommonSharedTale from '@/components/shared/CommonPageTable'
import StatusTypography from '@/components/ui/status/ToggleStatus'
/**
 * Classification: Confidential
 * Jigs and Fixture Validation Report Form Component
 */




const JigsFixtureValidationForm: React.FC<JigsFixtureValidationFormProps> = ({
  validations,
  onValidationsChange,
  assemblyPartItemDetailId,
  upsertMutation,
  isLoadingReports = false,
}) => {
  const params = useParams()
  const PROJECT_ID = params?.id ? Number(params.id) : NUMBERMAP.ZERO
  const [openModal, setOpenModal] = useState(false)
  const [editingValidation, setEditingValidation] = useState<JigsFixtureValidation | null>(null)

  // Delete mutation hook
  const deleteMutation = useDeleteJigFixturesValidationReport(NUMBERMAP.ONE)

  // Jigs Validation columns for main table
  const SNOColum = {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.ONE,
  }
  const FLEX = {
    flex: NUMBERMAP.ONE
  }
  const validationColumns = [
    SNOColum,
    {
      field: 'jigType',
      headerName: 'Jig Type',
      ...FLEX
    },
    {
      field: 'jigNo',
      headerName: 'Jig No.',
      ...FLEX,
    },
    {
      field: 'jigName',
      headerName: 'Jig Name',
      ...FLEX,
    },
    {
      field: 'status_id',
      headerName: 'Status',
      ...FLEX,
      renderCell:(params)=>{
        return <StatusTypography value={params.value}/>
      }
    },
    {
      field: 'action',
      headerName: 'Actions',
      ...FLEX,
      renderCell: (params: any) => (
        <ActionButton
          disabled={params.row.status_id==NUMBERMAP.ZERO}
          onDelete={() => handleDeleteValidation(params.row.id)}
          onEdit={() => handleEditValidation(params.row)}
        />
      ),
    },
  ]


  const handleDeleteValidation = (id: string) => {
    showActionAlert('delete').then((result) => {
      if (result.isConfirmed) {
        const reportId = Number(id)
        deleteMutation.mutate(reportId, {
          onSuccess: () => {
            showActionAlert('success')
          }, onError: () => {
            showActionAlert('failed')
          }
        })
      }
    })


  }

  const handleEditValidation = (row: JigsFixtureValidation) => {
    setEditingValidation(row)
    setOpenModal(true)
  }

  const handleAddValidation = () => {
    setEditingValidation(null)
    setOpenModal(true)
  }

  const handleModalClose = () => {
    setOpenModal(false)
    setEditingValidation(null)
  }

  const handleModalSave = (validationData: JigsFixtureValidation) => {
    if (editingValidation) {
      const updatedValidations = validations.map(item =>
        item.id === editingValidation.id ? validationData : item
      )
      onValidationsChange(updatedValidations)
    } else {
      onValidationsChange([...validations, validationData])
    }
    setOpenModal(false)
    setEditingValidation(null)
  }

  return (
    <>

      <CommonSharedTale
        title="Jigs and Fixture Validation Report"
        pathName='#'
        hanldeClick={handleAddValidation}
        Table={<Box sx={{ padding: P20P40 }}> <DataGridTable
          title=""
          rows={validations}
          columns={validationColumns}
          idField="id"
          loading={isLoadingReports}
          hideFooter={true}
        /></Box>}
      />
      <JigsFixtureValidationModal
        open={openModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editingValidation={editingValidation}
        validations={validations}
        assemblyPartItemDetailId={assemblyPartItemDetailId}
        upsertMutation={upsertMutation}
        projectId={PROJECT_ID}
      />
    </>
  )
}

// Main page component that wraps the form
const JigsAndFixtureValidationReportPage: React.FC = () => {
  const params = useParams()
  // Assuming [id] is assembly_part_item_detail_id based on the API requirement
  const assemblyPartItemDetailId = params?.id ? Number(params.id) : undefined

  // Fetch all validation reports with status=1
  const { data: validationReportsData, isLoading: isLoadingReports } =
    useJigFixturesValidationReports(NUMBERMAP.ONE, true)

  // Mutation hook for upsert
  const upsertMutation = useUpsertJigFixturesValidationReport(NUMBERMAP.ONE)

  // Transform API data to component format
  const [validations, setValidations] = useState<JigsFixtureValidation[]>([])

  useEffect(() => {
    if (validationReportsData?.data && Array.isArray(validationReportsData.data)) {
      const transformed = validationReportsData.data.map((item, index) => ({
        id: String(item.jig_fixture_validation_report_id),
        jigType: item.jig_type ?? '',
        jigNo: item.jig_number ?? '',
        jigName: item.jig_name ?? '',
        status_id: item.status??'', // Default status since not in API response
        lastValidate: '', // Will be populated when editing
        procedureOfValidation: '', // Will be populated when editing
        scopeOfApplication: '', // Will be populated when editing
        dateOfValidation: item.validation_date ?? '',
        jigValidations: [] // This would need to be populated from nested data if available
      }))
      setValidations(transformed)
    } else {
      setValidations([])
    }
  }, [validationReportsData])

  const handleValidationsChange = async (updatedValidations: JigsFixtureValidation[]) => {
    // For now, just update local state
    // In a real scenario, you might want to save each item individually or batch save
    setValidations(updatedValidations)
  }

  return (
    <JigsFixtureValidationForm
      validations={validations}
      onValidationsChange={handleValidationsChange}
      assemblyPartItemDetailId={assemblyPartItemDetailId}
      upsertMutation={upsertMutation}
      isLoadingReports={isLoadingReports}
    />
  )
}

export default JigsAndFixtureValidationReportPage

