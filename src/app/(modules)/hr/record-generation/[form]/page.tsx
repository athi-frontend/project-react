"use client";
import React from "react";
import { useParams, usePathname } from "next/navigation";
import EmployeeTable from '@/components/modules/hr/record-generation/EmployeeTable';
import ResourceRequisitionTable from '@/components/modules/hr/record-generation/ResourceRequisitionTable';
import CandidateEvaluationTable from '@/components/modules/hr/record-generation/CandidateEvaluationTable';
import JobDescriptionTable from '@/components/modules/hr/record-generation/JobDescriptionTable';
import TrainingEvaluationTable from '@/components/modules/hr/record-generation/TrainingEvaluationTable';

/**
*Classification : Confidential
**/

const RecordGenerationPage: React.FC = () => {
  const params = useParams();
  const formId = String(params.form);
  const pathName = usePathname();
  // Title mapping for each form
  const formTitles: Record<string, string> = {
    "employee-checklist": "Employee Checklist",
    "training-effectiveness-evaluation": "Training Effectiveness Evaluation",
    "induction": "Induction",
    "organization-chart": "Organization Chart",
    "candidate-evaluation": "Candidate Evaluation",
    "resource-requisition": "Resource Requisition",
    "training-need": "Training Need",
    "individual-competency": "Individual Competency",
    "job-description": "Job Description",
  };
  const pageTitle = formTitles[formId] || formId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // 1. Employee Checklist and default
  if (!["resource-requisition", "candidate-evaluation" ,"job-description", "training-effectiveness-evaluation"].includes(formId)
  ) {
    return <EmployeeTable pathName={pathName} title={pageTitle} />;
  }

  // Resource Requisition
  if (formId === "resource-requisition") {
    return <ResourceRequisitionTable pathName={pathName}  title={pageTitle} />;
  }

  // Candidate Evaluation
  if (formId === "candidate-evaluation") {
    return <CandidateEvaluationTable pathName={pathName}  title={pageTitle} />;
  }

  // Training Evaluation
  if (formId === "training-effectiveness-evaluation") {
    return <TrainingEvaluationTable pathName={pathName}  title={pageTitle} />;
  }

  if (formId === "job-description") {
    return <JobDescriptionTable pathName={pathName}  title={pageTitle} />;
  }

  // fallback (should not hit)
  return null;
};

export default RecordGenerationPage;