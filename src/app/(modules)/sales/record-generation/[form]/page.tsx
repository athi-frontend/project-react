'use client'
import React from 'react'
import { useParams, usePathname } from 'next/navigation'
import SalesQuotationTable from '@/components/modules/sales/record-generation/SalesQuotationTable'
import OrderAcknowledgementTable from '@/components/modules/sales/record-generation/OrderAcknowledgementTable'
import DeliveryInstructionsTable from '@/components/modules/sales/record-generation/DeliveryInstructionsTable'
import CustomerFeedbackFormTable from '@/components/modules/sales/record-generation/CustomerFeedbackFormTable'
import { formIds, formTitles } from '@/constants/modules/sales/recordGeneration'

/**
 *Classification : Confidential
 **/

const RecordGenerationPage: React.FC = () => {
  const params = useParams()
  const formId = String(params.form)
  const pathName = usePathname()

  const pageTitle = formTitles[formId]

  // Sales Quotation
  if (formId === formIds.SALES_QUOTATION) {
    return <SalesQuotationTable pathName={pathName} title={pageTitle} />
  }

  // Order Acknowledgement
  if (formId === formIds.ORDER_ACKNOWLEDGEMENT) {
    return <OrderAcknowledgementTable pathName={pathName} title={pageTitle} />
  }

  // Delivery Instructions
  if (formId === formIds.DELIVERY_INSTRUCTIONS) {
    return <DeliveryInstructionsTable pathName={pathName} title={pageTitle} />
  }

  // Customer Feedback Form
  if (formId === formIds.CUSTOMER_FEEDBACK_FORM) {
    return <CustomerFeedbackFormTable pathName={pathName} title={pageTitle} />
  }

  // fallback (should not hit)
  return null
}

export default RecordGenerationPage
