import { NUMBERMAP } from '@/constants/common'
import { COLUMN_OBJECT, DEFAULT_COLUMNS, TABLE_HEADERS } from '@/constants/modules/dnd/dirSpecificataion'
import { FormData, CustomColDef } from '@/types/components/modules/dirSpecifications'
import { GridColDef } from '@mui/x-data-grid'


/**
 Classification : Confidential
**/

export const getTableData = (physicalData: any, currentStep: number | null) =>
  physicalData?.data && currentStep !== null
    ? physicalData.data
        .filter(
          (item: any) => item.specification_applicability_id === currentStep
        )
        .map((item: any, index: number) => ({
          id: item.design_input_requirement_id ?? index + 1,
          parameter: item.parameter ?? 'Label',
          specification_description:
            item.specification_description ?? 'Description...',
          unit: item.unit ?? 'Label',
          value: item.value ?? 'Label',
          actions: item.block_variant_id ?? null,
        }))
    : []

export const getPaginationInfo = (physicalData: any, pageSize: number) =>
  physicalData?.rowsAffected ?? {
    total_pages: NUMBERMAP.ONE,
    total_count: NUMBERMAP.ZERO,
    current_page: NUMBERMAP.ONE,
    page_size: pageSize,
    next_page: null,
    prev_page: null,
    first_page: '?page=' + NUMBERMAP.ONE,
    last_page: '?page=' + NUMBERMAP.ONE,
  }

export const initialFormState: FormData = {
  parameter: '',
  unit: '',
  value: '',
  functionalBlock: '',
  models: [],
  accuracylevel: '',
  file: [],
}

export const stripHtml = (html: string) => {
  // Add a space after every closing tag to preserve separation
  const spacedHtml = html.replace(/<\/(li|p|div|br|ul|ol|h[1-6]|table|tr|td)>/gi, '</$1> ')
  const div = document.createElement('div')
  div.innerHTML = spacedHtml
  return div.textContent?.replace(/\s+/g, ' ').trim() ?? div.innerText?.replace(/\s+/g, ' ').trim() ?? ''
}
export const getColumns = (
  title: string,
  renderActions?: (params: any) => React.ReactNode
): GridColDef[] => {
  const columns: GridColDef[] = []

  if (COLUMN_OBJECT[title]) {
    COLUMN_OBJECT[title].forEach((col) => {
      const column: CustomColDef = {
        field: col.field,
        headerName: col.headerName,
        flex: col.flex ?? undefined,
        width: col.width ?? undefined,
        renderCell:
          col.field === 'actions' ? (renderActions ?? (() => null)) : undefined,
        renderHeader: (params) => {
          return (
            <b
              data-sourcename={col['data-sourcename']}
              data-fieldname={col['data-fieldname']}
            >
              {params.colDef.headerName}
            </b>
          )
        },
      }
      if (col.headerName === TABLE_HEADERS.SPECIFICATION_DESCRIPTION) {
        column.tooltip = true;
        column.renderCell = (params) => {          
          return  stripHtml(params.value ?? ''
          )
        }
        column.filterable = false
      }
      columns.push(column)
    })
    } else {
    // Default headers when no specification is loaded
    DEFAULT_COLUMNS.forEach(({ field, headerName, width, flex }) => {
      const column: GridColDef = {
        field,
        headerName,
        width,
        flex,
        renderHeader: (params) => <b>{params.colDef.headerName}</b>
      }
      columns.push(column)
    })
  }

  return columns
}
