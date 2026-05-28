'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    Grid2,
    Box,
} from '@mui/material'
import { ButtonGroup, Label, InputField, Description, RadioButtonGroup, DataGridTable, showActionAlert, ActionButton } from '@/components/ui'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { PageContainer, P20P40 } from '@/styles/common'
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common'
import {
    PART_DETAILS_LABELS,
    PART_DETAILS_PLACEHOLDERS,
    BUTTON_LABELS,
    BOM_CONSTANTS,
    PART_DETAILS_ERROR_MESSAGES,
    QUANTITY_TYPE_OPTIONS,
    QUANTITY_TYPE_VALUES,
    BOM_TYPE_OPTIONS,
    DROPDOWN_FIELDS,
    FIELD_NAMES,
    supplierDetailsColumns,
} from '@/constants/modules/production/billOfMaterial'
import {
    PartDetailsFormData,
    DEFAULT_PART_DETAILS_FORM_DATA,
    SupplierDetail,
    PartSupplierDetail,
    PartDetailsFormErrors,
} from '@/types/modules/production/billOfMaterial'
import { useUpsertPartDetails, usePartDetailsById } from '@/hooks/modules/production/useBillOfMaterial'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { FileData } from '@/types/components/ui/fileUploadV3'
import SupplierDetails from '@/components/modules/production/bill-of-material/SupplierDetails'
import { GridColDef } from '@mui/x-data-grid'
import UploadedFilesList from '@/components/ui/file-upload-section/UploadedFilesList'
import { mergeFinalFileData, FinalFileData, stripHtml, mapFileResponse, mapDocumentsByCategory } from '@/lib/utils/common'
import { FAILED_ALERT } from '@/constants/modules/dnd/formTeam'


/**
 * Classification: Confidential
 * Part Details Page
 */

const PartDetailsPage: React.FC = () => {
    const router = useRouter()
    const params = useParams()

    // Get part_item_detail_id from route params
    const partItemDetailId = params?.part_id ? Number(params.part_id) : undefined
    const projectId = params?.id ? Number(params.id) : undefined

    // Fetch part details data
    const {
        data: partDetailsResponse
    } = usePartDetailsById(partItemDetailId)

    // Extract IDs from fetched data - handle both array [{}] and object {} formats
    const assemblyPartItemId = useMemo(() => {
        if (!partDetailsResponse?.data) {
            return NUMBERMAP.ZERO;
        }
        const rawData = Array.isArray(partDetailsResponse.data) && partDetailsResponse.data.length > NUMBERMAP.ZERO
            ? partDetailsResponse.data[NUMBERMAP.ZERO]
            : partDetailsResponse.data;
        // Type assertion: at this point, rawData is a single object
        const data = rawData as any;
        return data?.assembly_part_item_id ?? NUMBERMAP.ZERO;
    }, [partDetailsResponse]);

    // Mutation hook for upsert
    const upsertMutation = useUpsertPartDetails()

    const [formData, setFormData] = useState<PartDetailsFormData>(
        DEFAULT_PART_DETAILS_FORM_DATA
    )

    const [errors, setErrors] = useState<PartDetailsFormErrors>({})
    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail | null>(null)

    // Initial files from API response for FileUploadManager
    const [initialFiles, setInitialFiles] = useState<any[]>([])

    // Drawing numbers from API response
    const [drawingNumbers, setDrawingNumbers] = useState<any[]>([])

    // File upload manager data (finalFileData)
    const [billOfMaterialFinalFileData, setBillOfMaterialFinalFileData] = useState<FinalFileData>({
        documents_to_create: [],
        create_meta_data: {},
        update_meta_data: {},
        documents_to_delete: [],
        local_files_to_delete: [],
    })

    // Draft save hook
    const partItemDetailIdForDraft = partItemDetailId
    const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
    const [draftDelete, setDraftDelete] = useState<string[]>([])
    
    const { 
        draftSave, 
        clearDraftSave, 
        isDraftSaving, 
        checkUnsavedDraftBeforeLeave 
    } = useDraftSave({
        context_type: "part_item",
        context_instance_id: partItemDetailIdForDraft,
        enableFetch: false
    })


    // Helper function to get file ID from document
    const getFileId = useCallback((doc: any): string | number | undefined => {
        return doc?.file_id ?? doc?.id ?? doc?.document_id ?? doc?.fk_eqms_file_id;
    }, []);

    // Helper function to merge and deduplicate documents
    const processDocuments = useCallback((data: any) => {
        const mergedDocuments = [
            ...(Array.isArray(data.documents) ? data.documents : []),
            ...(Array.isArray(data.document) ? data.document : []),
            ...(data?.draftDocuments?.documents ?? []),
        ];

        const uniqueDocuments = mergedDocuments.reduce((acc: any[], doc: any) => {
            const fileId = getFileId(doc);
            if (fileId === undefined || fileId === null) {
                return acc;
            }
            const exists = acc.some((item) => {
                const existingId = getFileId(item);
                return String(existingId) === String(fileId);
            });
            if (!exists) acc.push(doc);
            return acc;
        }, []);

        return mapFileResponse(uniqueDocuments);
    }, [getFileId]);

    // Helper function to process draft delete array
    const processDraftDelete = useCallback((draftDelete: any): string[] => {
        if (Array.isArray(draftDelete)) {
            return draftDelete;
        }
        if (draftDelete && typeof draftDelete === 'object') {
            return Object.values(draftDelete).flat().filter((item): item is string => typeof item === 'string');
        }
        return [];
    }, []);

    // Helper function to map inspection procedure
    const mapInspectionProcedure = useCallback((inspectionProcedure: any, mappedDocuments: any[]) => {
        if (!inspectionProcedure || mappedDocuments.length === NUMBERMAP.ZERO) {
            return inspectionProcedure;
        }

        const inspectionProcedureStr = String(inspectionProcedure);
        let matchingFile = mappedDocuments.find((file: any) => {
            const fileName = file.file_name ?? file.name ?? '';
            return fileName === inspectionProcedureStr;
        });

        if (!matchingFile && mappedDocuments.length === NUMBERMAP.ONE) {
            matchingFile = mappedDocuments[NUMBERMAP.ZERO];
        }

        return matchingFile?.file_id ?? inspectionProcedure;
    }, []);

    // Populate form data when API response is loaded
    useEffect(() => {
        if (!partDetailsResponse?.data) {
            return;
        }

        // Handle both array [{}] and object {} formats
        const data = Array.isArray(partDetailsResponse.data) && partDetailsResponse.data.length > NUMBERMAP.ZERO
            ? partDetailsResponse.data[NUMBERMAP.ZERO]
            : partDetailsResponse.data;

        // Process and set documents
        const mappedDocuments = processDocuments(data);
        setInitialFiles(mappedDocuments);

        // Handle drawing files
        const drawingFiles = data.drawing_files ?? data.drawing_number ?? [];
        if (Array.isArray(drawingFiles)) {
            setDrawingNumbers(mapFileResponse(drawingFiles));
        }

        // Load draftDocuments and draftDelete
        const mappedDraftDocuments = mapDocumentsByCategory(data?.draftDocuments);
        setDraftDocuments(mappedDraftDocuments);
        setDraftDelete(processDraftDelete(data?.draftDelete));

        // Map inspection procedure
        const inspectionProcedureValue = mapInspectionProcedure(data.inspection_procedure, mappedDocuments);

        // Set form data with normalized inspection_procedure
        setFormData(prev => ({
            ...prev,
            ...data,
            inspection_procedure: inspectionProcedureValue,
        }));
    }, [partDetailsResponse, partItemDetailId, processDocuments, processDraftDelete, mapInspectionProcedure]);

    // Combine inspection procedure files from API and create_meta_data for dropdown
    const inspectionProcedureOptions = useMemo(() => {
        const billOfMaterialInspectionProcedureOptions: Array<{ inspection_procedure_id: string; file_name: string }> = [];

        // documents_to_delete contains file_ids of saved files that are deleted
        const deletedFileIds = billOfMaterialFinalFileData.documents_to_delete?.map((id) => String(id)) ?? [];
        // local_files_to_delete contains cryptoIds of newly uploaded files that are deleted locally
        const billOfMaterialDeletedLocalFileIds = billOfMaterialFinalFileData.local_files_to_delete ?? [];

        // Track file IDs to avoid duplicates (by ID, not just name)
        const existingFileIds = new Set<string>();
        const existingBillOfMaterialCryptoIds = new Set<string>();

        // Add files from API response (initialFiles - saved files), excluding deleted ones
        initialFiles.forEach((file) => {
            const fileId = file.file_id ? String(file.file_id) : null;

            // Skip if this saved file's ID is in the deleted files list
            if (fileId !== null && deletedFileIds.includes(fileId)) {
                return;
            }

            // Use file_id as the procedure ID (this is the UUID that should match in payload)
            const procedureId = file.file_id?.toString() ?? '';
            const fileName = file.file_name ?? file.name;

            if (procedureId && !existingFileIds.has(procedureId)) {
                billOfMaterialInspectionProcedureOptions.push({
                    inspection_procedure_id: procedureId,
                    file_name: fileName,
                });
                existingFileIds.add(procedureId);
            }
        });

        // Add files from create_meta_data (newly uploaded files), excluding deleted ones and duplicates
        if (billOfMaterialFinalFileData.create_meta_data) {
            Object.entries(billOfMaterialFinalFileData.create_meta_data).forEach(([billOfMaterialCryptoId, billOfMaterialMetadata]: [string, any]) => {
                // Skip if this newly uploaded file's cryptoId is in the deleted local files list
                if (billOfMaterialDeletedLocalFileIds.includes(billOfMaterialCryptoId)) {
                    return;
                }

                // Skip if already added (avoid duplicates)
                if (existingBillOfMaterialCryptoIds.has(billOfMaterialCryptoId)) {
                    return;
                }

                const billOfMaterialFileName = billOfMaterialMetadata?.fileName ?? billOfMaterialCryptoId;

                // Check if a file with the same name already exists in initialFiles (not deleted)
                // This prevents duplicates after save when the file appears in both places
                const billOfMaterialFileExistsInInitial = initialFiles.some((file) => {
                    const billOfMaterialfileId = file.file_id ? String(file.file_id) : null;
                    const billOfMaterialfileFileName = file.file_name ?? file.name ?? '';
                    // Only consider it a duplicate if the file exists and is NOT deleted
                    return billOfMaterialfileFileName === billOfMaterialFileName && billOfMaterialfileId && !deletedFileIds.includes(billOfMaterialfileId);
                });

                if (!billOfMaterialFileExistsInInitial) {
                    billOfMaterialInspectionProcedureOptions.push({
                        inspection_procedure_id: billOfMaterialCryptoId, // Pass the crypto ID to API
                        file_name: billOfMaterialFileName, // Show the fileName in dropdown
                    });
                    existingBillOfMaterialCryptoIds.add(billOfMaterialCryptoId);
                }
            });
        }

        return billOfMaterialInspectionProcedureOptions;
    }, [initialFiles, billOfMaterialFinalFileData.create_meta_data, billOfMaterialFinalFileData.documents_to_delete, billOfMaterialFinalFileData.local_files_to_delete]);

    // Draft save handler
    const handleDraftSave = useCallback((formDataToSave?: PartDetailsFormData, fileData?: FinalFileData) => {
        const finalFormData = formDataToSave ?? formData
        const finalFileData = fileData ?? billOfMaterialFinalFileData
        
        let draftDatas = partDetailsResponse
        
        const draftConfig = {
            fileFieldToSectionMap: { 'document': 'documents' },
            sectionTypeToNameMap: { 'document': 'documents' },
            responseDataKeyMap: { 'document': 'documents' },
        }

        const draftPreparation = prepareDraftDocumentsGeneric(
            draftDocuments,
            draftDelete,
            { ...finalFormData, documents: initialFiles },
            { document: finalFileData ?? FINALFILEINITIALDATA },
            draftDatas,
            draftConfig
        )

        if (draftPreparation.draftDocuments) {
            setDraftDocuments(draftPreparation.draftDocuments)
        }
        
        if (draftPreparation.draftDelete) {
            const deleteArray = processDraftDelete(draftPreparation.draftDelete)
            setDraftDelete(deleteArray)
        }

        const fieldsToRemove = ['document', 'documents', 'drawing_number']
        const cleaned = Object.fromEntries(
            Object.entries(finalFormData).filter(([key]) => !fieldsToRemove.includes(key))
        )

        const payload = {
            id: partItemDetailIdForDraft ?? new Date().getTime(),
            ...cleaned,
            supplier_details: finalFormData.supplier_details ?? [],
            draftDocuments: draftPreparation.draftDocuments,
            draftDelete: draftPreparation.draftDelete,
            type: 'draft',
        }

        draftSave({
            form_data: payload,
            upload_documents: {
                documents_to_create: finalFileData?.documents_to_create ?? [],
                create_meta_data: draftPreparation.createMetaData,
                update_meta_data: draftPreparation.updateMetaData,
                documents_to_delete: [],
                documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
            },
        })
    }, [draftSave, partItemDetailIdForDraft, formData, billOfMaterialFinalFileData, initialFiles, draftDocuments, draftDelete, partDetailsResponse, processDraftDelete])

    const handleFieldChange = (field: keyof PartDetailsFormData, value: any) => {
        setFormData((prev) => {
            const updated = { ...prev, [field]: value }
            handleDraftSave(updated)
            return updated
        })
        // Clear error when field is changed (same pattern as sample-inspection)
        if (value && (typeof value === 'string' ? value.trim() !== '' : true)) {
            setErrors((prev) => ({
                ...prev,
                [field]: undefined,
            }))
        }
    }

    const handleFileUpload = (newFile: File | FileData) => {
        // Update initialFiles with the new file
        setInitialFiles((prev) => [...prev, newFile] as any[])
        // Clear files_upload error when file is uploaded (same pattern as sample-inspection)
        setErrors((prev) => ({
            ...prev,
            files_upload: undefined,
        }))
    }

    const handleAddSupplier = () => {
        setSelectedSupplier(null)
        setIsSupplierModalOpen(true)
    }

    const handleEditSupplier = (supplier: any) => {
        // Convert PartSupplierDetail to SupplierDetail format for the modal
        const supplierDetail: SupplierDetail = {
            vendor_id: supplier.vendor_id,
            vendor_name: supplier.vendor_name,
            supplier_part_no: supplier.part_number ?? '',
            moq: supplier.moq ?? '',
            lead_time: supplier.lead_time ?? '',
            status: supplier.status ?? NUMBERMAP.ONE,
        };
        // Preserve supplier_detail_id for edit functionality
        if (supplier.supplier_detail_id) {
            supplierDetail.supplier_detail_id = supplier.supplier_detail_id;
        }
        setSelectedSupplier(supplierDetail)
        setIsSupplierModalOpen(true)
    }

    const handleSaveSupplier = (supplierData: SupplierDetail) => {
        // Convert SupplierDetail to PartSupplierDetail format
        const existingSupplierDetailId = supplierData.supplier_detail_id
        const partSupplierData: PartSupplierDetail = {
            supplier_detail_id: existingSupplierDetailId ?? NUMBERMAP.ZERO,
            vendor_id: typeof supplierData.vendor_id === 'number'
                ? supplierData.vendor_id : NUMBERMAP.ZERO,
            vendor_name: supplierData.vendor_name,
            part_number: supplierData.supplier_part_no ?? null,
            moq: supplierData.moq ?? null,
            lead_time: supplierData.lead_time ?? null,
            status: supplierData.status ?? NUMBERMAP.ONE,
        };

        // Check if this is an edit (supplier_detail_id exists and is not 0)
        if (existingSupplierDetailId && existingSupplierDetailId !== NUMBERMAP.ZERO) {
            // Update existing supplier - find by supplier_detail_id
            setFormData((prev) => ({
                ...prev,
                supplier_details: prev.supplier_details.map((supplier) => {
                    return supplier.supplier_detail_id === existingSupplierDetailId
                        ? partSupplierData
                        : supplier;
                }),
            }));
        } else {
            // Add new supplier (supplier_detail_id will be 0 for new entries)
            setFormData((prev) => ({
                ...prev,
                supplier_details: [
                    ...prev.supplier_details,
                    partSupplierData
                ]
            }));
        }
    };

    const handleCloseSupplierModal = () => {
        setIsSupplierModalOpen(false)
        setSelectedSupplier(null)
    }


    // Clear inspectionProcedure if it matches a deleted file or is not in available options (same as sample-inspection)
    useEffect(() => {
        if (!formData.inspection_procedure) {
            return;
        }

        // Don't clear if options are not ready yet (initialFiles might not be loaded)
        if (inspectionProcedureOptions.length === NUMBERMAP.ZERO && initialFiles.length > NUMBERMAP.ZERO) {
            return;
        }

        const deletedFileIds = billOfMaterialFinalFileData.documents_to_delete?.map((id) => String(id)) ?? [];
        const deletedLocalFileIds = billOfMaterialFinalFileData.local_files_to_delete ?? [];
        const currentProcedureId = String(formData.inspection_procedure);

        // Clear if current inspection procedure matches any deleted file ID
        if (deletedFileIds.includes(currentProcedureId) || deletedLocalFileIds.includes(currentProcedureId)) {
            setFormData((prev) => ({
                ...prev,
                inspection_procedure: NUMBERMAP.ZERO,
            }));
            return;
        }

        // Also clear if the selected procedure ID is not in the available options
        const availableProcedureIds = inspectionProcedureOptions.map(opt => opt.inspection_procedure_id);
        if (!availableProcedureIds.includes(currentProcedureId)) {
            setFormData((prev) => ({
                ...prev,
                inspection_procedure: NUMBERMAP.ZERO,
            }));
        }
    }, [billOfMaterialFinalFileData.documents_to_delete, billOfMaterialFinalFileData.local_files_to_delete, inspectionProcedureOptions, formData.inspection_procedure, initialFiles.length]);

    const validateForm = (): boolean => {
        const newErrors: PartDetailsFormErrors = {}
        let isValid = true

        // Validate unit_batch (required)
        if (!formData.quantity_type_slug || formData.quantity_type_slug.trim() === '') {
            newErrors.quantity_type_slug = PART_DETAILS_ERROR_MESSAGES.UNIT_BATCH_REQUIRED
            isValid = false
        }

        // Validate aql (required)
        if (!formData.aql?.trim()) {
            newErrors.aql = PART_DETAILS_ERROR_MESSAGES.AQL_REQUIRED
            isValid = false
        }

        // Validate part_type (required)
        if (!formData.bom_type_slug || formData.bom_type_slug.trim() === '') {
            newErrors.bom_type_slug = PART_DETAILS_ERROR_MESSAGES.PART_TYPE_REQUIRED
            isValid = false
        }

        // Validate files_upload (required) - check both initialFiles and finalFileData
        const deletedFileIds = billOfMaterialFinalFileData.documents_to_delete ?? []

        // Check if there are any valid initial files (not deleted)
        const validInitialFiles = initialFiles && initialFiles.length > NUMBERMAP.ZERO
            ? initialFiles.filter(file => !deletedFileIds.includes(file.file_id))
            : []

        // Check if there are new files being uploaded
        const hasNewFiles = billOfMaterialFinalFileData.documents_to_create && billOfMaterialFinalFileData.documents_to_create.length > NUMBERMAP.ZERO
        const hasCreateMetaData = billOfMaterialFinalFileData.create_meta_data && Object.keys(billOfMaterialFinalFileData.create_meta_data).length > NUMBERMAP.ZERO

        // Files are valid if there are valid initial files OR new files with metadata
        const hasValidFiles = validInitialFiles.length > NUMBERMAP.ZERO || (hasNewFiles && hasCreateMetaData)

        // Only show error if there are 0 files total
        if (!hasValidFiles) {
            newErrors.files_upload = PART_DETAILS_ERROR_MESSAGES.FILES_UPLOAD_REQUIRED
            isValid = false
        }

        // Validate inspection_procedure (required)
        if (!formData.inspection_procedure || formData.inspection_procedure === NUMBERMAP.ZERO) {
            newErrors.inspection_procedure = PART_DETAILS_ERROR_MESSAGES.INSPECTION_PROCEDURE_REQUIRED
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    // Handle file upload manager submit
    const handleFileUploadSubmit = (data: any) => {
        setBillOfMaterialFinalFileData((prev) => {
            const merged = mergeFinalFileData(prev, data);
            handleDraftSave(undefined, merged)

            // Clear files_upload error when files are present
            const deletedFileIds = merged.documents_to_delete ?? []
            const validInitialFiles = initialFiles.filter(file => !deletedFileIds.includes(file.file_id))
            const hasNewFiles = merged.documents_to_create?.length > NUMBERMAP.ZERO
            const hasCreateMetaData = merged.create_meta_data && Object.keys(merged.create_meta_data).length > NUMBERMAP.ZERO
            // Files are valid if there are valid initial files OR new files with metadata
            const hasValidFiles = validInitialFiles.length > NUMBERMAP.ZERO || (hasNewFiles && hasCreateMetaData)

            if (hasValidFiles && errors.files_upload) {
                setErrors((prev) => ({
                    ...prev,
                    files_upload: undefined,
                }))
            }

            return merged;
        });
    }

    // Helper function to validate and append inspection procedure
    const appendInspectionProcedureIfValid = (formDataToSend: FormData) => {
        const deletedFileIds = billOfMaterialFinalFileData.documents_to_delete?.map((id) => String(id)) ?? [];
        const deletedLocalFileIds = billOfMaterialFinalFileData.local_files_to_delete ?? [];
        const inspectionProcedureStr = formData.inspection_procedure ? String(formData.inspection_procedure) : '';

        const isDeletedFile =
            (inspectionProcedureStr && deletedFileIds.includes(inspectionProcedureStr)) ??
            (inspectionProcedureStr && deletedLocalFileIds.includes(inspectionProcedureStr));

        const availableProcedureIds = inspectionProcedureOptions.map(opt => String(opt.inspection_procedure_id));
        const isValidProcedure = inspectionProcedureStr &&
            availableProcedureIds.includes(inspectionProcedureStr) &&
            !isDeletedFile;

        if (isValidProcedure) {
            formDataToSend.append("inspection_procedure", inspectionProcedureStr);
        }
    };

    const handleSave = () => {
        if (!validateForm()) {
            return
        }

        clearDraftSave()

        const supplierDetailsPayload = formData.supplier_details.map((supplier) => {
            // For new suppliers, supplier_detail_id should be empty string
            // For existing suppliers, use the supplier_detail_id
            const supplierDetailId = supplier.supplier_detail_id && supplier.supplier_detail_id !== NUMBERMAP.ZERO
                ? String(supplier.supplier_detail_id)
                : '';

            // vendor_id is a number type
            const vendorId = typeof supplier.vendor_id === 'number'
                ? supplier.vendor_id
                : NUMBERMAP.ZERO;

            // Use nullish coalescing for status
            const supplierStatus = supplier.status ?? NUMBERMAP.ONE;

            return {
                supplier_detail_id: supplierDetailId,
                vendor_id: vendorId,
                status: supplierStatus,
            };
        })

        const partTypeValue = formData.bom_type_slug === 'manufacture' ? NUMBERMAP.ONE : NUMBERMAP.TWO

        // Create FormData for multipart/form-data request
        const formDataPayload = new FormData()

        // Add basic fields
        formDataPayload.append('project_id', String(projectId ?? NUMBERMAP.ZERO))
        formDataPayload.append('assembly_part_item_id', String(assemblyPartItemId ?? NUMBERMAP.ZERO))
        formDataPayload.append('aql', formData.aql ?? '')
        formDataPayload.append('visual', formData.visual ?? '')
        formDataPayload.append('part_quantity_type', String(formData.quantity_type_id ?? NUMBERMAP.ONE))
        formDataPayload.append('part_type', String(partTypeValue))
        formDataPayload.append('supplier_details', JSON.stringify(supplierDetailsPayload))
        formDataPayload.append('equipment_type_id', String(formData.equipment_type_id ?? NUMBERMAP.ZERO))

        // Validate and append inspection procedure
        appendInspectionProcedureIfValid(formDataPayload)

        // Add documents_to_create (files)
        if (billOfMaterialFinalFileData.documents_to_create && billOfMaterialFinalFileData.documents_to_create.length > NUMBERMAP.ZERO) {
            billOfMaterialFinalFileData.documents_to_create.forEach((file: File) => {
                if (file instanceof File) {
                    formDataPayload.append('documents_to_create', file, file.name)
                }
            })
        }

        // Add create_meta_data as JSON string
        if (billOfMaterialFinalFileData.create_meta_data && Object.keys(billOfMaterialFinalFileData.create_meta_data).length > NUMBERMAP.ZERO) {
            formDataPayload.append('create_meta_data', JSON.stringify(billOfMaterialFinalFileData.create_meta_data))
        }

        // Add documents_to_delete as JSON string
        if (billOfMaterialFinalFileData.documents_to_delete && billOfMaterialFinalFileData.documents_to_delete.length > NUMBERMAP.ZERO) {
            formDataPayload.append('documents_to_delete', JSON.stringify(billOfMaterialFinalFileData.documents_to_delete))
        }

        // Add update_meta_data as JSON string
        if (billOfMaterialFinalFileData.update_meta_data && Object.keys(billOfMaterialFinalFileData.update_meta_data).length > NUMBERMAP.ZERO) {
            formDataPayload.append('update_meta_data', JSON.stringify(billOfMaterialFinalFileData.update_meta_data))
        }

        upsertMutation.mutate(formDataPayload as any, {
            onSuccess: () => {
                if (projectId) {
                    router.push(`${BOM_CONSTANTS.PATH}/${projectId}`)
                }
                showActionAlert(STATUS.SUCCESS);
            },
            onError: () => {
                showActionAlert(FAILED_ALERT);
            },
        })
    }

    const handleCancel = async () => {
        await checkUnsavedDraftBeforeLeave()
        if (projectId) {
            router.push(`${BOM_CONSTANTS.PATH}/${projectId}`)
        }
    }

    const handleDeleteSupplier = async (supplier: any) => {

        // Show delete confirmation dialog
        const result = await showActionAlert(STATUS.DELETE)
        if (result.isConfirmed) {
            // Set status to 2 for this supplier in formData
            // The actual payload will be created in handleSave from formData.supplier_details
            setFormData((prev) => {
                const updatedSupplierDetails = prev.supplier_details.map((row) =>
                    row.supplier_detail_id === supplier.supplier_detail_id
                        ? { ...row, status: NUMBERMAP.TWO }
                        : row
                );

                const updated = {
                    ...prev,
                    supplier_details: updatedSupplierDetails,
                }
                handleDraftSave(updated)
                return updated
            });
        }
    }

    // Generate columns with actions
    const supplierColumnsWithActions = useMemo<GridColDef[]>(() => {
        return [
            ...supplierDetailsColumns,
            {
                field: "actions",
                headerName: "Actions",
                flex: NUMBERMAP.ONE,
                sortable: false,
                renderCell: (params: any) => {
                    // Disable edit and delete when status is 2 (deleted)
                    // Enable when status is 1 (active)
                    const isDisabled = params.row.status === NUMBERMAP.TWO
                    return (
                        <ActionButton
                            onEdit={() => handleEditSupplier(params.row)}
                            onDelete={() => handleDeleteSupplier(params.row)}
                            deleteDisabled={isDisabled}
                            editDisabled={isDisabled}
                        />
                    );
                },
            },
        ]
    }, [formData.supplier_details])


    return (
        <PageContainer>
            {isDraftSaving && <DraftLoading />}
            <Label title={PART_DETAILS_LABELS.TITLE} />

            <Grid2 container spacing={NUMBERMAP.TWO} sx={{ padding: P20P40 }}>
                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.ASSEMBLY_PART_NAME}
                        value={formData.part_name ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.PART_CODE}
                        value={formData.part_number ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <Description
                        placeholder={PART_DETAILS_PLACEHOLDERS.ASSEMBLY_PART_NAME}
                        label={PART_DETAILS_LABELS.DESCRIPTION}
                        value={stripHtml(formData?.part_description) ?? '-'}
                        onChange={(value) => handleFieldChange('part_description', value)}
                        error={errors.description}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.PRODUCT_NAME}
                        value={formData.product_name ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.SAFETY_CRITICAL}
                        value={formData.part_type ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <RadioButtonGroup
                        name={PART_DETAILS_LABELS.UNIT_BATCH}
                        label={PART_DETAILS_LABELS.UNIT_BATCH}
                        options={QUANTITY_TYPE_OPTIONS}
                        value={formData.quantity_type_slug ?? ''}
                        onChange={(value) => {
                            handleFieldChange(FIELD_NAMES.QUANTITY_TYPE_SLUG, value)
                            // Update quantity_type_id based on slug
                            const quantityTypeId = value === QUANTITY_TYPE_VALUES.UNIT ? NUMBERMAP.TWO : NUMBERMAP.ONE
                            handleFieldChange(FIELD_NAMES.QUANTITY_TYPE_ID, quantityTypeId)
                            // Clear error when value is selected
                            if (value) {
                                setErrors((prev) => ({
                                    ...prev,
                                    quantity_type_slug: undefined,
                                }))
                            }
                        }}
                        error={errors.quantity_type_slug}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InputField
                        label={PART_DETAILS_LABELS.VISUAL}
                        placeholder={PART_DETAILS_PLACEHOLDERS.VISUAL}
                        value={formData.visual}
                        onChange={(value: string) => handleFieldChange('visual', value)}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InputField
                        label={PART_DETAILS_LABELS.AQL}
                        placeholder={PART_DETAILS_PLACEHOLDERS.AQL}
                        value={formData.aql}
                        onChange={(value: string) => handleFieldChange('aql', value)}
                        error={errors.aql}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <RadioButtonGroup
                        name={PART_DETAILS_LABELS.PART_TYPE}
                        label={PART_DETAILS_LABELS.PART_TYPE}
                        options={BOM_TYPE_OPTIONS}
                        value={formData.bom_type_slug ?? ''}
                        onChange={(value) => {
                            handleFieldChange('bom_type_slug', value)
                            // Clear error when value is selected
                            if (value) {
                                setErrors((prev) => ({
                                    ...prev,
                                    bom_type_slug: undefined,
                                }))
                            }
                        }}
                        error={errors.bom_type_slug}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.MANUFACTURER}
                        value={formData.bom_type_slug ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.HARDWARE_SOFTWARE}
                        value={formData.component_type_lk ?? '-'}

                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.CLASSIFICATION}
                        value={formData.classification ?? '-'}
                    />
                </Grid2>

                <Grid2 size={NUMBERMAP.SIX}>
                    <InfoField
                        label={PART_DETAILS_LABELS.EQUIPMENT_TYPE}
                        value={formData.equipment_name ?? '-'}
                    />
                </Grid2>
                <Grid2 size={NUMBERMAP.SIX}>
                    <UploadedFilesList
                        label={PART_DETAILS_LABELS.DRAWING_NUMBER}
                        files={drawingNumbers}
                        onDelete={() => { }}
                    />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                    <DataGridTable
                        title={PART_DETAILS_LABELS.SUPPLIER_DETAILS}
                        rows={formData.supplier_details ?? []}
                        onAddRow={handleAddSupplier}
                        onEditRow={handleEditSupplier}
                        showAddButton={true}
                        hideFooter={true}
                        columns={supplierColumnsWithActions}
                        idField={DROPDOWN_FIELDS.SUPPLIER_DETAIL.ID_FIELD}
                    />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                    <FileUploadManager
                        initialFiles={initialFiles}
                        onFileUpload={handleFileUpload}
                        onSubmit={handleFileUploadSubmit}
                        hasEditable={false}
                        uploadMandError={errors.files_upload}
                        subHeader={PART_DETAILS_LABELS.FILES_UPLOAD}
                    />
                </Grid2>
                <Grid2 size={{ xs: NUMBERMAP.SIX }}>
                    <InputField
                        isDropdown={true}
                        options={inspectionProcedureOptions}
                        label={PART_DETAILS_LABELS.INSPECTION_PROCEDURE}
                        placeholder={PART_DETAILS_PLACEHOLDERS.INSPECTION_PROCEDURE}
                        value={formData.inspection_procedure ? String(formData.inspection_procedure) : ''}
                        keyField={DROPDOWN_FIELDS.INSPECTION_PROCEDURE.KEY_FIELD}
                        valueField={DROPDOWN_FIELDS.INSPECTION_PROCEDURE.VALUE_FIELD}
                        onChange={(value: string) => handleFieldChange('inspection_procedure', value)}
                        error={errors.inspection_procedure}
                    />
                </Grid2>
            </Grid2>


            <Box sx={{ padding: P20P40 }}>
                <ButtonGroup
                    buttons={[
                        {
                            label: BUTTON_LABELS.CANCEL,
                            onClick: handleCancel,
                        },
                        {
                            label: BUTTON_LABELS.SAVE,
                            onClick: handleSave,
                        },
                    ]}
                />
            </Box>

            <SupplierDetails
                open={isSupplierModalOpen}
                onClose={handleCloseSupplierModal}
                onSave={handleSaveSupplier}
                initialData={selectedSupplier}
                projectId={projectId}
            />
        </PageContainer>
    )
}

export default PartDetailsPage