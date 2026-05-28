import { apiClient } from "@/shared/apiClient";
import { DT_API_ENDPOINTS } from '@/constants/modules/dnd/manufacturingLicense';

export const initiateTestLicense = async (data: { project_id: number | string, verify_pin: string, license_type: string }): Promise<any> => {
  const response = await apiClient.post(DT_API_ENDPOINTS.INITIATE_LICENSE,{
    project_id: data.project_id,
    verify_pin: data.verify_pin,
  },{params:{
    license_type:data.license_type
  }});
  return response.data;
};


export const getLicenseData = async (project_id:number,license_type:string): Promise<any> => {
  const response = await apiClient.get(DT_API_ENDPOINTS.INITIATE_LICENSE+'/'+project_id,{
    params:{
      'license_type':license_type
    }
     
  });
  return response.data;
};