'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Grid2 } from '@mui/material'
import { Dayjs } from 'dayjs'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import Label from '@/components/ui/label/Label'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import ButtonGroup from '@/components/ui/button-group/ButtonGroup'
import { SaveButton } from '@/styles/components/ui/button'
import { useGetSalesProjectionDetail } from '@/hooks/modules/purchase/useSalesProjection'
import { TableContainer } from '@/styles/common'
import { Section, ActionsRow } from '@/styles/modules/purchase/salesProjection'
import SalesProjectionMonths from '@/components/modules/purchase/SalesProjectionMonths'
import SalesProjectionTabs from '@/components/modules/purchase/SalesProjectionTabs'
import { FormContent } from '@/styles/modules/user/userOnboard'
import { BUTTON_LABEL, NUMBERMAP } from '@/constants/common'
import { ROUTES, CREATE_PURCHASE_ORDER_PATH } from '@/constants/modules/purchase/purchaseOrder'
import { BUTTON_LABELS } from '@/constants/modules/purchase/salesProjection'

const SalesProjectionStockPage: React.FC = () => {
  const router = useRouter()
  const [statusDate, setStatusDate] = React.useState<Dayjs | null>(null)
  const [tabValue, setTabValue] = React.useState(0)
  const [submittedDate, setSubmittedDate] = React.useState<string | null>(null)
  const [salesProjections, setSalesProjections] = React.useState<any[]>([])
  const [partView, setPartView] = React.useState<any[]>([])
  const [modelView, setModelView] = React.useState<any[]>([])
  const [purchaseRequisitionId, setPurchaseRequisitionId] = React.useState<number | null>(null)
  const salesProjectionTabsRef = React.useRef<{ handleSubmit: () => Promise<void> }>(null)
  const [errorMessage, setErrorMessage] = React.useState<string>('')
  // Format date as YYYY-MM-DD for API - only use submittedDate to trigger fetch
  const formattedDate = submittedDate

  const { data: salesResponse, isLoading, error } = useGetSalesProjectionDetail(formattedDate)

  const handleDateChange = (date: Dayjs | null) => {
    setStatusDate(date)
    setErrorMessage('')
  }

  const handleSubmit = () => {
    if (statusDate) {
      setErrorMessage('')
      const dateString = statusDate.format('YYYY-MM-DD')
      setSubmittedDate(dateString)
    }else{
      setErrorMessage('Please select a date')
    }
  }

  const handleSave = async () => {
    if (salesProjectionTabsRef.current) {
        await salesProjectionTabsRef.current.handleSubmit()
    }
  }

  React.useEffect(() => {
    if (salesResponse?.data) {
      const data = Array.isArray(salesResponse.data) ? salesResponse.data[NUMBERMAP.ZERO] : salesResponse.data
      setSalesProjections(data?.sales_projections ?? [])
      setPartView(data?.part_view ?? [])
      setModelView(data?.model_view ?? [])
      setPurchaseRequisitionId(data?.purchase_requisition_id ?? null)
    }
  }, [salesResponse])

  // Format items for display
  const formatItem = React.useCallback((item: any): string => {
    if (typeof item === 'string') return item
    if (typeof item === 'object' && item !== null) {
      // Try common fields that might represent the item
      if (item.product_name) return item.product_name
      if (item.name) return item.name
      if (item.label) return item.label
      // Fallback to JSON string if no recognizable field
      return JSON.stringify(item)
    }
    return String(item)
  }, [])

  return (
    <PageContainer>
      <TableContainer>
        <Label title='Sales Projection & Stock Details' />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            <Grid2 size={NUMBERMAP.FOUR}>
              <DatePicker
                label='Status on Date*'
                value={statusDate}
                  error={errorMessage}
                onChange={handleDateChange}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <SaveButton sx={{marginTop: '35px'}} variant="contained" onClick={handleSubmit}>{'Submit'}</SaveButton>
            </Grid2>
          </Grid2>
          <Section>
            <SalesProjectionMonths
              salesProjections={salesProjections}
              isLoading={isLoading}
              formatItem={formatItem}
            />

            <SalesProjectionTabs
              ref={salesProjectionTabsRef}
              tabValue={tabValue}
              setTabValue={setTabValue}
              modelView={modelView}
              partView={partView}
              isLoading={isLoading}
              error={error}
              formatItem={formatItem}
              purchase_requisition_id={purchaseRequisitionId}
              status_on_date={submittedDate}
              setPurchaseRequisitionId={setPurchaseRequisitionId}
            />
          </Section>

          <ActionsRow>
            <ButtonGroup
              buttons={[
                {
                  label: BUTTON_LABELS.INITIATE_PURCHASE_ORDER,
                  onClick: () => {
                    if (purchaseRequisitionId) {
                      router.push(`${CREATE_PURCHASE_ORDER_PATH}/${purchaseRequisitionId}`)
                    }
                  },
                  disabled: !purchaseRequisitionId,
                },
                { label: BUTTON_LABEL.CANCEL, onClick: () => { router.push(ROUTES.PURCHASE_ORDERS_LIST) } },
                { label: BUTTON_LABEL.SAVE, onClick: handleSave },
              ]}
            />
          </ActionsRow>
        </FormContent>
      </TableContainer>
    </PageContainer>
  )
}

export default SalesProjectionStockPage
