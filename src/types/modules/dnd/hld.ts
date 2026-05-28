import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface Option {
  key: string
  value: string
}
export interface FileMetaData {
  fileName: string
  source: string
  date_of_upload: string
  categoryId: number
  purpose: string
  file_status: string | number
  tags: string[]
}

export interface TableHeader {
  field: string
  headerName: string
  width?: string
  action?: (rowData: any) => React.ReactNode
}

export interface TableComponentProps {
  data: any[]
  headers: TableHeader[]
}

export interface TableRowComponentProps {
  data: any
  headers: TableHeader[]
}

export interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

export interface ButtonGroupProps {
  buttons: ButtonProps[]
}

export interface InputFieldProps {
  label: string
  placeholder: string
  isDropdown?: boolean
  isMultiSelect?: boolean
  value: string | string[]
  onChange: (value: string | string[]) => void
  error?: string
  options?: Option[]
}

export interface FileUploadProps {
  onChange: (file: File | null) => void
  error?: string
}

export interface CheckboxOption {
  id: string
  label: string
  checked: boolean
}

export interface CheckboxGroupProps {
  options: CheckboxOption[]
  onChange: (id: string, checked: boolean) => void
}

export interface MarketSegmentRow {
  segment_id: number | string
  segment?: string
  percentage_of_use?: number 
  is_applicable?: number
}

export interface HldMarket {
  market_segment_id: number
  market_segment: string
}

export interface DemographyRow {
  id: string
  category: string
  options: CheckboxOption[]
}

export interface RegionRow {
  id: string
  label_id: number
  region: string
  selected: boolean
}

export interface Label {
  sub_category_id: number
  sub_category_name: string
}

export interface MarketDemography {
  market_demography_category_id: number | string
  market_demography: string
  sub_category: Label[]
}

export interface CompetitiveLandscapeRow {
  id: string
  market_segment: string
  major_competitor: string
  segment_share: string
  price_range: string
  handleSubmit: () => void
}

export interface SolutionRequirementsRow {
  id: string
  must_have: string
  nice_to_have: string
  wont_have: string
  handleSubmit: () => void
}

export interface ConversionRateRow {
  id: string
  target_geography: string
  target_segment: string
  target_customer_segment: string
  conversion_1: string
  conversion_2: string
  conversion_3: string
  handleSubmit: () => void
}

export interface MarketSegmentTableProps {
  rows: MarketSegmentRow[]
  onRowChange: (row: MarketSegmentRow) => void
}

export interface DemographyTableProps {
  rows: DemographyRow[]
  onOptionChange: (rowId: string, optionId: string, checked: boolean) => void
  onSpecialCategoryChange: (value: string) => void
  specialCategory: string
}

export interface RegionTableProps {
  rows: RegionRow[]
  onRowChange: (rowId: string, selected: boolean) => void
}

export interface CompetitiveLandscapeTableProps {
  rows: CompetitiveLandscapeRow[]
  onAddRow: () => void
  onEditRow: (row: CompetitiveLandscapeRow) => void
  onDeleteRow: (id: string) => void
}

export interface SolutionRequirementsTableProps {
  rows: SolutionRequirementsRow[]
  onAddRow: () => void
  onEditRow: (row: SolutionRequirementsRow) => void
  onDeleteRow: (id: string) => void
}

export interface ConversionRateTableProps {
  rows: ConversionRateRow[]
  onAddRow: () => void
  onEditRow: (row: ConversionRateRow) => void
  onDeleteRow: (id: string) => void
}

export interface SectionHeaderProps {
  title: string
}

export interface MarketDemographyLabel {
  label_id: number
  label: string
}

export interface DemographyOption {
  sub_category_id: number
  sub_category_name: string
  selected?: boolean
}

export interface DemographySelectionItem {
  sub_category_id: number
  selected: number
}

export interface RegionOption {
  id: string
  label_id: number
  region: string
  selected: boolean
}

export interface HldInfo {
  tid: number
  eid: number
  project_id: number
  product_intended_use: string | null
  product_generic_name: string | null
  product_application: string | null
  market_scenario: string | null
  competitive_products: string | null
  market_size: string | null
  target_geography: string | null
  target_segment: string | null
  target_audience: string | null
  initial_success_factors: string | null
  growth_sustaining_factors: string | null
  strategic_marketing_requirements: string | null
  demand_generation_plan: string | null
  potential_business_risks: string | null
  market_segment: MarketSegmentRow[]
  market_demography: []
  competitive_landscape: []
  design_requirements: []
  conversion_rate: []
  document: File[]
}

export interface SubCategory {
  sub_category_id: number
  sub_category_name: string
  selected?: number | string
}

export interface MarketDemographyData {
  market_demography_category_id: number
  market_demography: string
  order: number
  sub_category: SubCategory[]
}

export interface DemographyRowData {
  id: string
  market_demography_category_id: number
  category: string
  options: {
    id: string
    label_id: number
    label: string
    checked: boolean
  }[]
}

export interface DemographySelections {
  market_demography_category_id: number
  sub_category: SubCategory[]
}

export interface DemographySelectionOutput {
  sub_category_id: number
  selected: number | string
}

export interface InputDesignFormData {
  productName: string
  intendedUse: string
  applications: string
  marketScenario: string
  competitiveProducts: string
  marketSize: string
  targetGeography: string
  targetSegment: string
  targetAudience: string
  initialSuccessFactor: string
  growthSustainingFactor: string
  strategicMarketing: string
  demandGenerations: string
  potentialRisk: string
  uploadedFile: File[] | FileDocument[]
  specialCategory: string
  marketSegmentRows: MarketSegmentRow[]
  demographyRows: DemographyRowData[]
  regionRows: RegionRow[]
  competitiveLandscapeRows: CompetitiveLandscapeRow[]
  solutionRequirementsRows: SolutionRequirementsRow[]
  conversionRateRows: ConversionRateRow[]
  documentIdToDelete: number[]
}

export interface InputDesignFormErrors {
  productName: string
  intendedUse: string
  applications: string
  marketScenario: string
  competitiveProducts: string
  targetGeography: string
  targetSegment: string
  targetAudience: string
  uploadedFile: string
}

export interface ModalStates {
  competitiveLandscapeModalOpen: boolean
  solutionRequirementsModalOpen: boolean
  conversionRateModalOpen: boolean
}

export interface EditingStates {
  editingCompetitiveLandscapeRow: CompetitiveLandscapeRow | null
  editingSolutionRequirementsRow: SolutionRequirementsRow | null
  editingConversionRateRow: ConversionRateRow | null
}
export interface DeleteStates {
  deleteCompetitiveLandscapeRow: CompetitiveLandscapeRow | null
  deleteSolutionRequirementsRow: SolutionRequirementsRow | null
  deleteonversionRateRow: ConversionRateRow | null
}

export interface UploadedFileData {
  id: string
  name: string
  file?: File
  source: string
  uploadDate: string
  category: string
  status: string
  document_id?: number
}

export interface DocumentStructure {
  documents_to_create: string[]
  documents_to_delete: string[]
  create_meta_data: Record<string, string>
  update_meta_data: Record<string, string>
  local_files_to_delete: string[]
}
