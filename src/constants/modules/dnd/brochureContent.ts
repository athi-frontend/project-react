import { generatePath } from "@/lib/utils/stepper"

export const TYPE_MAP = {
  sales: { urlParam: 'sales', displayTitle: 'Sales' },
  'product-manager': {
    urlParam: 'product-manager',
    displayTitle: 'Product Manager',
  },
  regulatory: { urlParam: 'regulatory', displayTitle: 'Regulatory' },
  legal: { urlParam: 'legal', displayTitle: 'Legal' },
  marketing: { urlParam: 'marketing', displayTitle: 'Marketing' },
}

export const MARKETINGSTEPPER = (project_id: number) => ([{
  title: "Marketing",
  items: [
    { label: "Sales", path: generatePath("/dnd/brochure-content/sales/", project_id, '') },
    { label: "Product Manager", path: generatePath("/dnd/brochure-content/product-manager/", project_id, '') },
    { label: "Regulatory", path: generatePath("/dnd/brochure-content/regulatory/", project_id, '') },
    { label: "Legal", path: generatePath("/dnd/brochure-content/legal/", project_id, '') },
    { label: "Marketing", path: generatePath("/dnd/brochure-content/marketing/", project_id, '') }
  ]
}])


export const BROCHURE_CONTAINER_VALUE = {
  Sales: 'MARKETING_BROCHURE_CONTENT_SALES',
  'Product Manager': 'MARKETING_BROCHURE_CONTENT_PRODUCT',
  Regulatory: 'MARKETING_BROCHURE_CONTENT_REGULATORY',
  Legal: 'MARKETING_BROCHURE_CONTENT_LEGAL',
  Marketing: 'MARKETING_BROCHURE_CONTENT_MARKETING',
}

export const BROCHURE_DATA_SOURCE_MAP = {
  Sales: 'eqms_brochure_content_sales_details',
  'Product Manager': 'eqms_brochure_content_product_details',
  Regulatory: 'eqms_brochure_content_regulatory_details',
  Legal: 'eqms_brochure_content_legal_details',
  Marketing: 'eqms_brochure_content_marketing_details',
}

interface FieldEntry {
  label: string
  name: string
  dataFieldName: string
}

type FieldsRecord = Record<string, FieldEntry[]>
export const FIELD_MAP: FieldsRecord = {
  Sales: [
    {
      label: 'Design & Layout',
      name: 'designAndLayout',
      dataFieldName: 'design_layout',
    },
    {
      label: 'Product Image',
      name: 'productImage',
      dataFieldName: 'product_image',
    },
    {
      label: 'Features',
      name: 'productFeature',
      dataFieldName: 'features',
    },
    {
      label: 'Technical Specification',
      name: 'technicalSpecification',
      dataFieldName: 'technical_specifications',
    },
    {
      label: 'Contact Details',
      name: 'contactDetails',
      dataFieldName: 'contact_details',
    },
  ],
  'Product Manager': [
    {
      label: 'Product Image',
      name: 'productImage',
      dataFieldName: 'product_image',
    },
    {
      label: 'Features',
      name: 'productFeature',
      dataFieldName: 'features',
    },
    {
      label: 'Technical Specification',
      name: 'technicalSpecification',
      dataFieldName: 'technical_specifications',
    },
    {
      label: 'Contact Details',
      name: 'contactDetails',
      dataFieldName: 'contact_details',
    },
  ],
  Regulatory: [
    {
      label: 'Regulatory Content',
      name: 'regulatoryContent',
      dataFieldName: 'regulatory_content',
    },
    {
      label: 'QMS & Regulatory Logos',
      name: 'qmsLogos',
      dataFieldName: 'logos',
    },
    {
      label: 'Features',
      name: 'productFeature',
      dataFieldName: 'features',
    },
    {
      label: 'Technical Specification',
      name: 'technicalSpecification',
      dataFieldName: 'technical_specifications',
    },
    {
      label: 'Contact Details',
      name: 'contactDetails',
      dataFieldName: 'contact_details',
    },
    {
      label: 'MKG Material Code/No',
      name: 'mkgMaterial',
      dataFieldName: 'marketing_material_code',
    },
  ],
  Legal: [
    {
      label: 'Disclaimers',
      name: 'disclaimers',
      dataFieldName: 'disclaimers',
    },
    {
      label: 'Legal Content / Claims',
      name: 'legalContent',
      dataFieldName: 'legal_content',
    },
    {
      label: 'Contact Details',
      name: 'contactDetails',
      dataFieldName: 'contact_details',
    },
  ],
  Marketing: [
    {
      label: 'Design & Layout',
      name: 'designAndLayout',
      dataFieldName: 'design_layout',
    },
    {
      label: 'Product Image',
      name: 'productImage',
      dataFieldName: 'product_image',
    },
    {
      label: 'Features',
      name: 'productFeature',
      dataFieldName: 'features',
    },
    {
      label: 'Contact Details',
      name: 'contactDetails',
      dataFieldName: 'contact_details',
    },
    {
      label: 'MKG Material Code/No',
      name: 'mkgMaterial',
      dataFieldName: 'marketing_material_code',
    },
    {
      label: 'Marketing Elements',
      name: 'marketingElements',
      dataFieldName: 'marketing_elements',
    },
  ],
}

