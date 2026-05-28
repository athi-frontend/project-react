export interface PremisesFacilitiesData {
  plant_master_file_id?: number;
  organization_site_id: number;
  premises_layout_with_scale: string;
  construction_finishes_fixtures: string;
  ventilation_system_description: string;
  hazardous_material_handling_areas: string;
  water_system_description: string;
  premises_preventive_maintenance_description: string;
  status?: number;
}

export interface PremisesFacilitiesApiResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  data: PremisesFacilitiesData[];
} 