/**
*Classification : Confidential
*/
const BASE_BENEFIT_RISK_ANALYSIS_ENDPOINT = `/api/v1/risk/benefit-risk-analysis`

export const RISK_BENEFIT_CONSTANTS = {
    PAGE_TITLE : 'Overall Benefit Risk Analysis',
    ID_FIELD : 'criteria_id',
    PASS_VALUE : 'Pass',
    API_ENDPOINTS : {
        submitBenefitRiskAnalysis : BASE_BENEFIT_RISK_ANALYSIS_ENDPOINT,
        fetchAllRiskBenefit : `${BASE_BENEFIT_RISK_ANALYSIS_ENDPOINT}/all`,
    },
    VERIFICATION_TYPE : {
        APPROVED : 'Approved',
        REJECTED : 'Rejected',
    },
    CONTEXT_TYPE : {
        PROJECT : 'project',
    },
    COLUMNS :{   
        BENEFIT_CRITERIA : {
            FIELD_NAME : 'benefit_criteria',
            HEADER_NAME : 'Benefit Criteria',
        },
        DESC : {
            FIELD_NAME : 'description',
            HEADER_NAME : 'Description',
        },
        MAX_COUNT :{
            FIELD_NAME : 'max_count',
            HEADER_NAME : 'Max Allowed',
        },
        ACTUAL_COUNT : {
            FIELD_NAME : 'actual_count',
            HEADER_NAME : 'Actual Count',
        },
        COMPARISON : {
            FIELD_NAME : 'comparison',
            HEADER_NAME : 'Comparison',         
        },
        RESULT : {
            FIELD_NAME : 'result',
            HEADER_NAME : 'Result',            
        },
        OVERALL_BENEFIT : {
            FIELD_NAME : 'overall_benefit',
            HEADER_NAME : 'Overall Benefit',                
        }
    },
    QUERY_KEYS : {
        RISK_BENEFIT : `risk-benefit-analysis`,
    }
}
