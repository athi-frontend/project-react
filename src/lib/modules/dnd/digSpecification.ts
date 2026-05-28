import { NUMBERMAP } from '@/constants/common'
import { COLUMN_CONSTANTS } from '@/constants/modules/dnd/digSpecificaton'
import { CENTER, LEFT } from '@/constants/modules/dnd/preTransferDesignOutputDocument'
import { GridColDef } from '@mui/x-data-grid'
/**
      *Classification : Confidential
**/
export const specificationListColumns: GridColDef[] = [
  { field: COLUMN_CONSTANTS.FIELD.SPEC_TYPE,
    headerName: COLUMN_CONSTANTS.HEADERS.SPECIFICATION,
    flex: NUMBERMAP.ONE },
  { 
    field: COLUMN_CONSTANTS.FIELD.DESCRIPTION, 
    headerName: COLUMN_CONSTANTS.HEADERS.DESCRIPTION, 
    flex: NUMBERMAP.ONE,
    align: LEFT,
    headerAlign: LEFT
  },
  {
    field: COLUMN_CONSTANTS.FIELD.ACTIONS,
    headerName: COLUMN_CONSTANTS.HEADERS.APPLICABLE,
    flex: NUMBERMAP.HALF,
    align: CENTER,
    headerAlign: CENTER,
    renderCell: (params) => null,
  },
]

export const initialFormData = {
  specification_applicability_id: 0,
  parameter: '',
  clauseNumber: '',
  unit: '',
  value: '',
  functionalBlock: [],
  models: [],
  accuracylevel: '',
  applicableStandards: '',
  description: '',
  uploadedFile: [],
  performanceSpecification: 0,
  type: '',
  accessories: 0,
  lifeTimeOfDevice: '',
  adverseEvents: '',
  deviceName: '',
  module: '',
  accessoriesConsumables: '',
  deviceMultiple: '',
  standards: '',
  connectivity: '',
  connectivityMode: '',
  communicationProtocol: '',
}
