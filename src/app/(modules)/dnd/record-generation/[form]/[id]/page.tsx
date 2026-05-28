"use client";
import React from "react";
import RecordGeneration from "@/components/modules/dnd/record-generation/RecordGeneration";
import { CONTEXT_TYPE_PROJECT, RECORD_GENERATION_MODULES } from "@/constants/modules/dnd/recordGeneration";

/**
*Classification : Confidential
**/

const DndRecordGenerationPage: React.FC = () => {
  return <RecordGeneration moduleName={RECORD_GENERATION_MODULES.DND } fixedContextType={CONTEXT_TYPE_PROJECT}/>;
};

export default DndRecordGenerationPage;