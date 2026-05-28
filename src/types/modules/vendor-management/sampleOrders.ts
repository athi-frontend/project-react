/**
*Classification : Confidential
**/
export interface PartDetailsData {
  id: string;
  partNumber: string;
  orderQuantity: string;
}

export interface FileData {
  id: string;
  fileName: string;
  source: string;
  dateOfUpload: string;
  fileCategory: string;
  fileStatus: string;
}

export interface SampleOrderData {
  sample_order_id: number;
  sno: number;
  vendor_type: string;
  vendor_name: string;
  po_number: string;
  po_date: string;
  status: number;
}

export interface SampleOrderFormData {
  partCategory: string;
  partNumber: string;
  purchaseOrderDate: Date | null;
  purchaseOrderNumber: string;
  vendorName: string;
  vendorType: string;
  orderQuantity: string;
  expectedDeliveryDate: Date | null;
  specialInstructions: string;
}

export interface VendorTypeData {
  id: number;
  vendor_type_name: string;
  status: number;
}

export interface VendorData {
  id: number;
  vendor_name: string;
  telephone_number: string;
  status: number;
  vendor_type_name: string;
}

export interface PartNumberData {
  id: number;
  part_number: string;
  part_name: string;
  status: number;
}

export interface RawPartDetail {
  sample_order_part_mapper_id: number;
  part_number_id: number;
  order_quantity: number;
  status: number;
}

export interface VendorType {
  id: number;
  vendor_type_name: string;
  status: number;
}

export interface DataGridParams {
  row: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface FileUploadData {
  id?: string | number;
  document_id?: string | number;
  [key: string]: any;
}

export interface FileManagerSubmitData {
  create_meta_data: Record<string, any>;
  update_meta_data: Record<string, any>;
  documents_to_create: File[];
  documents_to_delete: string[];
}

export interface DocumentData {
  id: string;
  fileName: string;
  source: string;
  dateOfUpload: string;
  fileCategory: string;
  fileStatus: string;
}

export interface ModalFormData {
  partNumber: string;
  orderQuantity: string;
}

export interface ModalValidationErrors {
  partNumber: string;
  orderQuantity: string;
}

export interface SamplePurchaseOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ModalFormData) => void;
  initialData?: ModalFormData;
  partNumbersData?: { data: PartNumberData[] };
  editingPartId?: string | null;
}

export type SaveType = 'draft' | 'final';

// Draft payload structure matching API response format
export interface DraftPayload {
  sample_order_id?: number | string;
  vendor_id?: number | string;
  vendor_name?: string;
  vendor_type_id?: number | string;
  vendor_type?: string;
  purchase_order_date?: string | null;
  purchase_order_number?: string;
  part_details?: Array<{
    sample_order_part_mapper_id?: number | null;
    part_number_id?: number | null;
    part_number?: string | null;
    part_name?: string | null;
    products?: any[];
    order_quantity?: number | null;
    status: number;
  }>;
  documents?: any[];
}