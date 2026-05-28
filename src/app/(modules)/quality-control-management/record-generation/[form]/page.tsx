"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import GoodsInwardTable from '@/components/modules/quality-control-management/record-generation/GoodsInwardTable';
import IncomingInspectionTable from '@/components/modules/quality-control-management/record-generation/IncomingInspectionTable';
import { FORM_TITLES, FORM_IDS } from '@/constants/modules/quality-control-management/recordGeneration';

/**
*Classification : Confidential
**/

const RecordGenerationPage: React.FC = () => {
  const params = useParams();
  const formId = String(params.form);
  const pathName = usePathname();
  
  const pageTitle = FORM_TITLES[formId] ?? formId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Goods Inward
  if (formId === FORM_IDS.GOODS_INWARD) {
    return <GoodsInwardTable pathName={pathName} title={pageTitle} />;
  }

  // Incoming Inspection and Deviation Note - use same component (same API and fields)
  if (formId === FORM_IDS.INCOMING_INSPECTION || formId === FORM_IDS.DEVIATION_NOTE) {
    return <IncomingInspectionTable pathName={pathName} title={pageTitle} />;
  }

  // fallback (should not hit)
  return null;
};

export default RecordGenerationPage;


