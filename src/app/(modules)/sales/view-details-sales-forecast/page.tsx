"use client";
import React, { useState } from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import {  DataTable, FilterDropdown } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { useForecastDetails } from "@/hooks/modules/sales/useForecastDetails";
import { FORECASTDETAILS, getForecastListcolumns } from "@/constants/modules/sales/forecastDetails";
import { ButtonLink } from "@/styles/common";
import { FilterData } from "@/types/components/ui/filterDropdown";
import { GridRenderCellParams } from '@mui/x-data-grid';
import { Tooltip, Box } from '@mui/material';
import { getTooltipStyles, getTooltipArrowStyles } from '@/styles/components/ui/toolTip';
import ViewDetailsSalesForecast from "@/components/modules/sales/view-details-sales-forecast/ViewDetailsSalesForecast";
import { DateParamsType } from "@/types/modules/sales/forecastDetails";
import { NUMBERMAP } from "@/constants/common";

/**
*Classification : Confidential
**/

const ViewDetailsSalesForecastListPage: React.FC = () => {
  // Get data from API
  const {data: salesForecastResponse, isLoading} = useForecastDetails();
  const [tooltipOpen, setTooltipOpen] = useState<{ [key: string]: boolean }>({})
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedDateParams, setSelectedDateParams] = useState<DateParamsType | null>(null);


  const handleModal = (rowId: string | number) =>{
    setTooltipOpen({ [rowId]: true })
  }

  const handleFilter = (filterData: FilterData, rowId?: string | number) => {
    // Handle filter submission
    if (rowId && filterData.startDate && filterData.endDate) {
      const productId = Number(rowId);     
      const dateParams: DateParamsType = {
        start_date: filterData.startDate,
        end_date: filterData.endDate
      };
      
      setSelectedProductId(productId);
      setSelectedDateParams(dateParams);
      setShowDetails(true);
      setTooltipOpen(prev => ({ ...prev, [rowId]: false }))
    }
  }

  const handleBack = () => {
    setShowDetails(false);
    setSelectedProductId(null);
    setSelectedDateParams(null);
  }

  const handleFilterCancel = (rowId?: string | number) => {
    if (rowId) {
      setTooltipOpen(prev => ({ ...prev, [rowId]: false }))
    }
  }

  const renderViewForecast = (params: GridRenderCellParams) =>{
      const rowId = params.id
      const isOpen = tooltipOpen[rowId] ?? false
      
      return(
            <Tooltip
              title={
                isOpen ? (
                  <Box 
                    sx={{ width: FORECASTDETAILS.STYLES.TOOLTIP_WIDTH }}
                    key={rowId}
                  >
                    <FilterDropdown
                      key={rowId}
                      onFilter={(data) => handleFilter(data, rowId)}
                      onCancel={() => handleFilterCancel(rowId)}
                      hideButton={true}
                      hidePeriodSelection={true}
                      restrictionStartDate={selectedDateParams?.start_date ?? undefined}
                      maxMonths={NUMBERMAP.TWELVE}
                    />
                  </Box>
                ) : null
              }
              open={isOpen}
              onClose={() => handleFilterCancel(rowId)}
              placement={FORECASTDETAILS.STYLES.TOOLTIP_PLACEMENT}
              arrow
              disableFocusListener
              disableHoverListener
              disableTouchListener
              slotProps={{
                tooltip: {
                  sx: {
                    ...getTooltipStyles(),
                    padding: NUMBERMAP.ZERO,
                    zIndex: NUMBERMAP.ONEFIFTY,
                    maxWidth: FORECASTDETAILS.STYLES.TOOLTIP_MAX_WIDTH,
                  },
                },
                arrow: {
                  sx: getTooltipArrowStyles(),
                },
              }}
            >
              <ButtonLink onClick={() => handleModal(rowId)}>
                {FORECASTDETAILS.BUTTON_LABELS.VIEW_FORECAST}
              </ButtonLink>
            </Tooltip>
      )
  }

  if (showDetails && selectedProductId !== null && selectedDateParams !== null) {
    return (
      <ViewDetailsSalesForecast
        product_id={selectedProductId}
        dateParams={selectedDateParams}
        onBack={handleBack}
      />
    );
  }

  return (
    <PageContainer >
      <CommonSharedTale
        title={FORECASTDETAILS.LIST_PAGE_TITLE}
        Table={
          <DataTable
            rows={salesForecastResponse?.data ?? []}
            columns={getForecastListcolumns(renderViewForecast)}    
            IdField={FORECASTDETAILS.FIELD_NAMES.PRODUCT_ID}
            loading = {isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default ViewDetailsSalesForecastListPage;