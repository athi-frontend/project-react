"use client";
import React from "react";
import GenericModal from "./GenericModal";
import { InfoLabel, InfoValue } from "@/styles/modules/hr/addEmployee";
import { Grid2 } from "@mui/material";
import { useSkills, useSkillLevels} from "@/hooks/modules/hr/useEmployeeList";
import { FileData } from "@/types/components/ui/fileUploadV3";
interface TrainingEvaluation {
  id?: number;
  skill?: string;
  level?: string;
  methodEvaluation?: string;
  evaluationRemarks?: string;
  skillsImparted?: string;
  levelAcquired?: string;
  methodOfEvaluation?: string;
}


interface AdditionalSkillsProps {
  onClose: () => void;
  onSave?: (formData: Record<string, string | string[]>) => void; 
   initialData?: TrainingEvaluation | null;
    documents?: [];
       handleFileUpload?: (file: FileData) => void;
       handleFileEdit?: (file: FileData) => void;
       handleFileSubmit?: (data:any) => void;
}

const AdditionalSkills: React.FC<AdditionalSkillsProps> = ({ onClose, onSave, initialData=null ,documents,handleFileEdit,handleFileUpload,handleFileSubmit}) => {
  const { data: skillOptions } = useSkills();
  const {data: levelOptions} = useSkillLevels();
 const getInitialFormData = () => {
    if (initialData) {
      return {
        skill: initialData.skill ?? initialData.skillsImparted ?? "",
        level: initialData.level ?? initialData.levelAcquired ?? "",
        methodEvaluation: initialData.methodEvaluation ?? initialData.methodOfEvaluation ?? "",
        evaluationRemarks: initialData.evaluationRemarks ?? "",
      };
    }
    return {
      skill: "",
      level: "",
      methodEvaluation: "",
      evaluationRemarks: "",
    };
  };

  
  const fields = [
    {
      label: "Skills Imparted*",
      placeholder: "Select skills Imparted",
      type: "dropdown",
      options: skillOptions,
      keyField: "skill_id",
      valueField: "skill_name",
      fieldKey: "skill",
      required: true, 
    },
    {
      label: "Level Acquired",
      placeholder: "Select Level Acquired",
      type: "dropdown",
      options: levelOptions,
      keyField: "skill_level_id",
      valueField: "skill_level",
      fieldKey: "level",
      required: true, 
    },
    {
      label: "Method of Evaluation*",
      placeholder: "Enter Method of Evaluation",
      type: "description",
      fieldKey: "methodEvaluation",
    },
    {
      label: "Evaluation / Remarks*",
      placeholder: "Evaluation / Remarks",
      type: "description",
      fieldKey: "evaluationRemarks",
    },
  ];

  const extraContent = (
    <Grid2 size={{ md: 12 }}>
      <InfoLabel>Level Required</InfoLabel>
      <InfoValue>Level Required</InfoValue>
    </Grid2>
  );

  return (
    <GenericModal
    documents={documents}
    handleFileUpload={handleFileUpload}
    handleFileEdit={handleFileEdit}
    handleFileSubmit={handleFileSubmit}
      onClose={onClose}
      onSave={onSave} 
      fields={fields}
      initialFormData={getInitialFormData()}
      extraContent={extraContent}
      title=""
    />
  );
};

export default AdditionalSkills;