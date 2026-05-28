/**
*Classification : Confidential
**/

import { FORECASTDETAILS } from "@/constants/modules/sales/forecastDetails"
import { apiClient } from "@/shared/apiClient"
import { DateParamsType } from "@/types/modules/sales/forecastDetails"

export const getAllSalesForecastDetails = async () =>{
    const response = await apiClient.get(FORECASTDETAILS.API_ENDPPOINTS.GET_ALL_SALES_FORECAST_DETAILS,
       { params : {type : FORECASTDETAILS.PARAMS.TYPE_MONTHLY, unique_products: true}}
    )
    return response.data
}

export const getForecastDetailsByProduct = async (product_id : number, dateParams : DateParamsType) =>{
    const response = await apiClient.get(FORECASTDETAILS.API_ENDPPOINTS.GET_FORECAST_DETAILS_BY_PRODUCT(product_id, dateParams.start_date, dateParams.end_date))
    return response?.data
}
