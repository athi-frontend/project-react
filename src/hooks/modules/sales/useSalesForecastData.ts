/**
 * Classification: Confidential
 * Description: Custom hook for sales forecast data transformation
 */

import { useMemo } from 'react';
import { ProductWithForecastDetails } from '@/types/modules/sales/salesForecast';

export const useSalesForecastData = (salesForecastData: ProductWithForecastDetails[] | undefined) => {
  return useMemo(() => salesForecastData ?? [], [salesForecastData]);
};
