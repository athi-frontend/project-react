export interface EmployeeFormData {
  name: string;
  employeeNumber: string;
  age: string;
  role: string;
  dateOfJoining: string;
  department: string;
  recruitmentId: string;
  employmentType: string;
  educationalQualification: string;
  experience: string;
  areaOfExpertise: string;
  trainingCertifications: string;
}

export interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface LabelValueProps {
  label: string;
  value: string;
}
