'use client'

import RiskManagementPage from '@/components/modules/risk-management/risk-analysis-control/RiskManagementPage'
import { RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'

/**
 * Classification: Confidential
 */

const RiskControlMeasurePage = () => {
  return (
    <RiskManagementPage
      config={{
        mode: 'risk-control-measure',
        formReadOnly: true,
        showFormActions: false,
        allowHazardModal: false,
        allowRiskModal: false,
        allowRCMModal: true,
        hazardLinkText: RISK_CATEGORY_CONSTANTS.VIEW_RCM_LINK_TEXT,
        enableAddHazardFromLink: false,
        hazardListPermissions: {
          allowAddHazard: false,
          allowEditHazard: false,
          allowDeleteHazard: false,
          allowAddRisk: false,
          allowEditRisk: false,
          allowDeleteRisk: false,
          allowAddRCM: true,
          allowEditRCM: true,
          allowDeleteRCM: true,
          showRiskSection: true,
        },
        showApplicabilityCheckbox: false,
      }}
    />
  )
}

export default RiskControlMeasurePage
