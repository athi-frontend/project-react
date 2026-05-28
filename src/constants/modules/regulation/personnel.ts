export const INFO_TEXT = {
  KEY_PERSONNEL: `Detailed description of qualification requirements (education and work experience) of the Authorized Person(s) / Qualified Person(s) responsible for all procedures and process carried out at site are clearly established.`,
  HEALTH_REQUIREMENTS: `When a new employee is recruited, conduct medical examination by a registered Medical Practitioner for Physical fitness and for contagious diseases. Medical examination shall be conducted periodically once for every year for all existing employees, as all the employees of Blueneem are living in clean metro city, which is free from contagious diseases, and Blueneem has provided medical insurance to all the employees. If the personnel are suffering any contagious disease or skin disease, he/she shall be relieved from their duties till they are cured. Further, they can be employed only against medical fitness certificate. Medical examination certificate shall be in the following format`,
}

const PERSONNEL_BASE_URL = 'api/v1/regulation/personnel'

export const PERSONNEL_ENDPOINTS = {
  FETCH:(organizationSiteId: number) => `${PERSONNEL_BASE_URL}/${organizationSiteId}`,
  POST: PERSONNEL_BASE_URL,
};

export const PERSONNEL_FORM_LABELS = {
  TITLE: 'Personnel',
  ORGANIZATION_CHART_LABEL: 'Organization chart showing arrangement for Key Personnel',
  ORGANIZATION_CHART_PLACEHOLDER: 'Input Text',
  QUALIFICATION_EXPERIENCE_LABEL: 'Qualification, Experience and Responsibilities of Key Personnel',
  QUALIFICATION_EXPERIENCE_PLACEHOLDER: 'Input Text',
  TRAINING_ARRANGEMENT_LABEL: 'Outline of Arrangement for Basic and Service Training of Personnel',
  TRAINING_ARRANGEMENT_PLACEHOLDER: 'Input Text',
  HEALTH_REQUIREMENTS_LABEL: 'Health Requirements for Personnel Engaged in Production',
  HEALTH_REQUIREMENTS_PLACEHOLDER: 'Input Text',
  HYGIENE_REQUIREMENTS_LABEL: 'Personnel Hygiene Requirements Including Clothing',
  HYGIENE_REQUIREMENTS_PLACEHOLDER: 'Input Text',
  ANNEXURE_LABEL: 'Annexure',
};

export const PERSONNEL_FIELD_KEYS = {
  ORGANIZATION_CHART: 'organization_chart',
  PERSONNEL_PROFILE_SUMMARY: 'personnel_profile_summary',
  TRAINING_ARRANGEMENT_OUTLINE: 'training_arragement_outline',
  HEALTH_REQUIREMENTS: 'health_requirements',
  PERSONNEL_HYGIENE_REQUIREMENT: 'personnel_hygeine_requirement',
};

export const PERSONNEL_ANNEXURE = {
  QUALIFICATION_EXPERIENCE: { label: 'Annexure', fileUrl: '/files/annexure1.pdf' },
  TRAINING_ARRANGEMENT: { label: 'Annexure', fileUrl: '/files/annexure2.pdf' },
  HEALTH_REQUIREMENTS: { label: 'Annexure', fileUrl: '/files/annexure2.pdf' },
  HYGIENE_REQUIREMENTS: { label: 'Annexure', fileUrl: '/files/annexure2.pdf' },
}; 