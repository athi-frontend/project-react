import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { StyledTabs, StyledTab } from '@/styles/modules/risk-management/riskLevelDefinition'
import {
  ViewTabsWrapper,
  ViewTabsTitle,
  ViewTabsContainer,
  TabPanelContainer,
  RecordsRow,
  RecordsContainer,
  ModelViewContainer,
  ModelViewItem,
  ModelViewRowWrapper,
  ModelViewTableWrapper,
} from '@/styles/modules/purchase/salesProjection'
import { SalesProjectionTabsProps, SalesProjectionTabsRef } from '@/types/modules/purchase/salesProjection'
import { Grid2, Checkbox } from '@mui/material';
import { NUMBERMAP } from '@/constants/common';
import { DataGridTable } from '@/components/ui';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { CommonModalScroll, UnderLineButton } from '@/styles/common';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { usePostSalesProjection } from '@/hooks/modules/purchase/useSalesProjection';

/**
 * Classification : Confidential
 **/

function TabPanel(props: Readonly<{ children?: React.ReactNode; index: number; value: number }>) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`view-tabpanel-${index}`}
      aria-labelledby={`view-tab-${index}`}
      {...other}
    >
      {value === index && <TabPanelContainer>{children}</TabPanelContainer>}
    </div>
  )
}

const SalesProjectionTabs = forwardRef<SalesProjectionTabsRef, SalesProjectionTabsProps>(({
  tabValue,
  setTabValue,
  modelView,
  partView,
  isLoading,
  error,
  formatItem,
  purchase_requisition_id,
  status_on_date,
  setPurchaseRequisitionId,
}, ref) => {
  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState([])
  const [tabType, setTabType] = useState('stock')
  const [selectedRows, setSelectedRows] = useState<{ [key: number]: boolean }>({})
  const postSalesProjectionMutation = usePostSalesProjection()

  const handleCommonModal = (value: string, data: any) => {
    setTabType(value)
    setOpenModal(true)
    setModalData(data?.map((item: any, index: number) => ({ ...item, id: index + 1 })))
  }
  const handleSubmit = async () => {
    if (!status_on_date) {
      return
    }

    // Construct part_details array from partView and selectedRows
    // Include all parts with their is_applicable status
    const part_details = partView.map((part: any) => ({
      purchase_requisition_part_id: part.purchase_requisition_part_id ?? null,
      part_id: part.part_id,
      total_no_of_units: part.total_no_of_units ?? NUMBERMAP.ZERO,
      is_applicable: selectedRows[part.part_id] ? NUMBERMAP.ONE : NUMBERMAP.ZERO,
    }))

    const payload = {
      purchase_requisition_id: purchase_requisition_id ? purchase_requisition_id.toString() : '',
      status_on_date: status_on_date,
      part_details: part_details,
    }

    try {
      const response = await postSalesProjectionMutation.mutateAsync(payload);
      const purchaseRequisitionId = (response as any)?.data[NUMBERMAP.ZERO]?.purchase_requisition_id
      setPurchaseRequisitionId?.(purchaseRequisitionId)
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error('Error submitting sales projection:', error)
      throw error
    }
  }

  // Expose handleSubmit to parent via ref
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }), [handleSubmit, purchase_requisition_id, status_on_date, partView, selectedRows])
  const partViewColum = [
    {
      field: 'sno',
      headerName: "S.No.",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'part_number',
      headerName: "Part Number",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'part_type',
      headerName: "Part Type",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'total_no_of_units',
      headerName: "Total Unit Required",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'min_stock',
      headerName: "Min Stock",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'in_stock',
      headerName: "In Stock",
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {

        return <UnderLineButton onClick={() => handleCommonModal('stock', params.value?.stock_details ?? [])}>{params.value?.stock_count ?? '-'}</UnderLineButton>
      }
    },
    {
      field: 'expected_units_delivered',
      headerName: "Expected unit to be delivered",
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return <UnderLineButton onClick={() => handleCommonModal('delivery', params.value?.delivered_details ?? [])}>{params.value?.delivery_count ?? '-'}</UnderLineButton>
      }
    },
    {
      field: 'orders_to_be_placed',
      headerName: "Order to be placed",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'is_applicable_id',
      headerName: "Action",
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return <Checkbox checked={selectedRows[params.row.part_id] ?? false} onChange={(e) => setSelectedRows({ ...selectedRows, [params.row.part_id]: e.target.checked })} />
      }
    }
  ]
  const stockDataColumns = [
    {
      field: 'sno',
      headerName: "S.No.",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'location',
      headerName: "Location",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'address',
      headerName: "Address",
      flex: NUMBERMAP.ONE
    }, {
      field: 'count',
      headerName: "Count",
      flex: NUMBERMAP.ONE
    }
  ]
  const deliveryDataColumns = [
    {
      field: 'sno',
      headerName: "S.No.",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'purchase_number',
      headerName: "PO No.",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'order_placed_on',
      headerName: "Order Placed On",
      flex: NUMBERMAP.ONE
    }, {
      field: 'order_placed_by',
      headerName: "Order Placed By",
      flex: NUMBERMAP.ONE
    }, {
      field: 'order_placed_for',
      headerName: "Order Placed For",
      flex: NUMBERMAP.ONE
    }, {
      field: 'vendor_name',
      headerName: "Vendor Name",
      flex: NUMBERMAP.ONE
    },
    {
      field: 'expected_date_of_delivery',
      headerName: "Expected Date of Delivery",
      flex: NUMBERMAP.ONE
    }
  ]
  useEffect(() => {
    setSelectedRows(partView?.reduce((acc: { [key: string]: boolean }, curr: any) => {
      acc[curr.part_id] = curr.is_applicable_id
      return acc
    }, {}))
  }, [partView])
  return (
    <>
      <ViewTabsWrapper>
        <ViewTabsTitle>VIEW</ViewTabsTitle>
        <ViewTabsContainer>
          <StyledTabs
            value={tabValue}
            onChange={(_, v) => setTabValue(v)}
            aria-label="product-part-view-tabs"
            variant="fullWidth"
          >
            <StyledTab label="Product View" id="view-tab-0" aria-controls="view-tabpanel-0" />
            <StyledTab label="Part View" id="view-tab-1" aria-controls="view-tabpanel-1" />
          </StyledTabs>
        </ViewTabsContainer>

        <TabPanel value={tabValue} index={NUMBERMAP.ZERO}>
          {(() => {
            if (isLoading) {
              return <RecordsRow>Loading...</RecordsRow>;
            }

            if (error) {
              return <RecordsRow>Error loading data</RecordsRow>;
            }

            if (!modelView || modelView.length === NUMBERMAP.ZERO) {
              return <RecordsRow>No Records Found</RecordsRow>;
            }

            return (
              <RecordsContainer>
                <ModelViewContainer>
                  {modelView.map((item: any, index: number) => (
                    <ModelViewItem size={NUMBERMAP.SIX} key={item.product_name}>
                      <ModelViewRowWrapper>
                        <RecordsRow key={index + item?.total_units}>
                          {formatItem(item)}
                        </RecordsRow>
                      </ModelViewRowWrapper>
                      <ModelViewTableWrapper>
                        <DataGridTable
                          hideFooter
                          idField="part_number"
                          rows={item?.part_units_details ?? []}
                          columns={[
                            { field: "part_number", headerName: "Part No", flex: NUMBERMAP.ONE },
                            { field: "no_of_units_required", headerName: "No of Units Required", flex: NUMBERMAP.ONE },
                            { field: "total_unit_required", headerName: "Total Units Required", flex: NUMBERMAP.ONE }
                          ]}
                        />
                      </ModelViewTableWrapper>
                    </ModelViewItem>
                  ))}
                </ModelViewContainer>
              </RecordsContainer>
            );
          })()}
        </TabPanel>

        <TabPanel value={tabValue} index={NUMBERMAP.ONE}>
          {partView.length === NUMBERMAP.ZERO && !isLoading ? (
            <RecordsRow>No Records Found</RecordsRow>
          ) : (
            <DataGridTable
              hideFooter
              idField='part_number'
              rows={partView ?? []}
              columns={partViewColum}
            />

          )}
        </TabPanel>
      </ViewTabsWrapper>
      <CommonModal open={openModal} title='Sales Projection' onClose={() => setOpenModal(false)}>
      <CommonModalScroll>
        <Grid2 container>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <DataGridTable
              hideFooter
              idField={'id'}
              rows={modalData ?? []}
              columns={tabType === 'stock' ? stockDataColumns : deliveryDataColumns}
            />
          </Grid2>
        </Grid2>
        </CommonModalScroll>
      </CommonModal>
    </>
  )
})

SalesProjectionTabs.displayName = 'SalesProjectionTabs'

export default SalesProjectionTabs

