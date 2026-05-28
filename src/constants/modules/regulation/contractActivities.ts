export const CONTRACT_ACTIVITIES_LABEL = {
  TITLE: "Contract Activities",
  DESCRIPTION_LABEL: "Description of the Way in Which the Compliance of the Contract Acceptor is Assessed"
};

export const CONTRACT_ACTIVITIES_API_BASE = '/api/v1/regulation/contract-activity';

export const CONTRACT_ACTIVITIES_API = {
  FETCH: (id: number) => `${CONTRACT_ACTIVITIES_API_BASE}/${id}`,
  SAVE: CONTRACT_ACTIVITIES_API_BASE,
};

export const CONTRACT_ACTIVITIES_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  CONTRACT_ACTIVITIES: 'contract_activities',
};

export const CONTRACT_ACTIVITIES_QUERY_KEY = 'contract_activities';

export const CONTRACT_ACTIVITIES_LABELS = {
  FORM_TITLE: 'Contract Activities',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const CONTRACT_ACTIVITIES_PLACEHOLDER = 'Enter contract activities...';