import { apiClient } from '@/shared/apiClient';
import { RISK_ANALYSIS_API } from '@/constants/modules/regulation/riskAnalysis';

export const fetchRiskAnalysis = async (projectId: number) => {
  const response = await apiClient.get(RISK_ANALYSIS_API.FETCH(projectId));
  return response.data;
};

export const saveRiskAnalysis = async (payload: { project_id: number; risk_analysis: string }) => {
  const response = await apiClient.post(RISK_ANALYSIS_API.SAVE, payload);
  return response.data;
}; 