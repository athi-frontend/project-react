import { NUMBERMAP } from "@/constants/common";
import { GridColDef, GridRenderCellParams} from "@mui/x-data-grid";
import React from "react";

export const PAGE_FORM = {
    PAGE_ID:'report',
    PAGE_TITLE: 'Verification Report',
    FORM_ID: 'verification_plan_dir_id',
    CUSTOM_CLASS_NAME: 'custom-data-grid'
}

export const STATUS_TYPE = {
  VERIFIED: 'verified',
  REJECTED: 'rejected',
  PENDING: 'pending',
  INPROGRESS: 'inprogress'
}


export const ROUTER_END_POINTS = (order_id: number, verification_plan_id: number, project_id: number) => `/dnd/verification-report/edit/${verification_plan_id}/${order_id}/${project_id}`

export const getColumn =(
    renderActionsCell?: (params: GridRenderCellParams) => React.ReactNode,
    renderStatusCell?: (params: GridRenderCellParams) => React.ReactNode,
):GridColDef[] => [
     {
      field: "sno",
      headerName: "S.No.",
      flex: NUMBERMAP.HALF,
    },
    {
      field: "dir_no",
      headerName: "DIR",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "units_to_be_verified",
      headerName: "No. of Unit to be Verified",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "status",
      headerName: "Status",
      flex: NUMBERMAP.HALF,
      renderCell: renderStatusCell
    },
    {
      field: "action",
      headerName: "Action",
      flex: NUMBERMAP.HALF,
      renderCell: renderActionsCell
    }
]