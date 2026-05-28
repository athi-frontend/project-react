import {
  MarketDemographyData,
  DemographyRowData,
  RegionOption,
  DemographySelections,
  RegionRow,
  DemographySelectionOutput,
} from '@/types/modules/dnd/hld'
import { ButtonProps } from '@/types/components/ui/button'
import { NUMBERMAP } from '@/constants/common'

export const maxSize = NUMBERMAP.TEN * (NUMBERMAP.THOUSAND+NUMBERMAP.TWENTYFOUR) * (NUMBERMAP.THOUSAND+NUMBERMAP.TWENTYFOUR)
export const FileSizeError = `File size should be less than ${NUMBERMAP.TEN} MB`
export const DemographyRegion = 'Region'
export const SpecialCategoryLabel = 'Special Category'

export const INITIAL_FORM_DATA = {
  productName: '',
  intendedUse: '',
  applications: '',
  marketScenario: '',
  competitiveProducts: '',
  marketSize: '',
  targetGeography: '',
  targetSegment: '',
  targetAudience: '',
  initialSuccessFactor: '',
  growthSustainingFactor: '',
  strategicMarketing: '',
  demandGenerations: '',
  potentialRisk: '',
  markets: [],
  regulations: [],
  uploadedFile: [],
  specialCategory: '',
  marketSegmentRows: [],
  demographyRows: [],
  regionRows: [],
  competitiveLandscapeRows: [],
  solutionRequirementsRows: [],
  conversionRateRows: [],
  documentIdToDelete: [],
}

export const INITIAL_FORM_ERRORS = {
  productName: '',
  intendedUse: '',
  applications: '',
  marketScenario: '',
  competitiveProducts: '',
  targetGeography: '',
  targetSegment: '',
  targetAudience: '',
  uploadedFile: '',
  markets: '',
  regulations: ''
}

export const transformMarketDemographyData = (
  data: MarketDemographyData[] = []
) => {
  const demographyRows: DemographyRowData[] = []
  let regionRows: RegionOption[] = []

  // Sort data by order field before processing
  const sortedData = [...data].sort((a, b) => a.order - b.order)

  for (const item of sortedData) {
    const isRegion = item.market_demography === DemographyRegion

    const options = item.sub_category.map((val) => ({
      id: `${item.market_demography_category_id}-${val.sub_category_id}`,
      label_id: val.sub_category_id,
      ...(isRegion
        ? { region: val.sub_category_name, selected: false }
        : { label: val.sub_category_name, checked: false }),
    }))

    if (isRegion) {
      regionRows = options as RegionOption[]
    } else {
      demographyRows.push({
        id: item.market_demography_category_id.toString(),
        market_demography_category_id: item.market_demography_category_id,
        category: item.market_demography,
        options: options as DemographyRowData['options'],
      })
    }
  }

  return { demographyRows, regionRows }
}

export const generateDemographySelections = (
  demographyRows: DemographyRowData[],
  regionRows: RegionRow[],
  specialCategory: string | null
): DemographySelectionOutput[] => {
  const result: DemographySelectionOutput[] = []

  for (const row of demographyRows) {
    const isSpecialCategory = row.category === SpecialCategoryLabel

    for (const option of row.options) {
      let selected: number | string = 0

      if (isSpecialCategory && specialCategory) {
        selected = specialCategory.trim()
      } else if (option.checked) {
        selected = 1
      }

      result.push({
        sub_category_id: option.label_id,
        selected,
      })
    }
  }

  for (const region of regionRows) {
    result.push({
      sub_category_id: region.label_id,
      selected: region.selected ? 1 : 0,
    })
  }

  return result
}

export const applySelections = (
  demographyRows: DemographyRowData[] = [],
  regionRows: RegionOption[] = [],
  selections: DemographySelections[] = []
) => {
  const specialMap = new Map<number, string | number>()
  let updatedSpecialCategory: string | undefined

  for (const selection of selections) {
    for (const sub of selection.sub_category) {
      specialMap.set(sub.sub_category_id, sub.selected)
    }
  }

  const updatedDemographyRows = demographyRows.map((row) => {
    const isSpecial = row.category === SpecialCategoryLabel
    const updatedOptions = row.options.map((opt) => {
      const selected = specialMap.get(opt.label_id)
      const checked = selected === 1
      if (isSpecial && typeof selected === 'string') {
        updatedSpecialCategory = selected
      }
      return { ...opt, checked }
    })
    return { ...row, options: updatedOptions }
  })

  const updatedRegionRows = regionRows.map((region) => ({
    ...region,
    selected: specialMap.get(region.label_id) === 1,
  }))

  return { updatedDemographyRows, updatedRegionRows, updatedSpecialCategory }
}

export const createActionButtons = (
  handleSave: () => void,
  isDisabled: boolean,
  handleCancel: () => void
): ButtonProps[] => [
  { label: 'Cancel', onClick: handleCancel },
  { label: 'Save', onClick: handleSave, disabled: isDisabled },
]
