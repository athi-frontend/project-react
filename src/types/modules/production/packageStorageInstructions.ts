import { FileData, FileDocument } from "@/types/components/ui/fileUploadV3"

/**
 * Classification: Confidential
 * Package Storage Instruction
 */

export interface PackageStorageInstructionFormData {
    model_id: string | number | null
    storage_type_id: string | number | null
    is_dismantle_during_packing: string | null
    is_assemble_complete_unit: string | null
    specific_instruction: string
    remarks: string
    packaging_materials_required: Array<{
        part_number: string
        part_name: string
    }>
    packaging_instruction_supporting_file_documents: (FileDocument | FileData)[]
    storage_instruction_supporting_file_documents: (FileDocument | FileData)[]
}
