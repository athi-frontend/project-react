'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'next/navigation'
import { ButtonGroup, DataGridTable, showActionAlert } from '@/components/ui'
import { NUMBERMAP, BUTTON_LABEL } from '@/constants/common'
import { PageContainer } from '@/styles/modules/hr/inductionTraining'
import Checkbox from '@mui/material/Checkbox'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import {
  useTestLicenseChecklistById,
  useSaveTestLicenseChecklist,
} from '@/hooks/modules/regulation/useTestLicenseChecklist'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  TEST_LICENSE_CHECKLIST_CONSTANTS,
  TEST_LICENSE_CHECKLIST_COLUMNS,
} from '@/constants/modules/regulation/testLicenseCheckList'
import { TableContainer } from '@/styles/components/ui/datatable'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'

/**
    Classification : Confidential
**/

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS
const { TITLE, ID_FIELD } = TEST_LICENSE_CHECKLIST_CONSTANTS

type SaveType = 'draft' | 'final'

const TestLicenceChecklistPage: React.FC = () => {
  const params = useParams()
  const TEST_LICENSE_ID = Number(params.id)

  const { data, isLoading, refetch: refetchTestLicenseChecklist } = useTestLicenseChecklistById(TEST_LICENSE_ID, false)
  const { mutate: saveMutation } = useSaveTestLicenseChecklist(TEST_LICENSE_ID)
  const [tableData, setTableData] = useState<any[]>([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [hasEditPermission, setHasEditPermission] = useState(false)
  const isInitialDataLoad = useRef(true)
  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave({
    debounceMs: NUMBERMAP.TWOTHOUSAND
  })

  // Trigger API call on component mount
  useEffect(() => {
    refetchTestLicenseChecklist();
  }, [refetchTestLicenseChecklist]);

  // Bind API data to table
  useEffect(() => {
    if (data?.data) {
      setTableData(data?.data)
      
      // Set initial load to false after all data is loaded
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND);
    } else {
      setTableData([])
    }
  }, [data])

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (!hasEditPermission) return; // Prevent changes if no edit permission
    setTableData((prev) => {
      const updated = prev.map((row) =>
        row.checklist_id === id ? { ...row, is_mandatory: checked } : row
      )
      if (!isInitialDataLoad.current) {
        handleSave('draft', updated)
      }
      return updated
    })
  }

  const columns = [
    {
      field: TEST_LICENSE_CHECKLIST_COLUMNS.SNO.FIELD,
      headerName: TEST_LICENSE_CHECKLIST_COLUMNS.SNO.HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TEST_LICENSE_CHECKLIST_COLUMNS.SECTION_NO.FIELD,
      headerName: TEST_LICENSE_CHECKLIST_COLUMNS.SECTION_NO.HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => params.row.section_no,
    },
    {
      field: TEST_LICENSE_CHECKLIST_COLUMNS.CHECKLIST_NAME.FIELD,
      headerName: TEST_LICENSE_CHECKLIST_COLUMNS.CHECKLIST_NAME.HEADER,
      flex: NUMBERMAP.TWO,
      renderCell: (params: any) => params.row.checklist_name,
    },
    {
      field: TEST_LICENSE_CHECKLIST_COLUMNS.IS_MANDATORY.FIELD,
      headerName: TEST_LICENSE_CHECKLIST_COLUMNS.IS_MANDATORY.HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Checkbox
          checked={params.row.is_mandatory}
          onChange={(e) =>
            handleCheckboxChange(params.row.checklist_id, e.target.checked)
          }
          disabled={!hasEditPermission}
        />
      ),
    },
  ]

  function handleSave(type: SaveType, next?: any[]) {
    if (!hasEditPermission) return; // Prevent save if no edit permission
    const rows = next ?? tableData
    const payload = rows.map((row) => ({
      checklist_id: row.checklist_id,
      is_mandatory: row.is_mandatory ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
    }))
    if (type === 'draft') {
      draftSave({
        project_id: Number(TEST_LICENSE_ID),
        form_type: 'test_license_checklist',
        form_data: rows,
        timestamp: new Date().toISOString(),
      })
      return
    }
    setIsDisabled(true)
    clearDraftSave()
    saveMutation(payload, {
      onSuccess: () => {
        setIsDisabled(false)
        refetchTestLicenseChecklist() // Refetch to get updated permissions
      },
      onError: () => {
        setIsDisabled(false)
      },
    })
  }

  const handleCancel = () => {
    showActionAlert('customAlert', {
      title: 'Cancelled',
      text: 'You have cancelled the operation!',
      icon: 'info',
      cancelButton: false,
      confirmButton: false,
    });
    if (data?.data) {
      setTableData(data.data)
    }
  }

  // Update edit permission based on permissions from API
  useEffect(() => {
    if (data?.meta_info?.action_control?.permissions) {
      const hasSavePermission = data.meta_info.action_control.permissions.some(
        (p: { action: string }) => p.action === 'Save'
      )
      // Only allow editing if Save permission exists
      setHasEditPermission(hasSavePermission)
    }else{
      setHasEditPermission(false)
    }
  }, [data?.meta_info?.action_control?.permissions])

  return (
    <PageContainer>
      {isDraftSaving && <DraftLoading />}
      <Box>
        <CommonSharedTale
          title={TITLE}
          Table={
            <TableContainer>
              <DataGridTable
                rows={tableData}
                columns={columns}
                idField={ID_FIELD}
                checkboxSelection={false}
                hideFooter={true}
                loading={isLoading}
              />
              <ButtonGroup
                buttons={[
                  {
                    label: BUTTON_LABEL.CANCEL,
                    onClick: handleCancel,
                  },
                  // Only show Save button if Save permission exists in API response
                  ...(hasEditPermission ? [{
                    label: BUTTON_LABEL.SAVE,
                    onClick: () => handleSave('final'),
                    disabled: tableData.length === EMPTY_ARRAY_LENGTH || isDisabled,
                  }] : []),
                ]}
              />
            </TableContainer>
          }
        />
      </Box>
    </PageContainer>
  )
}

export default TestLicenceChecklistPage
