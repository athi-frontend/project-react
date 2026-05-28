'use client'
import React from 'react'
import { useParams, usePathname } from 'next/navigation'
import OutSourceVendorAgreementTable from '@/components/modules/purchase/record-generation/OutSourceVendorAgreement'
import VendorAgreementChecklistTable from '@/components/modules/purchase/record-generation/VendorAgreementChecklist'
import PurchaseOrderTable from '@/components/modules/purchase/record-generation/PurchaseOrder'
import { FORM_TITLES } from '@/constants/modules/purchase/recordGeneration'
import PurchaseInformationTable from '@/components/modules/purchase/record-generation/PurchaseInformation'
/**
 *Classification : Confidential
 **/

const PurchaseRecordGenerationPage: React.FC = () => {
  const params = useParams()
  const formId = String(params.form)
  const pathName = usePathname()

  const pageTitle =
    FORM_TITLES[formId] ??
    formId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  // For vendor agreement form
  if (formId === 'outsource-vendor-agreement') {
    return <OutSourceVendorAgreementTable pathName={pathName} title={pageTitle} />
  }

  // For vendor agreement checklist form
  if (formId === 'vendor-agreement-checklist') {
    return <VendorAgreementChecklistTable pathName={pathName} title={pageTitle} />
  }

  // For purchase order form
  if (formId === 'purchase-order') {
    return <PurchaseOrderTable pathName={pathName} title={pageTitle} />
  }
  if (formId === 'purchasing-information') {
    return <PurchaseInformationTable pathName={pathName} title={pageTitle} />
  }


  // fallback (should not hit)
  return null
}

export default PurchaseRecordGenerationPage

