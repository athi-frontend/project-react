import { FORECASTDETAILS } from "@/constants/modules/sales/forecastDetails"
import { getAllSalesForecastDetails, getForecastDetailsByProduct } from "@/services/modules/sales/forecastDetails"
import { DateParamsType } from "@/types/modules/sales/forecastDetails"
import { useQuery } from "@tanstack/react-query"

/**
*Classification : Confidential
**/

export const useForecastDetails = () =>{
    return useQuery({
        queryKey :[FORECASTDETAILS.QUERY_KEYS.LIST],
        queryFn : ()=>getAllSalesForecastDetails(),
        enabled : true
    })
}

export const useGetForecastByProduct = (product_id : number, dateParams : DateParamsType) =>{
        return useQuery({
        queryKey :[FORECASTDETAILS.QUERY_KEYS.PRODUCT_FORECAST, product_id, dateParams.start_date, dateParams.end_date],
        queryFn : ()=>getForecastDetailsByProduct(product_id, dateParams),
        enabled : !!product_id && !!dateParams.start_date && !!dateParams.end_date,
        refetchOnMount: true,
    }) 
}
