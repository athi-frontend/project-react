import { apiClient } from '@/shared/apiClient'
import { EXECUTIVE_SUMMARY_API } from '@/constants/modules/regulation/executiveSummary'
import { 
  Agency, 
  Country, 
  ExecutiveSummaryData 
} from '@/types/modules/regulation/executiveSummary'

export const fetchAgencies = async (): Promise<Agency[]> => {
  const response = await apiClient.get(EXECUTIVE_SUMMARY_API.AGENCIES);
  return response.data?.data ?? [];
};

export const fetchCountries = async (): Promise<Country[]> => {
  const response = await apiClient.get(EXECUTIVE_SUMMARY_API.COUNTRIES);
  return response.data?.data ?? [];
};

export const fetchExecutiveSummary = async (projectId: number) => {
  const url = EXECUTIVE_SUMMARY_API.FETCH(projectId)
  const response = await apiClient.get(url)
  return response.data
}

export const postExecutiveSummary = async (data: ExecutiveSummaryData) => {
  const response = await apiClient.post(EXECUTIVE_SUMMARY_API.POST, data)
  return response.data
} 