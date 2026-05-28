'use client'

import RiskManagementPage from '@/components/modules/risk-management/risk-analysis-control/RiskManagementPage'
import { RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'

/**
 * Classification: Confidential
 */

const RiskAssessmentPreRCMPage = () => {
  return (
    <RiskManagementPage
      config={{
        mode: 'risk-assessment',
        formReadOnly: true,
        showFormActions: false,
        allowHazardModal: false,
        allowRiskModal: true,
        allowRCMModal: false,
        hazardLinkText: RISK_CATEGORY_CONSTANTS.VIEW_RISK_LINK_TEXT,
        enableAddHazardFromLink: false,
        hazardListPermissions: {
          allowAddHazard: false,
          allowEditHazard: false,
          allowDeleteHazard: false,
          allowAddRisk: true,
          allowEditRisk: true,
          allowDeleteRisk: true,
          allowAddRCM: false,
          allowEditRCM: false,
          allowDeleteRCM: false,
          showRiskSection: true,
        },
        showApplicabilityCheckbox: false,
      }}
    />
  )
}

export default RiskAssessmentPreRCMPage
