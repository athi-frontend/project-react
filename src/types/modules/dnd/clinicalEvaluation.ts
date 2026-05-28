import { FileDocument } from "@/types/components/ui/fileUploadV3"

export interface InputFormData {
    planDocuments: File[] | FileDocument[]
    reportDocuments: File[] | FileDocument[]
}