import { AcknowledgementFormData } from "@/types/modules/dnd/acknowledgementTransfer"
import { GridColDef } from "@mui/x-data-grid"
import { NUMBERMAP } from '@/constants/common'
import React from "react"


export const ACKNOWLEDGEMENT_FORM = {
  TITLE: 'Acknowledgement of Design Transfer',
  ID_FIELD: 'document_id',
  POPUP_TITLE: 'Acknowledgement Design Transfer',
  POPUP_ID: 'file_id',
  VIEW_FILES: 'View Files',
  DOWNLOAD_FILE: 'Download File',
  ACKNOWLEDGEMENT_STATEMENT: 'Acknowledgement Statement*',
  TERMS_CONDITIONS: 'Terms and Conditions*',
}

export const INITIAL_ACKNOWLEDGEMENT_FORMDATA:AcknowledgementFormData = {
  acknowledgement_statement: 0,
  documents: [],
}
export const INITIAL_ERRORS = {
  acknowledgement_statement: ''
}


export const ERROR_MESSAGES = {
  ACKNOWLEDGEMENT_STATEMENT: 'Accept the Terms and conditions'
}

export const getColumns = (
    renderReviewedCheckbox?: (params: any) => React.ReactNode,
    renderButtonCell?: (params: any) => React.ReactNode
): GridColDef[] => [
     {
          field: "sno",
          headerName:"S.No",
          flex: NUMBERMAP.ONE,
        },
        {
          field:"document_title",
          headerName: "Check List",
          flex: NUMBERMAP.TWO,
        },
         {
          field:"design_transfer_plan_id",
          headerName: "Download",
          flex: NUMBERMAP.ONE,
          renderCell: renderButtonCell,
        },
    
        {
          field: "is_verified",
          headerName: "Verified",
          flex:NUMBERMAP.ONE,
          renderCell: renderReviewedCheckbox,
        },
]


export const getPopupColumns = (
  renderDownloadCell?: (params: any) => React.ReactNode,
  renderStatusCell?: (params: any) => React.ReactNode
): GridColDef[] => [
  {
          field:"file_name",
          headerName: "File Name",
          flex: NUMBERMAP.ONE,
        },
  {
          field:"source",
          headerName: "Source",
          flex: NUMBERMAP.ONE,
        },
        {
          field:"uploaded_date",
          headerName: "Date of Upload",
          flex: NUMBERMAP.ONE,
        },
        {
          field:"file_category",
          headerName: "File Category",
          flex: NUMBERMAP.ONE,
        },
        {
          field:"status",
          headerName: "File Status",
          flex: NUMBERMAP.ONE,
          renderCell:renderStatusCell
        },
        {
          field:"document_title",
          headerName: "Actions",
          flex: NUMBERMAP.ONE,
          renderCell: renderDownloadCell
        },
]

export const QUERY_KEYS = {
  ACKNOWLEDGEMENT: 'acknowledgement',
  DOCUMENTS:'documents'
}
const API_BASE_PATH = 'api/v1/dnd'
const API_BASE_END = 'acknowledge-design-transfer'
export const API_ENDPOINTS = {
    FETCH: (ack_id: number) => `${API_BASE_PATH}/${API_BASE_END}/${ack_id}`,
    POST_EVALUATION:(ack_id: number) => `${API_BASE_PATH}/${API_BASE_END}/${ack_id}/`,
    FETCH_DOCUMENTS_BY_ID: (design_transfer_id: number) => `${API_BASE_PATH}/design-output-document/design-transfer-plan/${design_transfer_id}`
}
