"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Typography, Grid2, Button, useTheme } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TableContainer } from "@/styles/common";
import { DataGridTable, Label, FilterDropdown, showActionAlert } from "@/components/ui";
import CommonModal from "@/components/ui/common-modal/CommonModal";
import { NUMBERMAP, STATUS } from "@/constants/common";
import { Edit, Add } from 'iconsax-react';
import SalesForecastModal from "@/components/modules/sales/sales-forecast/SalesForecastModal";
import {
  SalesForecastHeaderStyles,
  SalesForecastButtonContainerStyles,
  SalesForecastAddNewButtonStyles,
  SalesForecastTableContainerStyles,
  SalesForecastMonthCellStyles,
  SalesForecastMonthCellTextStyles,
  SalesForecastEditIconContainerStyles
} from "@/styles/modules/sales/salesForecast";
import { useAllSalesForecasts, useUpsertSalesForecast, useSalesForecastById } from "@/hooks/modules/sales/useSalesForecast";
import { ProductWithForecastDetails, SalesForecastFilterParams, SalesForecastModalFormData, SalesForecastRequest, SalesForecastDetail } from "@/types/modules/sales/salesForecast";
import {
  PAGE_TITLES,
  BUTTON_TEXT,
  FILTER_DEFAULTS,
  TABLE_COLUMNS,
  MODAL_CONFIG,
  MONTH_ABBREVIATIONS
} from "@/constants/modules/sales/salesForecast";
import {
  getCurrentMonthYear,
  getMonthsAheadYear,
  calculateEndDate,
} from "@/lib/utils/modules/sales/dateCalculations";
import { useSalesForecastData } from "@/hooks/modules/sales/useSalesForecastData";
import { transformSalesForecastData } from "@/utils/modules/sales/salesForecastUtils";
import { FilterData } from "@/types/components/ui/filterDropdown";

/**
 * Classification : Confidential
 **/

// Format month ID to ensure two digits with leading zero
const formatMonthId = (value?: string | number | null): string => {
  if (value === null || value === undefined) return '';
  const numericValue = Number(value);
  if (Number.isNaN(numericValue) || numericValue <= NUMBERMAP.ZERO) return '';
  return `${numericValue}`.padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString());
};
const formatMonthNameToId = (value?: string | null): string => {
  if (value === null || value === undefined) return '';
  const monthName = value
  if (MONTH_ABBREVIATIONS?.includes(monthName)) {
    return NUMBERMAP.ZERO.toString() + (MONTH_ABBREVIATIONS?.indexOf(monthName) + NUMBERMAP.ONE).toString()
  }
  return ''
};

// Local helper to build Sales Forecast request payload
const buildSalesForecastRequest = (
  data: SalesForecastModalFormData,
  existingId?: string,
  fallbackProductId?: number,
  fallbackMonth?: string
): SalesForecastRequest => {
  const payload: SalesForecastRequest = {
    product_id: data.product?.product_id ?? fallbackProductId ?? NUMBERMAP.ONE,
    month_selection: data.monthSelection ?? fallbackMonth ?? '',
    model_id: data.modelId ? parseInt(data.modelId, NUMBERMAP.TEN) : NUMBERMAP.ONE,
    priority_id: parseInt(data.priority) || NUMBERMAP.ONE,
    units: parseInt(data.unitsRequired) || NUMBERMAP.ZERO,
    remarks: data.remarks ?? '',
    status : NUMBERMAP.ONE
  }
  let draftDocuments = {}
  let documentsToCreateMetadata = {}
  const documentsToCreate = Array.isArray(data.uploadedFile)
    ? data.uploadedFile.filter((file): file is File => file instanceof File)
    : []

  if (documentsToCreate.length > NUMBERMAP.ZERO) {
    payload.documents_to_create = documentsToCreate
  }

  const documentsToDelete = Array.isArray(data.documents_to_delete)
    ? data.documents_to_delete.map((id): number => Number(id))
    : []

  if (documentsToDelete.length > NUMBERMAP.ZERO) {
    payload.documents_to_delete = documentsToDelete
  }

  if (existingId) {
    payload.sales_forecast_id = existingId
  }
  if (data.update_meta_data && Object.keys(data.update_meta_data).length > NUMBERMAP.ZERO) {
    payload.update_meta_data = data.update_meta_data
  }
  if (data.type) {
    let documents = data?.documents.filter((doc)=>!data?.documents_to_delete?.includes(doc?.file_id)) ?? []
    if (documents.length > NUMBERMAP.ZERO) {
      documents.forEach((doc: any) => {
        if (doc.file_id) {
          draftDocuments[doc.file_id + doc.file_name] = doc
        }
      })

    }

  }
  if (data.create_meta_data && Object.keys(data.create_meta_data).length > NUMBERMAP.ZERO) {
    documentsToCreateMetadata = data.create_meta_data
  }
  payload.create_meta_data = JSON.stringify({...draftDocuments,...documentsToCreateMetadata})
  return payload
};

type SalesFilterPayload = Partial<FilterData> & {
  startDate?: FilterData["startDate"] | string | null;
  endDate?: FilterData["endDate"] | string | null;
};

const SalesForecast: React.FC = ({ forecaseId }) => {
  const theme = useTheme();

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<{
    id: number;
    month: string;
    value: number;
    productId?: number | string;
    modelId?: number;
  } | null>(null);
  const [editingSalesForecastId, setEditingSalesForecastId] = useState<string | null>(null);
  const [timeBuckets, setTimeBuckets] = useState<string[]>([]);
  // Initialize with default filter parameters
  const getDefaultFilterParams = (): SalesForecastFilterParams => {
    const defaultStartDate = getCurrentMonthYear();
    const defaultEndDate = getMonthsAheadYear(); // Current month + next 2 months (3 months total)

    return {
      type: FILTER_DEFAULTS.TYPE,
      start_date: defaultStartDate,
      end_date: defaultEndDate
    };
  };

  const [filterParams, setFilterParams] = useState<SalesForecastFilterParams>(getDefaultFilterParams());

  // API hooks
  const { data: salesForecastData, isLoading } = useAllSalesForecasts(filterParams, true);
  const upsertSalesForecastMutation = useUpsertSalesForecast();
  const { data: salesForecastByIdData, refetch: refetchById } = useSalesForecastById(editingSalesForecastId ?? '', !!editingSalesForecastId);

  // Force refetch when editingSalesForecastId changes (when edit icon is clicked)
  useEffect(() => {
    if (editingSalesForecastId && editingSalesForecastId !== null && editingSalesForecastId !== undefined) {
      refetchById();
    }
  }, [editingSalesForecastId, refetchById]);

  useEffect(() => {
    if (Number(forecaseId)) {
      setEditingSalesForecastId(Number(forecaseId))
      setIsEditModalOpen(true)
    }
  }, [forecaseId])

  // Transform API data to matrix format using custom hook
  const matrixData = useSalesForecastData(salesForecastData?.data);
  const transformedMatrixData = transformSalesForecastData(matrixData);

  // Custom cell renderer for month data with edit icon
  const renderMonthCell = (value: number, rowId: number, month: string) => {
    const showEditIcon = filterParams.type === 'monthly';

    return (
      <Grid2
        sx={SalesForecastMonthCellStyles}
        onClick={showEditIcon ? () => handleEditMonth(rowId, month) : undefined}
      >
        <Typography sx={SalesForecastMonthCellTextStyles}>
          Units: {value}
        </Typography>
        {showEditIcon && (
          <Grid2 sx={SalesForecastEditIconContainerStyles}>
            <Edit
              size={NUMBERMAP.EIGHTEEN}
              color={theme.palette.primary.main}
            />
          </Grid2>
        )}
      </Grid2>
    );
  };

  // Generate dynamic columns based on the actual data
  const columns = useMemo(() => {
    const baseColumns = [
      {
        ...TABLE_COLUMNS.SNO,
        flex: NUMBERMAP.HALF,
      },
      {
        ...TABLE_COLUMNS.PRODUCT_NAME,
        flex: NUMBERMAP.ONE,
      },
      {
        ...TABLE_COLUMNS.CATEGORY,
        flex: NUMBERMAP.ONE,
        field: 'productCategoryName',
      },
      {
        ...TABLE_COLUMNS.MODEL,
        flex: NUMBERMAP.ONE,
        field: 'modelName',
      }
    ];

    // Get unique time buckets from the data
    // Create columns for each time bucket
    const monthColumns = timeBuckets.map(bucket => {
      const fieldKey = bucket.toLowerCase();
      return {
        field: fieldKey,
        headerName: bucket,
        flex: NUMBERMAP.ONE_HALF,
        headerAlign: 'center' as const,
        align: 'center' as const,
        renderCell: (params: GridRenderCellParams) => renderMonthCell(params.value ?? NUMBERMAP.ZERO, params.row.id, fieldKey),
        type: 'number' as const,
      };
    });

    return [...baseColumns, ...monthColumns];
  }, [salesForecastData, filterParams.type, timeBuckets]);

  useEffect(() => {
    const buckets: string[] = [];
    salesForecastData?.data?.forEach((product: ProductWithForecastDetails) => {
      product?.sales_forecast_details?.forEach(detail => {
        const bucket = detail?.time_bucket;
        if (!bucket) {
          return;
        }
        if (!buckets.includes(bucket)) {
          buckets.push(bucket);
        }
      });
    });

    // Order buckets chronologically using filter params (getCurrentMonthYear and getMonthsAheadYear)
    // Following the same pattern as TaskScheduleUtils.getMonthsForDisplay
    const orderedBuckets: string[] = [];
    if (filterParams.start_date && filterParams.end_date) {
      // Parse start and end dates from filter params (from getCurrentMonthYear and getMonthsAheadYear)
      const parseDate = (dateStr: string) => {
        const [month, year] = dateStr.split('-').map(Number);
        return { month: month - NUMBERMAP.ONE, year };
      };

      const start = parseDate(filterParams.start_date);
      const end = parseDate(filterParams.end_date);

      // Generate months in chronological order using the date range (same pattern as TaskScheduleUtils)
      let currentYear = start.year;
      let currentMonth = start.month;
      const endMonth = end.month;
      const endYear = end.year;

      while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
        // Create expected month format for matching (e.g., "JAN 2026")
        const date = new Date(currentYear, currentMonth, NUMBERMAP.ONE);
        const monthNameShort = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const expectedBucket = `${monthNameShort} ${currentYear}`;

        // Find matching bucket from API response
        const matchingBucket = buckets.find(b => b.toUpperCase().trim() === expectedBucket);
        if (matchingBucket && !orderedBuckets.includes(matchingBucket)) {
          orderedBuckets.push(matchingBucket);
        }

        currentMonth++;
        if (currentMonth > NUMBERMAP.ELEVEN) {
          currentMonth = NUMBERMAP.ZERO;
          currentYear++;
        }
      }
    }

    // Use ordered buckets based on filter params, otherwise fall back to original buckets
    setTimeBuckets(orderedBuckets.length > NUMBERMAP.ZERO ? orderedBuckets : buckets);
  }, [salesForecastData, filterParams.start_date, filterParams.end_date]);

  const handleEditMonth = useCallback((id: number, month: string) => {
    const row = transformedMatrixData.find((row) => row.id === id);

    if (row) {
      const value = row[month] ?? NUMBERMAP.ZERO;

      // Find the sales forecast ID from the sales forecast details
      // Look for any detail that matches the month, regardless of units value
      const salesForecastDetail = row.salesForecastDetails?.find((detail: SalesForecastDetail) => {
        if (!detail?.time_bucket) return false;
        const detailMonth = detail.time_bucket.toLowerCase();
        return detailMonth === month;
      });

      const salesForecastId = salesForecastDetail?.sales_forecast_id?.toString();

      // Set the editing data first
      setEditingData({ id, month, value, productId: row?.product_id ?? '', modelId: row.modelId });

      // Always try to fetch existing record if sales_forecast_id exists and is not null/undefined
      // This handles cases where units might be 0 but a record exists
      if (salesForecastId && salesForecastId !== null && salesForecastId !== undefined) {
        setEditingSalesForecastId(salesForecastId);
      } else {
        // If no valid sales forecast ID found, set to null to create a new record
        setEditingSalesForecastId(null);
      }

      setIsEditModalOpen(true);
    }
  }, [transformedMatrixData, refetchById]);

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingData(null);
    setEditingSalesForecastId(null);
  }, []);

  const handleSaveEdit = useCallback((data: SalesForecastModalFormData) => {


    const salesForecastPayload = buildSalesForecastRequest(
      data,
      editingSalesForecastId ?? undefined,
      editingData?.productId ? Number(editingData?.productId) : undefined,
      editingData?.month
    );

    upsertSalesForecastMutation.mutate(salesForecastPayload, {
      onSuccess: (response) => {
        if (!editingSalesForecastId && response?.data) {
          const resData = Array.isArray(response.data) ? response.data[NUMBERMAP.ZERO] : response.data;
          if (resData?.sales_forecast_id) {
            setEditingSalesForecastId(resData.sales_forecast_id.toString());
          }
        }
        showActionAlert(STATUS.SUCCESS);
        handleCloseModal();
      },
      onError: (error) => {
        showActionAlert(STATUS.FAILED);
      }
    });
  }, [editingData, editingSalesForecastId, upsertSalesForecastMutation, handleCloseModal]);

  // Add New handlers
  const handleAddNew = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleSaveNew = useCallback((data: SalesForecastModalFormData) => {
    const salesForecastPayload = buildSalesForecastRequest(data);

    upsertSalesForecastMutation.mutate(salesForecastPayload, {
      onSuccess: () => {
        handleCloseAddModal();
        showActionAlert(STATUS.SUCCESS);
      },
      onError: () => {
        showActionAlert(STATUS.FAILED);
      }
    });
  }, [upsertSalesForecastMutation, handleCloseAddModal]);

  // Calculate end date based on period type - now using utility function

  // Handle filter changes
  const handleFilterChange = useCallback((filterPayload: SalesFilterPayload) => {
    const defaultStartDate = getCurrentMonthYear();
    const selectedPeriod = filterPayload?.period ?? FILTER_DEFAULTS.TYPE;
    const calculatedEndDate = calculateEndDate(selectedPeriod);

    const normalizeDateValue = (value: unknown, fallback: string): string => {
      if (typeof value === 'string') {
        return value;
      }
      if (value && typeof (value as { format?: (pattern: string) => string }).format === 'function') {
        return (value as { format: (pattern: string) => string }).format('MM-yyyy');
      }
      return fallback;
    };

    const startDateValue = normalizeDateValue(filterPayload?.startDate, defaultStartDate);
    const endDateValue = normalizeDateValue(filterPayload?.endDate, calculatedEndDate);

    const apiParams: SalesForecastFilterParams = {
      type: selectedPeriod,
      start_date: startDateValue,
      end_date: endDateValue,
    };

    setFilterParams(apiParams);
  }, []);

  return (
    <TableContainer>
      <Grid2 container>
        {/* Header with Title and Buttons */}
        <Grid2 size={NUMBERMAP.TWELVE} sx={SalesForecastHeaderStyles}>
          <Grid2 size={NUMBERMAP.SIX}>
            <Label title={PAGE_TITLES.LIST_VIEW} />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX} sx={SalesForecastButtonContainerStyles}>
            <FilterDropdown
              onFilter={handleFilterChange}
            />
            <Button
              variant="outlined"
              onClick={handleAddNew}
              sx={SalesForecastAddNewButtonStyles}
            >
              <Add size={NUMBERMAP.TWENTY} color={theme.palette.primary.main} />
              {BUTTON_TEXT.ADD_NEW}
            </Button>
          </Grid2>
        </Grid2>
        <Label title={PAGE_TITLES.SALES} />
        {/* Matrix Table */}
        <Grid2 size={NUMBERMAP.TWELVE} sx={SalesForecastTableContainerStyles}>
          <DataGridTable
            rows={transformedMatrixData}
            columns={columns}
            idField="id"
            hideFooter
            showColumnLines
            loading={isLoading}
          />
        </Grid2>
      </Grid2>

      {/* Edit Month Modal */}
      <CommonModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        title={PAGE_TITLES.EDIT_SALES_FORECAST}
        buttonRequired={MODAL_CONFIG.EDIT.buttonRequired}
      >
        <SalesForecastModal
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
          forecastId={editingSalesForecastId ?? null}
          mode="edit"
          isSubmitting={upsertSalesForecastMutation.isPending}
          initialData={{
            productName: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.product_id?.toString() ?? editingData?.productId ?? '',
            product: null, // Pass the product object if available
            modelId: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.model_id?.toString() ?? editingData?.modelId ?? '',
            monthSelection: (() => {
              const monthSelectionValue = salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.month_selection ?? '';
              // Format month_selection if it exists (e.g., "1-2026" -> "01-2026")
              if (monthSelectionValue) {
                const parts = monthSelectionValue.split('-');
                if (parts.length === NUMBERMAP.TWO) {
                  const monthId = formatMonthId(parts[NUMBERMAP.ZERO]);
                  const year = parts[NUMBERMAP.ONE];
                  const formattedValue = `${monthId}-${year}`;
                  return formattedValue;
                }
              } else {
                const parts = editingData?.month?.split(' ');
                if (parts?.length === NUMBERMAP.TWO) {
                  const monthId = formatMonthNameToId(parts[NUMBERMAP.ZERO]);
                  const year = parts[NUMBERMAP.ONE];
                  const formattedValue = `${monthId}-${year}`;
                  return formattedValue;
                }
              }
              return monthSelectionValue;
            })(),
            priority: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.priority_id?.toString() ?? '',
            unitsRequired: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.units?.toString() ?? '',
            remarks: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.remarks ?? '',
            uploadedFile: salesForecastByIdData?.data?.[NUMBERMAP.ZERO]?.documents ?? []
          }}
          workflowPermissions={salesForecastByIdData?.meta_info?.action_control?.permissions ?? []}
          workflowTaskInfo={salesForecastByIdData?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [] }}
          workflowMenuId={salesForecastByIdData?.meta_info?.action_control?.menuId}
          workflowMenuName={salesForecastByIdData?.meta_info?.action_control?.formName}
          workflowRefetch={refetchById}
        />
      </CommonModal>

      {/* Add New Sales Forecast Modal */}
      <CommonModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        title={PAGE_TITLES.ADD_SALES_FORECAST}
        buttonRequired={MODAL_CONFIG.ADD.buttonRequired}
      >
        <SalesForecastModal

          onClose={handleCloseAddModal}
          onSave={handleSaveNew}
          isSubmitting={upsertSalesForecastMutation.isPending}
        />
      </CommonModal>
    </TableContainer>
  );
};
export default SalesForecast;