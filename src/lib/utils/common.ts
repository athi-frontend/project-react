import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  FileData2,
} from '@/components/ui/file-upload-v2/fileUploadTypes'
import { BUTTON_ORDER, DEFAULT_DATEZONE, NUMBERMAP } from '@/constants/common'
import { downloadS3FileAsBlob } from '@/services/common'
import { showActionAlert } from '@/components/ui'
import axios from 'axios'
import { FAILED_ALERT } from '@/constants/modules/dnd/formTeam'
// @ts-ignore
import { DateTime } from 'luxon';
import { store } from '@/store/store';

import dayjs from 'dayjs';


/**
    Classification : Confidential
**/
export const handleDownloadSuccess = async (
  assetUrl: string,
  documentName: string
) => {
  try {
    const fileResponse = await axios.get(assetUrl, {
      responseType: "blob",
    })
    const blob = fileResponse.data
    const name = `${documentName.replace(/\s+/g, '_')}`
    handleFileDownloadUtil({ blob, name })
  } catch {
    showActionAlert(FAILED_ALERT)
  }
}
export const theme = {
  '--primary-color': '',
  '--secondary-color': '',
  '--text-color': '',
  '--text-dark-color': '',
  '--background-color': '',
  '--white-color': '',
  '--dropdown-hover-color': '',
  '--primary-hover-color': '',
  '--grey-color': '',
  '--btnHover-bg-color': '',
  '--gridtable-bg-color': '',
  '--gridtable-text-color': '',
  '--header-title': '',
  '--header-stroke': '',
  '--black-color': '',
  '--menuHover-color': '',
}

//numberValidation for natural number
export const numberValidation = /^\d+(\.\d+)?$/
// Whole number validation: positive integers only (no decimals)
export const wholeNumberValidation = /^\d+$/
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const DecimalNumber = /^\d+(\.\d*)?$|^\.\d+$/
export const DecimalNumberMax5Places = /^\d+(\.\d{0,5})?$|^\.\d{1,5}$/
// Currency validation: positive number with max 2 decimal places
export const currencyValidation = /^\d+(\.\d{0,2})?$/
export const nonDigitRegex = /[^0-9]/g
export const COMMON_CONSTANTS = {
  IN_ACTIVE_STATUS: NUMBERMAP.ZERO,
  ACTIVE_STATUS: NUMBERMAP.ONE,
  ACTIVE_STATUS_TEXT: 'Active',
  IN_ACTIVE_STATUS_TEXT: 'Inactive',
  VALUE_YES: 'Yes',
  VALUE_NO: 'No',
  USER_EXISTS_CODE: NUMBERMAP.FOURHUNDRED + NUMBERMAP.NINE,
  SUCCESS_CODE: NUMBERMAP.TWOHUNDRED,
  USER_EXISTS_TEXT: {
    title: 'Access Denied',
    text: 'User already exists for this responsibility.',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
  FORM_VALIDATION_ERROR: {
    title: 'Something went Wrong!',
    text: 'ID not found for field: ',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
  SUCCESS_ALERT: 'success',
  FAILED_ALERT: 'failed',
  DENIED_ALERT: 'denied',
  DELETE_ALERT: 'delete',
  INDEX_ZERO: 0,
  INDEX_ONE: 1,
  EMPTY_ARRAY_LENGTH: 0,
  INSERT: 'insert',
  UPDATE: 'update',
  ACTIONS_FIELD: 'actions',
  ACTIONS_HEADER: 'Actions',
} as const

export const BUTTONLABELS = {
  BUTTON_LABEL_CANCEL: 'Cancel',
  BUTTON_LABEL_SAVE: 'Save',
  BUTTON_LABEL_BACK: 'Back',
} as const

export const PAGINATION: { PAGE_NUMBER: number; PAGE_SIZE: number } = {
  PAGE_NUMBER: 1,
  PAGE_SIZE: NUMBERMAP.TEN,
}

export const stripHtml = (html: string): string => {
  if (!html) return ''
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || html
}

export const handleFileDownloadByUrl = (assetUrl, filename) => {
  downloadS3FileAsBlob(assetUrl)
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename; // change based on expected type
      a.click();
      URL.revokeObjectURL(blobUrl);
    })
    .catch(err => {
      console.error('Error downloading file:', err);
    });
}

export const handleFileDownloadUtil = ({
  file,
  blob,
  name,
}: {
  file?: File
  blob?: Blob
  name?: string
}) => {
  const url = window.URL.createObjectURL(blob ?? file)
  const a = document.createElement('a')
  a.href = url
  a.download = name ?? file?.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const handleArrayBufferDownload = async ({bufferData,fileName,version,type}:{bufferData:any,fileName:string,version:string,type:string}) => {
  try {
    // Convert buffer object to Uint8Array
    const bufferLength = Object.keys(bufferData).length;
    const uint8Array = new Uint8Array(bufferLength);

    // Fill the Uint8Array with the buffer data
    for (let i = 0; i < bufferLength; i++) {
      uint8Array[i] = bufferData[i];
    }

    // Convert to blob and download
    const blob = new Blob([uint8Array], { type: 'application/pdf' });

    handleFileDownloadUtil({
      blob,
      name: `${fileName}_${version}.${type}`
    });
  } catch (error) {
    console.error('Error downloading array buffer file:', error);
  }
};

export const INITIALFILE = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
}

export interface FinalFileData {
  documents_to_create: File[]
  documents_to_delete: string[]
  create_meta_data: Record<string, any>
  update_meta_data: Record<string, any>
  local_files_to_delete: string[]
}

/**
 * Helper function to check if finalFileData has any data
 * @param finalFileData - The FinalFileData object to check
 * @returns boolean indicating if the file data has any content
 */
export const hasFileData = (finalFileData: FinalFileData): boolean => {
  return Object.entries(finalFileData).some(([key, val]) => {
    if (Array.isArray(val)) {
      return val.length > NUMBERMAP.ZERO
    }
    if (val && typeof val === 'object') {
      return Object.values(val).some((nestedVal) => {
        if (nestedVal && typeof nestedVal === 'object') {
          return Object.keys(nestedVal).length > NUMBERMAP.ZERO
        }
        return !!nestedVal
      })
    }
    return !!val
  })
}

const filterDocumentsToDelete = (documentsToDelete: any[]) => {
  return documentsToDelete?.filter((item: any) => item !== null) || []
}

function removeFileById(
  filesObject: Record<string, any>,
  idsToRemove: string[]
): Record<string, any> {
  if (!filesObject || typeof filesObject !== 'object') {
    throw new Error('Invalid files object');
  }

  if (!Array.isArray(idsToRemove)) {
    throw new Error('IDs to remove must be an array');
  }

  const newFilesObject: Record<string, any> = { ...filesObject };

  idsToRemove.forEach((id) => {
    const fileKey = `${id}.pdf`;
    if (newFilesObject.hasOwnProperty(fileKey)) {
      delete newFilesObject[fileKey];
    } else {
      console.warn(`Key "${fileKey}" not found in filesObject.`);
    }
  });

  return newFilesObject;
}

export const mergeFinalFileData = (
  prev: FinalFileData,
  data: Partial<FinalFileData>
): FinalFileData => {
  // Merge all arrays and objects
  const mergedData = {
    ...prev,
    documents_to_create: [
      ...prev.documents_to_create,
      ...(data.documents_to_create ?? []),
    ],
    documents_to_delete: filterDocumentsToDelete([
      ...prev.documents_to_delete,
      ...(data.documents_to_delete ?? []),
    ]),
    create_meta_data: {
      ...prev.create_meta_data,
      ...(data.create_meta_data ?? {}),
    },
    update_meta_data: {
      ...prev.update_meta_data,
      ...(data.update_meta_data ?? {}),
    },
    local_files_to_delete: filterDocumentsToDelete([
      ...prev.local_files_to_delete,
      ...(data.local_files_to_delete ?? []),
    ]),
  };
 
  // Filter out files from documents_to_create that match crypto IDs in local_files_to_delete
  if (mergedData.local_files_to_delete.length > 0) {
    mergedData.documents_to_create = mergedData.documents_to_create.filter(
      (file: any) => {
        // Extract crypto ID from filename (remove file extension)
        const lastDotIndex = file.name.lastIndexOf('.')
        const cryptoId = lastDotIndex !== -1 ? file.name.substring(0, lastDotIndex) : file.name
        return !mergedData.local_files_to_delete.includes(cryptoId)
      }
    );
    mergedData.create_meta_data = removeFileById(mergedData.create_meta_data,mergedData.local_files_to_delete)
  }
 
  return mergedData;
}

export const removelocalFileData = (deleteFile,filesList)=>{
    if (deleteFile.length > NUMBERMAP.ZERO) {
     return filesList.filter(
      (document: any) => {
        // Extract crypto ID from filename (remove file extension)
        const lastDotIndex = document?.file.name.lastIndexOf('.')
        const cryptoId = lastDotIndex !== -1 ? document?.file.name.substring(NUMBERMAP.ZERO, lastDotIndex) : document?.file.name
        return !deleteFile.includes(cryptoId)
      }
    );
  }
}

type MetaData = {
  fileName: string
  source: string
  date_of_upload: string
  categoryId?: number
  file_status?: string | number
  purpose: string
  tags?: string[]
}

type CreateEntry = {
  fk_eqms_supporting_file_id?: string
  fileName: string
  source: string
  date_of_upload: string
  categoryId: number | null
  file_status: string | number | null
  purpose: string
  tags: string[]
}

type RestructuredData = {
  create: Record<string, Record<string, CreateEntry>>
  update: Record<string, Record<string, CreateEntry>>
  delete: Record<string, Record<string, number[]>>
}


export function restructureData(
  finalFileData: FinalFileData,
  createTables: { table: string; idColumn?: string }[],
  updateTables: { table: string; idColumn?: string }[],
  deleteTableColumnMap: Record<string, string>,
): RestructuredData {
  const result: RestructuredData = { create: {}, update: {}, delete: {} }
  if (
    finalFileData.create_meta_data &&
    Object.keys(finalFileData.create_meta_data).length
  ) {
    populateCreateSection(
      result.create,
      finalFileData.create_meta_data,
      createTables
    )
  }

  if (
    finalFileData.update_meta_data &&
    Object.keys(finalFileData.update_meta_data).length
  ) {
    populateUpdateSection(
      result.update,
      finalFileData.update_meta_data,
      updateTables
    )
  }

  if (
    finalFileData.documents_to_delete &&
    Object.keys(finalFileData.documents_to_delete).length
  ) {
    populateDeleteSection(
      result.delete,
      finalFileData.documents_to_delete,
      deleteTableColumnMap,
    )
  }

  return result
}

function populateCreateSection(
  createResult: RestructuredData['create'],
  createMeta: FinalFileData['create_meta_data'],
  tables: { table: string; idColumn?: string }[]
) {
  for (const { table, idColumn } of tables) {
    createResult[table] = {}

    for (const [fileName, meta] of Object.entries(createMeta)) {
      createResult[table][fileName] = {
        [idColumn]: '{fileId}',
        fileName: meta.fileName,
        source: meta.source ?? null,
        date_of_upload: meta.date_of_upload,
        categoryId: meta.categoryId ?? null,
        file_status: COMMON_CONSTANTS.ACTIVE_STATUS,
        purpose: meta.purpose ?? null,
        tags: meta.tags ?? [],
        description: meta.description ?? null,
      }
    }
  }
}

function populateUpdateSection(
  updateResult: RestructuredData['update'],
  updateMeta: FinalFileData['update_meta_data'],
  tables: { table: string; idColumn?: string }[]
) {
  for (const { table } of tables) {
    updateResult[table] = {}

    for (const [id, meta] of Object.entries(updateMeta)) {
      updateResult[table][id] = {
        fileName: meta.fileName,
        source: meta.source ?? null,
        date_of_upload: meta.date_of_upload ?? '',
        categoryId: meta.categoryId ?? null,
        file_status: meta.file_status ?? null,
        purpose: meta.purpose ?? null,
        tags: meta.tags ?? [],
        description: meta.description ?? null,
      }
    }
  }
}

const getDraftedDeleteDocuments = (draftData,documentsToDelete)=>{
  let finalDeleteDocuments = []
  if(draftData?.data?.draftedDocDelete && draftData?.data?.draftedDocDelete.length > 0){
     finalDeleteDocuments = [...documentsToDelete,...draftData?.data?.draftedDocDelete].filter((document:any)=>document !== null && document !== undefined)
  }else{
    finalDeleteDocuments = documentsToDelete
  }
  return finalDeleteDocuments
}
function populateDeleteSection(
  deleteResult: RestructuredData['delete'],
  documentsToDelete: FinalFileData['documents_to_delete'],
  tableColumnMap: Record<string, string>,
) {
  if (!documentsToDelete?.length) return

  for (const [table, column] of Object.entries(tableColumnMap)) {
    deleteResult[table] = { [column]: documentsToDelete }
  }
}

export const handleFileUpload = (
  newFile: File | FileData2,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  setErrors: React.Dispatch<React.SetStateAction<any>>,
  errors: Partial<Record<string, string>>,
  uploadedField: string = 'uploadedFile',
  errorKey: keyof typeof errors = 'uploadedFile'
) => {
  setFormData((prev: any) => ({
    ...prev,
    [uploadedField]: [...prev[uploadedField], newFile] as File[] | FileDocument[],
  }))

  if (errors[errorKey]) {
    setErrors((prev: any) => ({
      ...prev,
      [errorKey]: '',
    }))
  }
}

export const handleFileEdit = (
  updatedFile: FileData2,
  setFormData: React.Dispatch<React.SetStateAction<any>>,
  uploadedField: string = 'uploadedFile',
) => {
  setFormData((prev: any) => {
    const updatedFiles = prev[uploadedField]?.map((file: any) => {
      const currentId =
        typeof file === 'object'
          ? (file.file_id ?? file.id ?? file.document_id)
          : undefined
      const updatedId = updatedFile.document_id ?? updatedFile.id

      return currentId === updatedId ? { ...file, ...updatedFile } : file
    })
    return {
      ...prev,
      [uploadedField]: updatedFiles,
    }
  })
}

export const handleClearLocalStorage = () => {
  localStorage.clear()
}
export const handleStoreSessionData = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}
export const handleRemoveSessionData = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}


export const QUERYCONSTANTS = {

  ALERT_TYPES: {
    SUCCESS: 'success',
    CUSTOM_ALERT: 'customAlert',
  },
  ALERT_MESSAGES: {
    ACCESS_DENIED_TITLE: 'Access Denied',
    PAGE_DENIED: 'Access denied for this page',
    ERROR_ICON: 'error',
  },
}

export function processButtonsWithPermissions(
  permissions: { action: string; trigger_status_id?: number }[],
  actionHandlers: Record<string, (id: number) => void>,
  isDisabled?: boolean,
  hideSaveButton?: boolean
): {
  buttons: { label: string; onClick: () => void; disabled?: boolean }[] | null;
  hasEditPermission: boolean;
} {
  const hasViewPermission = permissions.some((perm) => perm.action.toLowerCase() === 'view');
  const hasEditPermission = permissions.some((perm) => perm.action === 'Save');

  if (!hasViewPermission) {
    return {
      buttons: null,
      hasEditPermission: false
    };
  }

  /**
     * Description: filter out save button if hideSaveButton is true,
     * Author: Prithiviraj,
     * modified: 23-08-2025,
     * Classification : Confidential
  **/

  const buttons = permissions
    .filter((perm) => {
      // Filter out view and Add New actions
      if (perm.action.toLowerCase() === 'view' || perm.action === 'Add New') {
        return false;
      }
      // Filter out Save button if hideSaveButton is true
      if (hideSaveButton && perm.action === 'Save') {
        return false;
      }
      return true;
    })
    .map((perm) => ({
      label: perm.action,
      onClick: () => actionHandlers[perm.action]?.(perm.trigger_status_id || NUMBERMAP.ZERO),
      disabled: perm.action === 'Save' ? isDisabled : false,
    }))
    .sort((a, b) => {
    /**
     * Function Name: buttons
     * Description: Sorting the buttons based on the order of the buttons,
     * Author: Prithiviraj,
     * Created: 14-08-2025 
     * Classification : Confidential
    **/
      const aIndex = BUTTON_ORDER.indexOf(a.label);
      const bIndex = BUTTON_ORDER.indexOf(b.label);

      // If both buttons are in the order array, sort by their position
      if (aIndex !== -NUMBERMAP.ONE && bIndex !== -NUMBERMAP.ONE) {
        return aIndex - bIndex;
      }

      // If only one button is in the order array, prioritize it
      if (aIndex !== -NUMBERMAP.ONE) return -NUMBERMAP.ONE;
      if (bIndex !== -NUMBERMAP.ONE) return NUMBERMAP.ONE;

      // If neither button is in the order array, maintain original order
      return NUMBERMAP.ZERO;
    });

  return {
    buttons, hasEditPermission
  };
}

let criticalRequestPromise: Promise<void> | null = null;
let resolveCriticalRequest: (() => void) | null = null;
let isCriticalRequestDone = false;
let roleIdGlobal: string | null = null;
let tenantKeyGlobal: string | null = null;
let orgIdGlobal:string | null = null

export function startCriticalRequest() {
  if (!criticalRequestPromise) {
    criticalRequestPromise = new Promise<void>((resolve) => {
      resolveCriticalRequest = resolve;
    });
  }
}

export function finishCriticalRequest(roleId: string, tenantKey: string, orgId:string) {
  if (!tenantKeyGlobal) {
    tenantKeyGlobal = tenantKey;
  }
  if (!roleIdGlobal) {
    roleIdGlobal = roleId
  }
   if (!orgIdGlobal) {
    orgIdGlobal = orgId
  }
  if (roleId) {
    isCriticalRequestDone = true;
    resolveCriticalRequest?.();
  }

}

export function getRoleId(): string | null {
  return roleIdGlobal;
}
export function getTenantKey(): string | null {
  return tenantKeyGlobal;
}
export function getOrgId(): string | null {
  return orgIdGlobal;
}
export async function waitForCriticalRequestIfNeeded(): Promise<void> {
  if (!isCriticalRequestDone && criticalRequestPromise) {
    await criticalRequestPromise;
  }
}
export const formatValue = (value, fallback = '-') => {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }
  return fallback;
};

// Helper to extract error message from API error
export const getApiErrorMessage = (err: any): string => {
  if (!err) return 'Something went wrong';
  // Axios error with response.data.message
  if (err.response?.data?.description) return err.response.data.description;
  // Direct message
  if (err.message) return err.message;
  // Fallback
  return 'Something went wrong';
};

// Global error state for alert modal
let lastApiError = null;

export const getLastApiError = () => lastApiError;
export const clearLastApiError = () => { lastApiError = null; };
export const setLastApiError = (error: any) => { lastApiError = error; };

export const getPointerEventHandler = (hasPermission: boolean): React.CSSProperties => {
  return hasPermission ? {} : { pointerEvents: 'none' };
};


export const getHypen = (value: string) => {
  return value?.trim() ? value : '-';
};

const orgBaseFormat = ()=>{
    const state = store.getState();

    return {format:state.menu?.profileData?.organization_date_format??DEFAULT_DATEZONE.format,zone:state.menu?.profileData?.organization_timezone_code??DEFAULT_DATEZONE.zone,zonename:state?.menu?.profileData?.organization_timezone_name??'India Standard Time'}
}
export function convertUtcToLocal(utcDateString: string, format?: string) {

  const defaultFormat = orgBaseFormat() ?? DEFAULT_DATEZONE.zone;

  const date = DateTime.fromISO(utcDateString, { zone: defaultFormat.zone ?? DEFAULT_DATEZONE.zone})
    .toFormat(format || defaultFormat.format);
  return date;
}

export function convertUtcToLocalAPI(utcDateString: string, format?: string) {
  const localZone = DateTime.local().zoneName;
  const date = DateTime.fromISO(utcDateString, { zone: DEFAULT_DATEZONE.zone})
    .setZone(localZone)
    .toFormat(format);
  return date;
}

export function normalizeFormatString(formatStr:string) {
  return formatStr
    .replace(/yyyy/g, 'YYYY')
    .replace(/dd/g, 'DD')
    .replace(/MM/g, 'MM');  // MM stays MM, but keep for clarity
}

export function convertMuiDayjsToUTC(inputDate: any): string | null {
  if (!inputDate) return null;

  // Ensure it's a Day.js object
  const parsed = dayjs(inputDate);

  if (!parsed.isValid()) return null;

  const localZone = DateTime.local().zoneName;

  const luxonDate = DateTime.fromISO(parsed.toISOString(), {
    zone: localZone,
  });

  return luxonDate.toUTC().toISO(); // e.g. 2025-07-24T18:30:00.000Z
}

/**
 * Returns date as-is or null if nothing is there
 * @param date - Date value
 * @returns Date string or null
 */
export function formatDate(date: string | Date | any, dateFormat='YYYY-MM-DD'): (string | null ){
  if (!date) return null;
  // Handle Day.js objects
  if (dayjs.isDayjs(date)) {
    const OutPutDate =  convertMuiDayjsToUTC(date)
    return convertUtcToLocal(OutPutDate);
  }
  
  // Handle all other date formats (timestamps, date strings, Date objects)
  const parsed = dayjs(date);
  return parsed.isValid() ? convertUtcToLocal(convertMuiDayjsToUTC(parsed)) : null;
}

export function formatDateForAPI(date: string | Date | any, dateFormat='yyyy-MM-dd'): (string | null ){
  if (!date) return null;
  // Handle Day.js objects
  if (dayjs.isDayjs(date)) {
    const OutPutDate =  convertMuiDayjsToUTC(date)
    return convertUtcToLocalAPI(OutPutDate,dateFormat);
  }
  
  // Handle all other date formats (timestamps, date strings, Date objects)
  const parsed = dayjs(date);
  return parsed.isValid() ? convertUtcToLocalAPI(convertMuiDayjsToUTC(parsed),dateFormat) : null;
}

/**
 * Safely format datetime values using Luxon with multiple parsing attempts
 * @param dateTime - Date time string to format
 * @param format - Optional format string (defaults to 'MM/dd/yyyy hh:mm a')
 * @returns Formatted date string or empty string if invalid
 */
export function formatDateTime(dateTime: string | null | undefined, format: string = 'MM/dd/yyyy hh:mm a'): string {
  if (!dateTime || dateTime.trim() === '') return '';
  
  // Try to parse the datetime with Luxon
  let luxonDate = DateTime.fromISO(dateTime);
  
  // If ISO parsing fails, try other common formats
  if (!luxonDate.isValid) {
    luxonDate = DateTime.fromSQL(dateTime) ?? DateTime.fromRFC2822(dateTime);
  }
  
  // If still invalid, return empty string
  if (!luxonDate.isValid) {
    return '';
  }
  
  // Convert to local timezone and format
  const localZone = DateTime.local().zoneName;
  const localDate = luxonDate.setZone(localZone);
  
  // Format the date
  const formattedDate = localDate.toFormat(format);
  return formattedDate === 'Invalid DateTime' ? '' : formattedDate;
}

/**
 * Returns an item with the given id from the provided data array, or null if not found.
 * Used for handling inclusion of inactive items in dropdowns.
 */
export function getItemByIdFromArray<T extends { id: number }>(id: number, data: T[]): T | null {
  if (!id || !data || !Array.isArray(data)) return null;
  return data.find((item) => String(item.id) === String(id)) || null;
}

export const isDocumentUploadValid = (finalFileData: FinalFileData, supportingFiles: any): boolean => {
  // Check if there are files to upload or files already uploaded and not deleted
  const hasToCreate = Array.isArray(finalFileData.documents_to_create) && finalFileData.documents_to_create.length > NUMBERMAP.ZERO;
  const filteredSupportingFiles = supportingFiles?.filter((file: any) => ![...finalFileData.documents_to_delete, ...finalFileData.local_files_to_delete].includes(file.file_id ?? file?.file?.name?.toString()?.split('.')[NUMBERMAP.ZERO]))??[]
  return hasToCreate || filteredSupportingFiles?.length > NUMBERMAP.ZERO;
}


const standardObjectMap = (item: any) => {
  return {
    description: item?.file_description ?? "",
    source: item?.source ?? "",
    document_type:item?.document_type,
    purpose: item?.purpose ?? "",
    ...item,
    file_status: item?.status ?? NUMBERMAP.ZERO,
    categoryId: item?.file_category_id ?? null,
    fileName: item?.file_name ?? "",
    date_of_upload: item?.uploaded_date ?? "",
    tags: item?.file_tags.map((tag: any) => tag.tag_name) ?? []
  }
}


const standardObjectMapForMaindata = (item: any) => {
  return {
    description: item?.file_description ?? "",
    source: item?.source ?? "",
    document_type:item?.document_type,
    purpose: item?.purpose ?? "",
    ...item,
    file_status: item?.status ?? NUMBERMAP.ZERO,
    categoryId: item?.categoryId??item?.file_category_id ?? null,
    fileName: item?.file_name ?? "",
    date_of_upload: item?.uploaded_date ?? "",
    tags: item?.tags??item?.file_tags.map((tag: any) => tag.tag_name) ?? []
  }
}

export function mapFileResponse(apiResponse: any[]) {
  if (!Array.isArray(apiResponse)) return [];
  return apiResponse.map(item => {
    // If file_tags does NOT exist, return item as-is
    if (!Array.isArray(item?.file_tags)) {
      return item;
    }
    // If file_tags exists, return mapped structure
    const mapped: any = standardObjectMap(item);
    return mapped;
  });
}


export function mapDocumentsByCategory(data: any) {
  if (!data || typeof data !== 'object') return data;
  const result: any = {};
  Object.keys(data).forEach(key => {
    const value = data[key];
    // Only process arrays
    if (!Array.isArray(value)) {
      result[key] = value;
      return;
    }
    result[key] = value.map(item => {
      // If file_tags does NOT exist or is empty → return item as-is
      if (!Array.isArray(item?.file_tags) || item?.file_tags.length==NUMBERMAP.ZERO) {
        return item;
      }
      // If file_tags exists → map
      return standardObjectMapForMaindata(item);
    });
  });

  return result;
}

export const withFullName = (data:[],fieldOne:string,fieldTwo:string) =>{
  if (!Array.isArray(data)) return [];
  return data.map((row) => ({
  ...row,
  fullName: `${row?.[fieldOne] ?? ''} ${row?.[fieldTwo] ?? ''}`.trim(),
}))
}