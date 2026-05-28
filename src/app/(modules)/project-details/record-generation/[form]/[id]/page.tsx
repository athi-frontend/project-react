"use client";
import React from "react";
import RecordGeneration from "@/components/modules/dnd/record-generation/RecordGeneration";
import { CONTEXT_TYPE_PROJECT, RECORD_GENERATION_MODULES } from "@/constants/modules/dnd/recordGeneration";
/**
*Classification : Confidential
**/

const RecordGenerationPage: React.FC = () => {
  return <RecordGeneration moduleName={RECORD_GENERATION_MODULES.PROJECT_DETAILS} fixedContextType={CONTEXT_TYPE_PROJECT} />;
};

export default RecordGenerationPage;