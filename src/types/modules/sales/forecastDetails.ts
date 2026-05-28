/**
*Classification : Confidential
**/
export interface DateParamsType  {
    start_date : string 
    end_date : string
}

export interface ModelsList {
    sno : number,
    model: string,
    model_name: string
}

export interface ForcastDetails {
    sno : number,
    month: string,
    projected: number,
    sold_project_met: number
}