import { NUMBERMAP } from '@/constants/common';
import { ProductWithForecastDetails } from '@/types/modules/sales/salesForecast';
/**
 * Classification: Confidential
 */
export interface TransformedSalesForecastData {
  id: number;
  sno: number;
  productName: string;
  productCategoryName: string;
  productType: string;
  productSubType: string;
  modelId?: number;
  modelName?: string;
  salesForecastDetails: any[];
  [key: string]: any;
}
 
export const transformSalesForecastData = (
  salesForecastData: ProductWithForecastDetails[]
): TransformedSalesForecastData[] => {
  return salesForecastData?.map((product, index) => {
    const monthData = product?.sales_forecast_details?.reduce((acc, detail) => {
      if (!detail?.time_bucket) return acc;
      const monthKey = detail.time_bucket.toLowerCase();
      acc[monthKey] = detail.units ?? NUMBERMAP.ZERO;
      return acc;
    }, {} as Record<string, number>);
 
    // Create unique ID by combining product_id and model_id
    const uniqueId = product.model_id
      ? `${product.product_id}_${product.model_id}`
      : product.product_id;
 
    return {
      id: uniqueId,
      productName: product.product_name,
      product_id:product.product_id,
      productCategoryName: product.product_category_name,
      productType: product.product_type,
      productSubType: product.product_sub_type,
      modelId: product.model_id,
      modelName: product.model_name,
      salesForecastDetails: product.sales_forecast_details,
      ...monthData,
    };
  });
};