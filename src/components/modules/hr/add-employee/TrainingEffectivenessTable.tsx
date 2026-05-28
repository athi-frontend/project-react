"use client";
import React from "react";
import GenericTable from "./GenericTable";
import { EMPLOYEE_UI_CONSTANTS } from "@/constants/modules/hr/employeeList";
import { NUMBERMAP } from "@/constants/common";

// Use the new TrainingEvaluation interface
interface TrainingEvaluation {
  id: number | string;
  skill_name: string | null;
  required_skill_level: number | null;
  acquired_skill_level: number | null;
  method_of_evaluation: string | null;
  remarks: string | null;
}

interface TrainingEffectivenessTableProps {
  data: TrainingEvaluation[];
}

const TrainingEffectivenessTable: React.FC<TrainingEffectivenessTableProps> = ({ data }) => {
  // No edit or delete handlers needed

  const columns = [
    {
      field: "id",
      headerName: EMPLOYEE_UI_CONSTANTS.SNO_HEADER,
      flex:NUMBERMAP.HALF,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE,
    },
    {
      field: "skill_name",
      headerName: EMPLOYEE_UI_CONSTANTS.SKILLS_IMPARTED_HEADER,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.skill_name ?? "",
    },
    {
      field: "required_skill_level",
      headerName: EMPLOYEE_UI_CONSTANTS.LEVEL_REQUIRED_HEADER,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.required_skill_level ?? "",
    },
    {
      field: "acquired_skill_level",
      headerName: EMPLOYEE_UI_CONSTANTS.LEVEL_ACQUIRED_HEADER,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.acquired_skill_level ?? "",
    },
    {
      field: "method_of_evaluation",
      headerName: EMPLOYEE_UI_CONSTANTS.METHOD_OF_EVALUATION_HEADER,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.method_of_evaluation ?? "",
    },
    {
      field: "remarks",
      headerName: EMPLOYEE_UI_CONSTANTS.EVALUATION_REMARKS_HEADER,
      flex:NUMBERMAP.ONE,
      renderCell: (params: any) => params.row.remarks ?? "",
    },
  ];

  // Use the data as-is, no mapping needed
  return (
    <GenericTable
      columns={columns}
      rows={data}
      idField="id"
      showActions={false}
    />
  );
};

export default TrainingEffectivenessTable;
