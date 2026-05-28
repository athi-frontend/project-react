'use client'
import React from 'react'
import { useParams, usePathname } from 'next/navigation'
import InfrastructureRequestFormTable from '@/components/modules/infrastructure-management/record-generation/InfrastructureRequestFormTable'
import InstallationReportTable from '@/components/modules/infrastructure-management/record-generation/InstallationReportTable'
import MaintenanceReportTable from '@/components/modules/infrastructure-management/record-generation/MaintenanceReportTable'
import { formIds, formTitles } from '@/constants/modules/infrastructure-management/recordGeneration'

/**
 *Classification : Confidential
 **/

const RecordGenerationPage: React.FC = () => {
  const params = useParams()
  const formId = String(params.form)
  const pathName = usePathname()

  const pageTitle = formTitles[formId]

  // Infrastructure Request Form
  if (formId === formIds.INFRASTRUCTURE_REQUEST_FORM) {
    return <InfrastructureRequestFormTable pathName={pathName} title={pageTitle} />
  }

  // Installation Report
  if (formId === formIds.INSTALLATION_REPORT) {
    return <InstallationReportTable pathName={pathName} title={pageTitle} />
  }

  // Maintenance Report
  if (formId === formIds.MAINTENANCE_REPORT) {
    return <MaintenanceReportTable pathName={pathName} title={pageTitle} />
  }

  // Maintenance Plan
  if (formId === formIds.MAINTENANCE_PLAN) {
    return <InstallationReportTable pathName={pathName} title={pageTitle} />
  }

  // Infrastructure Qualification
  if (formId === formIds.INFRASTRUCTURE_QUALIFICATION) {
    return <InstallationReportTable pathName={pathName} title={pageTitle} />
  }

  // fallback (should not hit)
  return null
}

export default RecordGenerationPage

