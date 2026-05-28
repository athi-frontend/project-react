"use client";
import React from "react";
import GenericModal from "@/components/modules/hr/add-employee/GenericModal";

interface Option {
  id: string;
  name: string;
}

interface AdministrativeReportsModalProps {
  hasEditPermission?:boolean,
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string | string[]>) => void;
  sites: Option[];
  administrativeReportsTo: Option[];
  initialData?: Record<string, string | string[]>; 
}

const AdministrativeReportsModal: React.FC<AdministrativeReportsModalProps> = ({
  hasEditPermission,
  isOpen,
  onClose,
  onSave,
  sites,
  administrativeReportsTo,
  initialData, 
}) => {
  const fields = [
    {
      label: "Site*",
      placeholder: "Select Site",
      type: "dropdown",
      options: sites,
      keyField: "id",
      valueField: "site",
      fieldKey: "site",
      required: true,
    },
    {
      label: "Administrative Reports to*",
      placeholder: "Select Administrative Reports to",
      type: "dropdown",
      options: administrativeReportsTo,
      keyField: "id",
      valueField: "name",
      fieldKey: "administrativeReportsTo",
      required: true,
    },
  ];

  // Use initialData if provided, otherwise default to empty values
  const initialFormData = initialData ?? {
    site: "",
    administrativeReportsTo: "",
  };

  if (!isOpen) return null;

  return (
    <GenericModal
      hasEditPermission={hasEditPermission}
      onClose={onClose}
      onSave={onSave}
      fields={fields}
      initialFormData={initialFormData}
      showFileUploader={false}
    />
  );
};

export default AdministrativeReportsModal;