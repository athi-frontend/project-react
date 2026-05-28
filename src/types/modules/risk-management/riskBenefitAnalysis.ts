/**
*Classification : Confidential
*/
export interface RiskMatrixRow {
    id: number;
    benefit_criteria: string;
    description: string;
    actual_count: number;
    max_count: number;
    comparison: string;
    result: string;
    overall_benefit: number;
    criteria_id: number;
}

