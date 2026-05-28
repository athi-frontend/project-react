"use client";
import React from "react";
import { RECORD_GENERATION_MODULES } from "@/constants/modules/infrastructure-management/recordGeneration";
import RecordGeneration from "@/components/modules/dnd/record-generation/RecordGeneration";

/**
*Classification : Confidential
**/

const RecordGenerationPage: React.FC = () => {
  return <RecordGeneration moduleName={RECORD_GENERATION_MODULES.INFRASTRUCTURE} />; 
};

export default RecordGenerationPage;
