/**
    Classification : Confidential
**/

export interface SampleOrderPart {
  part_number_id: number;
  part_number: string;
  part_name?: string;
  order_quantity?: number;
  [key: string]: any;
}

export interface SampleOrderPartsResponse {
  data: SampleOrderPart[];
  message?: string;
  status?: string;
}

export interface SampleInspectionData {
  id?: string | number;
  specification?: string;
  samples?: { [key: number]: any };
  [key: string]: any;
}

export interface SampleInspectionResponse {
  data: SampleInspectionData[];
  message?: string;
  status?: string;
}
