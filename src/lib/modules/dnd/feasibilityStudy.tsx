import {
  CostFormData,
  CostFormFieldConfig,
  FormDatas,
  FormFieldConfig,
} from '@/types/modules/dnd/feasibilityStudy'
import { GridColDef } from '@mui/x-data-grid'
import { IconButton, Stack } from '@mui/material'
import { Edit, Trash } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'
import { CURRENT_COLOR } from '@/constants/components/menu'

/**
  Classification : Confidential
**/
export const stateMapping = {
  scope: 'scope',
  design_methodology: 'designMethodology',
  manufacturing_cost_per_product: 'manufacturingCost',
  project_duration: 'projectDuration',
  currency_id: 'currency',
  training_requirements: 'trainingRequirement',
  project_risks: 'projectRisk',
  dependencies: 'dependencies',
  project_impact: 'impact',
  regulatory_implications: 'regulatoryImplications',
  other_requirements: 'otherRequirements',
  conclusion: 'conclusion',
}

export const INITIAL_FORM_DATA: FormDatas = {
  scope: '',
  designMethodology: '',
  projectDuration: '',
  currency: '',
  technicalFeasibility: '',
  trainingRequirement: '',
  uploadedFile: [],
  projectRisk: '',
  dependencies: '',
  impact: '',
  regulatoryImplications: '',
  otherRequirements: '',
  conclusion: '',
  totalcost: '',
  roles: '',
}

export const INITIAL_COST_FORM_DATA: CostFormData = {
  productCost: '',
  equipmentCost: '',
  developmentalCost: '',
  manufacturingCost: '',
  otherCost: '',
}

export const COMPONENT_TYPES = {
  DESCRIPTION: 'Description',
  INPUT_FIELD: 'InputField',
  MULTI_SELECT: 'MultiSelect',
  DATA_GRID: 'DataGrid',
} as const

export const FIELD_KEYS = {
  CURRENCY: 'currency',
} as const

const createDescriptionField = (
  label: string,
  field: keyof FormDatas,
  apiKey: string,
  placeholder?: string
): FormFieldConfig => ({
  type: COMPONENT_TYPES.DESCRIPTION,
  label,
  placeholder: placeholder ?? label.replace(/\*$/, ''),
  validationLabel: label.replace(/\*$/, ''),
  field,
  apiKey,
})

const createInputField = (
  label: string,
  field: keyof FormDatas,
  apiKey: string,
  numeric = false,
  placeholder?: string
): FormFieldConfig => ({
  type: COMPONENT_TYPES.INPUT_FIELD,
  label,
  placeholder: placeholder ?? label.replace(/\*$/, ''),
  validationLabel: label.replace(/\*$/, ''),
  field,
  apiKey,
  numeric,
})

const createMultiSelectField = (
  label: string,
  field: keyof FormDatas,
  apiKey: string,
  placeholder?: string
): FormFieldConfig => ({
  type: COMPONENT_TYPES.MULTI_SELECT,
  label,
  placeholder: placeholder ?? label.replace(/\*$/, ''),
  validationLabel: label.replace(/\*$/, ''),
  field,
  apiKey,
  idField: 'currency_id',
  valueField: 'currency',
})

const createCostInputField = (
  label: string,
  field: keyof CostFormData,
  placeholder: string,
  apiKey: string,
): CostFormFieldConfig => ({
  type: COMPONENT_TYPES.INPUT_FIELD,
  label,
  placeholder: placeholder??'Enter Cost',
  validationLabel: label.replace(/\*$/, ''),
  field,
  apiKey,
  numeric: true,
  maxLength: NUMBERMAP.EIGHT,
})

export const FORM_FIELDS: FormFieldConfig[] = [
  createDescriptionField('Scope*', 'scope', 'scope', 'Enter Scope'),
  createDescriptionField(
    'Design Methodology*',
    'designMethodology',
    'design_methodology',
    'Enter Design Methodology'
  ),
  createInputField(
    'Project Duration*',
    'projectDuration',
    'project_duration',
    false,
    'Enter Project Duration'
  ),
  {
    type: COMPONENT_TYPES.DATA_GRID,
    label: 'Design Team*',
    placeholder: 'Select data',
    validationLabel: 'Design Team',
    field: 'roles',
    rows: [],
    columns: [{ field: 'id', headerName: 'ID', width: NUMBERMAP.TEN*NUMBERMAP.NINE }],
  },
  {
    type: COMPONENT_TYPES.DATA_GRID,
    label: 'Cost*',
    placeholder: 'Select data',
    validationLabel: 'Cost',
    field: 'totalcost',
    rows: [],
    columns: [{ field: 'id', headerName: 'ID', width: NUMBERMAP.TEN*NUMBERMAP.NINE }],
  },
  createMultiSelectField(
    'Currency',
    'currency',
    'currency_id',
    'Select Currency'
  ),
  createDescriptionField(
    'Technical Feasibility*',
    'technicalFeasibility',
    'technical_feasibility',
    'Enter Technical Feasibility'
  ),
  createDescriptionField(
    'Training Requirement*',
    'trainingRequirement',
    'training_requirements',
    'Enter Training Requirement'
  ),
  createDescriptionField('Project Risk*', 'projectRisk', 'project_risks', 'Enter Project Risk'),
  createDescriptionField('Dependencies*', 'dependencies', 'dependencies', 'Enter Dependencies'),
  createDescriptionField(
    'Impact on the Ongoing Projects*',
    'impact',
    'project_impact',
    'Enter Impact on the Ongoing Projects'
  ),
  createDescriptionField(
    'Regulatory Implications*',
    'regulatoryImplications',
    'regulatory_implications',
    'Enter Regulatory Implications'
  ),
  createDescriptionField(
    'Other Requirements Identified',
    'otherRequirements',
    'other_requirements',
    'Enter Other Requirements Identified'
  ),
  createDescriptionField('Conclusion', 'conclusion', 'conclusion','Enter Conclusion'),
]

export const COST_FORM_FIELDS: CostFormFieldConfig[] = [
  createCostInputField(
    'Product Bill of Material Cost*',
    'productCost',
    'Enter Product Bill of Material Cost',
    'bom_cost'
  ),
  createCostInputField(
    'Capital Equipment and Tool Cost*',
    'equipmentCost',
    'Enter Capital Equipment and Tool Cost',
    'capital_equipment_tool_cost',
    
  ),
  createCostInputField(
    'Developmental Cost*',
    'developmentalCost',
    'Enter Developmental Cost',
    'development_cost',
    

  ),
  createCostInputField(
    'Manufacturing Cost per Product*',
    'manufacturingCost',
    'Enter Manufacturing Cost per Product',
    'manufacturing_cost_per_product',
    
  ),
  createCostInputField(
    'Other Cost, if any', 
    'otherCost',
    'Enter Other Cost, if any',
    'other_cost'),
]


const sNoColumn: GridColDef = {
  field: 'sNo',
  headerName: 'S.No.',
  flex: NUMBERMAP.ONE,
  sortable: false,
  filterable: false,
  renderCell: (params) => params.row.sNo,
}

const actionsColumn: GridColDef = {
  field: 'actions',
  headerName: 'Actions',
  sortable: false,
  filterable: false,
  flex:NUMBERMAP.HALF,
  renderCell: (params) => (
    <Stack direction="row" spacing={NUMBERMAP.ONE}>
      <IconButton color="primary" onClick={() => params.row.onEdit(params.row)}>
        <Edit size={NUMBERMAP.EIGHTEEN} color={CURRENT_COLOR} />
      </IconButton>
      <IconButton
        color="error"
        onClick={() => params.row.onDelete(params.row.id)}
      >
        <Trash size={NUMBERMAP.EIGHTEEN} color={CURRENT_COLOR} />
      </IconButton>
    </Stack>
  ),
}

const createCostColumn = (field: string, headerName: string): GridColDef => ({
  field,
  headerName,
  flex: NUMBERMAP.ONE,
  headerAlign: 'center',
  align : 'center',
})

export const costColumns: GridColDef[] = [
  sNoColumn,
  createCostColumn('productCost', 'Product Bill of Material Cost'),
  createCostColumn('equipmentCost', 'Capital Equipment & Tool Cost'),
  createCostColumn('developmentalCost', 'Developmental Cost'),
  createCostColumn('manufacturingCost', 'Manufacturing Cost per Product'),
  createCostColumn('otherCost', 'Other Cost, if any'),
  actionsColumn,
]

export const designTeamColumns: GridColDef[] = [
  sNoColumn,
  {
    field: 'role',
    headerName: 'Design Team Role',
    flex: NUMBERMAP.ONE,
    headerAlign: 'left',
    align: 'left',
  },
  actionsColumn,
]