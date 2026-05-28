/**
 * Before Mitigation Matrix Page
 * Classification: Confidential
 */
import CommonMitigationMatrix from "@/components/modules/risk-management/report/CommonMitigationMatrix";
import { BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS } from "@/constants/modules/risk-management/mitigationMatrix";

export default function BeforeMitigationMatrixPage() {
  return (
    <CommonMitigationMatrix 
      title={BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS.TITLE} 
      matrixType={BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS.MATRIX_TYPE} 
    />
  );
}