/**
 * Classification: Confidential
 */

/**
 * Get workflow action API endpoints for a specific module
 * @param module - Module name (e.g., 'sales', 'risk', 'hr')
 * @returns Object with POST and PUT endpoints
 */
export const getWorkflowActionEndpoints = (module: string) => {
  const BASE_WORKFLOW_API_PATH = `api/v1/${module}/workflow-action`;
  return {
    POST: `/${BASE_WORKFLOW_API_PATH}`,
    PUT: `/${BASE_WORKFLOW_API_PATH}`,
  };
};

 
