'use client'

import RiskManagementPage from '@/components/modules/risk-management/risk-analysis-control/RiskManagementPage'
import { RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'

/**
 * Classification: Confidential
 */

const HazardIdentificationPage = () => {
  return (
    <RiskManagementPage
      config={{
        mode: 'hazard-identification',
        hazardListPermissions: {
          allowAddHazard: true,
          allowEditHazard: true,
          allowDeleteHazard: true,
          allowAddRisk: false,
          allowEditRisk: false,
          allowDeleteRisk: false,
          allowAddRCM: false,
          allowEditRCM: false,
          allowDeleteRCM: false,
          showRiskSection: false,
        },
        allowRiskModal: false,
        allowRCMModal: false,
        hazardLinkText: RISK_CATEGORY_CONSTANTS.HAZARDS_LINK_TEXT,
        enableAddHazardFromLink: true,
      }}
    />
  )
}

export default HazardIdentificationPage
