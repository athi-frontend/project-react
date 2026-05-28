'use client'
import SalesForecast from "@/components/modules/sales/sales-forecast/SalesForecastForm";
import { useParams } from "next/navigation";

const SalesForecasePage = ()=>{
    const params  = useParams().id
  return <SalesForecast forecaseId = {params} />
}

export default SalesForecasePage