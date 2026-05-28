import { PNDFormData } from '@/types/modules/dnd/pnd'

export const pndModalFieldKeys = {
  parameter: 'parameter',
  specification: 'specification',
}

export const PND_FORM_FIELD_KEYS: Partial<
  Record<keyof PNDFormData, keyof PNDFormData>
> = {
  product_generic_name: 'product_generic_name',
  gmdn_code: 'gmdn_code',
  emdn_code: 'emdn_code',
  abbreviation: 'abbreviation',
  intended_use_of_product: 'intended_use_of_product',
  development_cost: 'development_cost',
  application_of_product: 'application_of_product',
  buyer_id: 'buyer_id',
  end_user_id: 'end_user_id',
  competitor_information: 'competitor_information',
  product_features: 'product_features',
  product_category_id: 'product_category_id',
  service_requirements: 'service_requirements',
  packaging_requirements: 'packaging_requirements',
  delivery_requirements: 'delivery_requirements',
  post_delivery_requirements: 'post_delivery_requirements',
  environmental_requirements: 'environmental_requirements',
  documentation_requirements: 'documentation_requirements',
  target_selling_price: 'target_selling_price',
  quantity_forecast: 'quantity_forecast',
  target_product_launch_time_line: 'target_product_launch_time_line',
  documents: 'documents',
} as const

const isValidValue = (value: any): boolean =>
  value !== null && value !== undefined

const mapFieldValue = (
  formData: PNDFormData,
  fieldKey: keyof PNDFormData,
  value: any
): void => {
  if (!isValidValue(value)) return

  if (fieldKey === 'buyer_id' || fieldKey === 'end_user_id') {
    formData[fieldKey] = Array.isArray(value)
      ? value.map(Number)
      : [Number(value)]
  } else if (fieldKey === 'product_category_id') {
    formData[fieldKey] = value !== null ? Number(value) : null
  } else {
    formData[fieldKey] = String(value)
  }
}

export const transformPNDResponse = (response: any): PNDFormData => {
  const responseData = response[0] ?? {}

  const formData: PNDFormData = {
    product_generic_name: '',
    gmdn_code: '',
    emdn_code: '',
    abbreviation: '',
    intended_use_of_product: '',
    development_cost: '',
    application_of_product: '',
    buyer_id: [],
    end_user_id: [],
    competitor_information: '',
    product_features: '',
    product_category_id: null,
    service_requirements: '',
    packaging_requirements: '',
    delivery_requirements: '',
    post_delivery_requirements: '',
    environmental_requirements: '',
    documentation_requirements: '',
    target_selling_price: '',
    quantity_forecast: '',
    target_product_launch_time_line: '',
    documents: responseData.documents,
    models: responseData.models ?? [],
    status: response?.status ?? 'draft',
  }


  const fieldMap: { [key: string]: keyof PNDFormData } = {
    abbreviation: 'abbreviation',
    gmdn_code: 'gmdn_code',
    development_cost: 'development_cost',
    buyer: 'buyer_id',
    end_user: 'end_user_id',
    competitor_information: 'competitor_information',
    product_features: 'product_features',
    service_requirements: 'service_requirements',
    packaging_requirements: 'packaging_requirements',
    delivery_requirements: 'delivery_requirements',
    environmental_requirements: 'environmental_requirements',
    documentation_requirements: 'documentation_requirements',
    target_selling_price: 'target_selling_price',
    quantity_forecast_3_years: 'quantity_forecast',
    target_timeline_for_product_launch: 'target_product_launch_time_line',
    post_delivery_requirements: 'post_delivery_requirements',
    emdn_code: 'emdn_code',
    product_generic_name: 'product_generic_name',
    intended_use_of_product: 'intended_use_of_product',
    application_of_product: 'application_of_product',
    product_category: 'product_category_id',
  }
  ;(responseData.pndData ?? []).forEach((item: any) => {
    if (!item.item_identifier || !isValidValue(item.value)) return
    const fieldKey = fieldMap[item.item_identifier]
    if (fieldKey) {
      mapFieldValue(formData, fieldKey, item.value)
    }
  })

  return formData
}

export const pndModelModalFieldKeys = {
  modelName: 'modelName',
  modelNumber: 'modelNumber',
  description: 'description',
  baseModel: 'baseModel',
  status: 'status',
}
