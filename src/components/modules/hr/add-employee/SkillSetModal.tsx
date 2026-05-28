"use client";
import React, { useState, useEffect } from "react";
import { Grid2 } from "@mui/material";
import { ButtonGroup, InputField } from "@/components/ui";
import { InfoLabel, InfoValue, ContentWrapper } from "@/styles/modules/hr/addEmployee";
import { useSkillLevels } from "@/hooks/modules/hr/useEmployeeList";
interface SkillSet {
  id?: number
  skillRequired: string
  levelRequired: string
  levelPossess: string | number
  levelPossessId?: number
}

interface SkillSetPopupFormProps {
  onClose?: () => void;
  onSave?: (skillLevel: number) => void;
  initialData?: SkillSet | null;
}

const SkillSetPopupForm: React.FC<SkillSetPopupFormProps> = ({
  onClose,
  onSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState<SkillSet>({
    skillRequired: initialData?.skill_name ?? "Skill Required as per JD",
    levelRequired: initialData?.skill_level ?? "Level of Skill Required as per JD",
    levelPossess: initialData?.level_possess ?? "",
    levelPossessId: initialData?.level_possess_id ?? undefined,
  })
  useEffect(() => {
    if (initialData) {
      setFormData({
        skillRequired: initialData.skill_name,
        levelRequired: initialData.skill_level,
        levelPossess: initialData.level_possess,
        levelPossessId: initialData.level_possess_id,
      });
    }
  }, [initialData]);


  const handleSave = () => {
    if (!formData) {
      return;
    }

    if (onSave) {
      onSave(formData);
    }
  };

  const handleLevelPossessChange = (selectedValue: string | number) => {
    // Find the selected option in skillLevelsData
    const selectedOption = skillLevelsData?.find(
      (option: any) => String(option.skill_level) === String(selectedValue)
    );
    setFormData((prevData) => ({
      ...prevData,
      levelPossess: selectedValue,
      levelPossessId: selectedOption ? selectedOption.skill_level_id : undefined,
    }));
  };

  const { data: skillLevelsData } = useSkillLevels();

  const buttons = [
    { label: "Cancel", onClick: onClose },
    { label: "Save", onClick: handleSave },
  ];
  return (
    <ContentWrapper >
      <Grid2 container direction="column" spacing={2}>
        <Grid2>
          <InfoLabel>Skill Required as per JD</InfoLabel>
          <InfoValue>{formData.skillRequired}</InfoValue>
        </Grid2>

        <Grid2>
          <InfoLabel>Level of Skill Required as per JD</InfoLabel>
          <InfoValue>{formData.levelRequired}</InfoValue>
        </Grid2>
        <Grid2>
          <InputField
            label="Level of Skill Possess*"
            placeholder="Select Level of Skill Possess"
            isDropdown={true}
            value={formData.levelPossess}
            onChange={handleLevelPossessChange}
            options={skillLevelsData}
            keyField="skill_level"
            valueField="skill_level"
          />
        </Grid2>
      </Grid2>

      <ButtonGroup buttons={buttons} />
    </ContentWrapper>
  )
};

export default SkillSetPopupForm;