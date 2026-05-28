import { FieldEntry } from '@/types/modules/dnd/websiteContent'
export const TYPE_MAP = {
  'sales': { urlParam: 'sales', displayTitle: 'Sales' },
  'product-manager': { urlParam: 'product-manager', displayTitle: 'Product Manager' },
  'regulatory': { urlParam: 'regulatory', displayTitle: 'Regulatory' },
  'legal': { urlParam: 'legal', displayTitle: 'Legal' },
  'marketing': { urlParam: 'marketing', displayTitle: 'Marketing' }
}

export const CONTAINER_VALUE = {
  Sales: 'MARKETING_WEBSITE_CONTENT_SALES',
  'Product Manager': 'MARKETING_WEBSITE_CONTENT_PRODUCT',
  Regulatory: 'MARKETING_WEBSITE_CONTENT_REGULATORY',
  Legal: 'MARKETING_WEBSITE_CONTENT_LEGAL',
  Marketing: 'MARKETING_WEBSITE_CONTENT_MARKETING'
}

export const DATA_SOURCE_MAP = {
  Sales: 'eqms_website_content_sales_details',
  'Product Manager': 'eqms_website_content_product_details',
  Regulatory: 'eqms_website_content_regulatory_details',
  Legal: 'eqms_website_content_legal_details',
  Marketing: 'eqms_website_content_marketing_details'
}

export const FIELD_MAP: Record<string, FieldEntry[]> = {
  Sales: [
    { label: "Company Profile", name: "companyProfile", dataFieldName: "company_profile" },
    { label: "Product Image", name: "productImage", dataFieldName: "product_image" },
    { label: "Product Features", name: "productFeature", dataFieldName: "product_features" },
    { label: "Product Specification", name: "productSpecification", dataFieldName: "product_specifications" },
    { label: "Contact Details", name: "contactDetails", dataFieldName: "contact_details" },
  ],
  "Product Manager": [
    { label: "Product Image", name: "productImage", dataFieldName: "product_image" },
    { label: "Product Features", name: "productFeature", dataFieldName: "product_features" },
    { label: "Product Specification", name: "productSpecification", dataFieldName: "product_specifications" },
    { label: "Contact Details", name: "contactDetails", dataFieldName: "contact_details" },
  ],
  Regulatory: [
    { label: "Regulatory Content", name: "regulatoryContent", dataFieldName: "regulatory_content" },
    { label: "QMS & Regulatory Logos", name: "qmsLogos", dataFieldName: "logos" },
    { label: "Product Features", name: "productFeature", dataFieldName: "product_features" },
    { label: "Product Specification", name: "productSpecification", dataFieldName: "product_specifications" },
    { label: "Contact Details", name: "contactDetails", dataFieldName: "contact_details" },
  ],
  Legal: [
    { label: "Disclaimers", name: "disclaimers", dataFieldName: "disclaimers" },
    { label: "Legal content/Claims", name: "legalContent", dataFieldName: "legal_content" },
    { label: "Contact Details", name: "contactDetails", dataFieldName: "contact_details" },
  ],
  Marketing: [
    { label: "Design & Layout", name: "designLayout", dataFieldName: "design_layout" },
    { label: "Navigation & Functionality", name: "navigationFunctionality", dataFieldName: "navigation_functionality" },
    { label: "Product Images", name: "productImages", dataFieldName: "product_images" },
    { label: "Products Features", name: "productFeature", dataFieldName: "product_features" },
    { label: "Contact Details", name: "contactDetails", dataFieldName: "contact_details" },
    { label: "Company Profile", name: "companyProfile", dataFieldName: "company_profile" },
    { label: "Marketing Elements", name: "marketingElements", dataFieldName: "marketing_elements" },
  ],
}

export const WEBSITE_FIELD = {
  COMPANY_PROFILE: 'companyProfile',
  PRODUCT_IMAGE: 'productImage',
  PRODUCT_FEATURE: 'productFeature',
  PRODUCT_SPECIFICATION: 'productSpecification',
  CONTACT_DETAILS: 'contactDetails',
  REGULATORY_CONTENT: 'regulatoryContent',
  QMS_LOGOS: 'qmsLogos',
  DISCLAIMERS: 'disclaimers',
  LEGAL_CONTENT: 'legalContent',
  MARKETING_ELEMENTS: 'marketingElements',
  DESIGN_AND_LAYOUT: 'designLayout',
  NAVIGATION_FUNCTIONALITY: "navigationFunctionality",
   PRODUCT_IMAGES: 'productImages',
}
