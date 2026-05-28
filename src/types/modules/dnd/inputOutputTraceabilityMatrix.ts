export interface TraceabilityMatrix {
    dirId: string
   design_stage: string
    verificationReportFileIds: number[]
}

export interface TraceabilityMatrixForm {
    design_transfer_documents_id: number,
    file_category: string,
    document_needed:string,
    is_checked: number,
}