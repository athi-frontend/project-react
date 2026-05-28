/**
 * After Mitigation Matrix Page
 * Classification: Confidential
 */
import CommonMitigationMatrix from '@/components/modules/risk-management/report/CommonMitigationMatrix'
import { AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS } from '@/constants/modules/risk-management/mitigationMatrix'

export default function AfterMitigationMatrixPage() {
  return (
    <CommonMitigationMatrix
      title={AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS.TITLE}
      matrixType={AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE}
    />
  )
}
