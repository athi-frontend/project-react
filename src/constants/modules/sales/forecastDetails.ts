import { NUMBERMAP } from "@/constants/common"
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

/**
*Classification : Confidential
**/
const BASE_API_PATH = 'api/v1/sales';

export const FORECASTDETAILS = {
    LIST_PAGE_TITLE : 'View Details Sales Forecast',
    PRODUCT_PAGE_TITLE : 'View Forecast',
    API_ENDPPOINTS :{
        GET_ALL_SALES_FORECAST_DETAILS : `${BASE_API_PATH}/sales-forecast/all`,
        GET_FORECAST_DETAILS_BY_PRODUCT : (product_id: number, start_date: string, end_date: string) => `${BASE_API_PATH}/sales-forecast/product/${product_id}?start_date=${start_date}&end_date=${end_date}`
    },
    PARAMS : {
        TYPE_MONTHLY : 'monthly'
    },
    QUERY_KEYS :{
        LIST : 'view-details-sales-forecast-list',
        PRODUCT_FORECAST : 'view-forecast-details-by-product'
    },
    FIELDS :{
        PRODUCT_CATEGORY : {
            FIELD_LABELS : "Product Category",
        },
        PRODUCT_TYPE : {
            FIELD_LABELS : "Product Type"
        },
        PRODUCT_SUB_TYPE : {
            FIELD_LABELS : "Product Sub Type"
        },
        PRODUCT_NUMBER : {
            FIELD_LABELS : "Product Number"
        },
        START_DATE :{
            FIELD_LABELS : "Start Date"
        },
        END_DATE : {
            FIELD_LABELS : "End Date"
        },

    },
    MODELS :{
        TABLE_TITLE : "Models",
    },
    FORECAST_DETAILS : {
        TABLE_TITLE : "Forecast Details"
    },
    BUTTON_LABELS : {
        VIEW_FORECAST : "View Forecast"
    },
    FIELD_NAMES : {
        PRODUCT_ID : "product_id",
        ID_FIELD : "sno",
        SNO : "sno"
    },
    TABLE_COLUMNS : {
        S_NO : "S.No.",
        MODEL_NO : "Model No.",
        MODEL_NAME : "Model Name",
        MONTH : "Month",
        PROJECTED : "Projected",
        SOLD_PROJECTION_MET : "Sold Projection Met (%)"
    },
    TABLE_FIELDS : {
        SNO : "sno",
        MODEL_NUMBER : "model_number",
        MODEL_NAME : "model_name",
        MONTH : "month",
        PROJECTED : "projected",
        SOLD : "sold"
    },
    STYLES : {
        TOOLTIP_WIDTH : "320px",
        TOOLTIP_MAX_WIDTH : "none",
        TOOLTIP_PLACEMENT : "bottom-start" as const
    }
}

export const BUTTON_LABELS_FORM = {
    CANCEL: "Cancel",
}

// Column definitions for the table
export const getForecastListcolumns = (renderViewForecast : (params: GridRenderCellParams) => React.ReactNode ): GridColDef[] => { 
    return [
    {
      field: "sno",
      headerName: "S.No.",  
      flex: NUMBERMAP.HALF,
    },
    {
      field: "product_type",
      headerName: "Product Type",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "product_sub_type",
      headerName: "Product Sub Type",
      flex: NUMBERMAP.ONE,
    },
     {
      field: "product_name",
      headerName: "Product Name",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "action",
      headerName: "Action",
      flex: NUMBERMAP.HALF,
      renderCell: renderViewForecast,
    },
  ];
}