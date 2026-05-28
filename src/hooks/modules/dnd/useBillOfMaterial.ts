import { useQuery } from "@tanstack/react-query";
import { fetchBillOfMaterialByProductId } from "@/services/modules/dnd/billOfMaterial";
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useBillOfMaterial = (productId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BILL_OF_MATERIAL, productId],
    queryFn: () => fetchBillOfMaterialByProductId(productId),
    enabled: !!productId && enabled,
  });
};

