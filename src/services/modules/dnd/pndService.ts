export interface PNDFormField {
  item_id: number
  pnd_item: string
  item_category: string
}

export const pndFormFields: PNDFormField[] = [
  {
    item_id: 1039,
    pnd_item: 'gmdn_code',
    item_category: 'text',
  },
  {
    item_id: 1040,
    pnd_item: 'abbreviation',
    item_category: 'text',
  },
  {
    item_id: 1042,
    pnd_item: 'development_cost',
    item_category: 'text',
  },
  {
    item_id: 1044,
    pnd_item: 'buyer',
    item_category: 'chosen',
  },
  {
    item_id: 1045,
    pnd_item: 'end_user',
    item_category: 'chosen',
  },
  {
    item_id: 1046,
    pnd_item: 'competitor_information',
    item_category: 'text',
  },
  {
    item_id: 1047,
    pnd_item: 'product_features',
    item_category: 'text',
  },
  {
    item_id: 1048,
    pnd_item: 'product_specification',
    item_category: 'text',
  },
  {
    item_id: 1051,
    pnd_item: 'aerb',
    item_category: 'text',
  },
  {
    item_id: 1052,
    pnd_item: 'service_requirement',
    item_category: 'text',
  },
  {
    item_id: 1053,
    pnd_item: 'packaging_requirement',
    item_category: 'text',
  },
  {
    item_id: 1054,
    pnd_item: 'delivery_requirement',
    item_category: 'text',
  },
  {
    item_id: 1055,
    pnd_item: 'post_deleivery_requirement',
    item_category: 'text',
  },
  {
    item_id: 1056,
    pnd_item: 'environmental_requirement',
    item_category: 'text',
  },
  {
    item_id: 1057,
    pnd_item: 'documentation_requirement',
    item_category: 'text',
  },
  {
    item_id: 1058,
    pnd_item: 'target_selling_price',
    item_category: 'text',
  },
  {
    item_id: 1059,
    pnd_item: 'quantity_forecast_3_years',
    item_category: 'text',
  },
  {
    item_id: 1060,
    pnd_item: 'target_timeline_for_product_launch',
    item_category: 'text',
  },
]

export const fetchPNDFormFields = async (): Promise<PNDFormField[]> => {
  return Promise.resolve(pndFormFields)
}
