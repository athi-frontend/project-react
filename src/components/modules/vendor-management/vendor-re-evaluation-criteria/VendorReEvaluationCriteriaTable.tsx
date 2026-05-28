"use client";
import React from 'react';
/**
 * Classification: Confidential
 * This file re-exports VendorSelectionCriteriaTable to avoid code duplication.
 * Both Selection and Re-Evaluation criteria use the same table component.
 */

import VendorSelectionCriteriaTableComponent, {
  VendorCriteria,
  VendorSelectionCriteriaTableProps,
} from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable';

// Re-export types with re-evaluation specific names for backward compatibility
export type VendorReEvaluationCriteria = VendorCriteria;
export type VendorReEvaluationCriteriaTableProps = VendorSelectionCriteriaTableProps;

// Re-export the component with re-evaluation default props
const VendorReEvaluationCriteriaTable: React.FC<VendorReEvaluationCriteriaTableProps> = (props) => {
  return (
    <VendorSelectionCriteriaTableComponent
      {...props}
      title={props.title ?? "Vendor Re-Evaluation Criteria"}
    />
  );
};

export default VendorReEvaluationCriteriaTable;
