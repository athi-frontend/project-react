import { NUMBERMAP } from "@/constants/common"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import React from "react"
/**
    Classification : Confidential
**/

export const CLAUSE_FIELDS = {
    TITLE: 'QMS Clause Applicability',
    ID_FIELD: 'project_applicable_clause_id',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    DROPDOWN: {
        KEY_FIELD: 'id',
        VALUE_FIELD: 'name'
    },

    DESCRIPTION: 'Enter Task Description',
    SELECT: 'Select',
}


export const QARAHEAD_SLUG = "qara_head"

export const INITIAL_TABLE_DATA = {
    project_applicable_clause_id: '',
    id: '',
    clause_name: '',
    description: '',
    completion_status: '',
    conductedby: '',
    user_id: '',
    assign_to: '',
    is_checked: ''
}


export const getColumns = (
    renderCheckboxCell: (params: GridRenderCellParams) => React.ReactNode,
    renderDescription: (params: GridRenderCellParams) => React.ReactNode,
    reactConductedBy: (params: GridRenderCellParams) => React.ReactNode
): GridColDef[] => [
        {
            field: "is_checked",
            headerName: "Applicable",
            flex: NUMBERMAP.HALF,
            sortable: false,
            renderCell: renderCheckboxCell,
        },

        {
            field: "clause_name",
            headerName: "Applicability",
            flex: NUMBERMAP.ONE,

        },

        {
            field: "task_description",
            headerName: "Task Description",
            flex: NUMBERMAP.ONE,
            sortable: false,
            renderCell: renderDescription
        },
        {
            field: "user_id",
            headerName: 'Assign to',
            flex: NUMBERMAP.ONE,
            sortable: false,
            renderCell: reactConductedBy
        },
        {
            field: "completion_status",
            headerName: "Status of Completion",
            flex: NUMBERMAP.ONE,
            renderCell:(params)=>{
                return params.value??'-'
            }
        },

    ];

const API_BASE_PATH = 'api/v1/dnd'
const API_BASE_END = 'applicability'
export const API_ENDPOINTS = {
    FETCH_LIST: (project_id: number) => `${API_BASE_PATH}/${API_BASE_END}/${project_id}`,
    SUBMIT_APPLICABILITY: `${API_BASE_PATH}/${API_BASE_END}/`,
    INSTALLATION_PROCEDURE_PATH: (project_id: number) => `/dnd/installation-proceture/${project_id}`
}

export const QUERY_KEYS = 'appliability'
