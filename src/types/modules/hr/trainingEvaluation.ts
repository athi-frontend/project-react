export interface TrainingEvaluation {
  id: number
  hr_attendee_id: number,
  attendees: Attendees[]
  skills: Skill[]
}

export interface Skill {
  hr_training_evaluation_skill_attendee_id: number
  status: string
  skill_id: number
  skill_name: string
  acquired_skill_level_id: number | null
  required_skill_level_id: number | null
  method_of_evaluation: string
  remarks: string
  supporting_files: any[]
}

export interface Attendees {
  hr_attendee_id : number
  attendee_id: number
  first_name: string
  last_name: string
  department_id: number
  department_name: string
  role_id: number
  role_name: string
  status?: number
}

export type SkillEvaluation = {
  hr_attendee_id: number;
  required_skill_level_id: number | null;
  acquired_skill_level_id: number | null;
  method_of_evaluation: string;
  remarks: string;
  supporting_files: any[];
};

export type SkillWithEvaluation = Skill & {
  evaluations: SkillEvaluation[];
};

export type TrainingEvaluationWithEvaluatedSkills = {
  id: number;
  attendees: Attendees[];
  skills: SkillWithEvaluation[];
};

export type FlattenedRow = {
      id: string;
      parentId: string | number;
      attendee: Attendees[];
      skills: Skill[];
    }

export interface TrainingEvaluationFormErrors {
  titleOfTraining?: string; 
  evaluationDate?: string; 
  uploadedFile?: string
}


