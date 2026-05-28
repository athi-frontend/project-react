'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
    InputField,
    Label,
    ButtonGroup,
    showActionAlert,
    DataGridTable,
    ActionButton,
    Description,
} from '@/components/ui'
import { Grid2 } from '@mui/material'
import {
    FormContainer,
    FormWrapper,
    FormContent,
} from '@/styles/modules/user/userOnboard'
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import {
    DATE,
    ERRORS,
    FILE_SECTION_TABLES,
    LABEL,
    MODE_OF_TRAINING,
    TITLE,
    EDIT_SKILL,
    ADD_SKILL,
    DATE_CHANGE,
    CREATE,
    TEXT,
    DATA_SOURCE_NAME,
    TRUE,
    DATA_FIELD_NAMES,
    DEPARTMENT_LABEL,
    FIELDS,
    HEADER_NAME,
    ATTENDEE_FIELD,
    ATTENDEE_HEADERS,
    CONTAINER_ID,
    ID_FIELD,
    ATTENDEES,
    SKILL,
    PLACE_HOLDERS,
    LABELS,
    VALUE_FIELDS,
    CERTIFICATE_DOCUMENTS,
    TRAINING_DOCUMENTS,
    BUTTON_LABELS,
    DEFAULT_FORM,
    EDIT_ATTENDEE,
    CONTAINED,
    ADD_ATTENDEE,
    NAME_CONSTANT,
    DEFAULT_ATTENDEE,
    KEY_FIELDS,
    DELETE,
    TRAINER,
    MODE,
    COMPETENCY_NAME,
    TRAIN_NAME,
    LOCATION_NAME,
    ROUTER_PATH,
    TRAINING_SCHEDULE_FILE_HEADERS,
    TRAINING_EVALUATED_SCHEDULE
} from '@/constants/modules/hr/trainingSchedule'
import { useListWorkflowEmployes } from '@/hooks/modules/hr/useEmployeeList'
import { useSkills } from '@/hooks/modules/hr/useRoleDefinition'
import { useParams, useRouter } from 'next/navigation'
import { KeysInterface, magicFormSave } from '@/lib/utils/magicSave'
import { COMMON_CONSTANTS, mergeFinalFileData, formatDateForAPI, FinalFileData } from '@/lib/utils/common'
import magicSaveConstants from '@/constants/magicSave'
import { CommonInlineStyles, ErrorText } from '@/styles/common'
import {
    UploadedFileData,
    DocumentStructure,
} from '@/types/modules/hr/employeeList'
import { useTrainingNeedById } from '@/hooks/modules/hr/useTrainingSchedule'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import {
    extractPreservedDocumentIds,
    filterDocumentsToDelete,
    filterNestedUpdateMetaData
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'
import { isAnyLoading } from '@/lib/modules/hr/candidateEvaluation'

/**
*Classification : Confidential
**/

type FileSection = keyof typeof FILE_SECTION_TABLES

const TrainingScheduleForm: React.FC = () => {
    const formRef = useRef(null)
    const [form, setForm] = useState(DEFAULT_FORM)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [attendees, setAttendees] = useState<any[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [attendeeForm, setAttendeeForm] = useState(DEFAULT_ATTENDEE)
    const [editAttendeeId, setEditAttendeeId] = useState<number | null>(null)
    const [skills, setSkills] = useState<any[]>([])
    const [skillModalOpen, setSkillModalOpen] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState<string>('')
    const [selectedSkillId, setSelectedSkillId] = useState<string>('')
    const [initialSupportingFiles, setInitialSupportingFiles] = useState<DocumentStructure[]>([])
    const [initialCertificateFiles, setInitialCertificateFiles] = useState<DocumentStructure[]>([])
    const [editSkillId, setEditSkillId] = useState<number | null>(null)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
    const router = useRouter()
    const [supportingFiles, setSupportingFiles] = useState<DocumentStructure>(FINALFILEINITIALDATA)
    const [certificateFiles, setCertificateFiles] = useState<DocumentStructure>(FINALFILEINITIALDATA)
    const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
    const [draftDelete, setDraftDelete] = useState<string[]>([])

    // Training schedule draft configuration for two file sections
    const TRAINING_SCHEDULE_DRAFT_CONFIG: DraftDocumentsConfig = {
        fileFieldToSectionMap: {
            'training_documents': 'training_documents',
            'certificate_documents': 'certificate_documents',
        },
        sectionTypeToNameMap: {
            'training_documents': 'training_documents',
            'certificate_documents': 'certificate_documents',
        },
        responseDataKeyMap: {
            'training_documents': 'eqms_hr_training_materials_supporting_file',
            'certificate_documents': 'eqms_hr_training_certificate_supporting_file',
        },
    }

    const { data: employeeResponse, isLoading: employeesLoading, refetch: fetchemployeelist } = useListWorkflowEmployes(NUMBERMAP.ONE, "Approved")
    const { data: skillResponse } = useSkills()
    const params = useParams()
    const scheduleId = params.id
    const { data: scheduleResponse, refetch: trainingById, invalidateQuery,isFetching:trainingScheduleLoading} = useTrainingNeedById(Number(scheduleId))
    const isAddMode = scheduleId === CREATE
    const trainingScheduleId = isAddMode ? null : Number(scheduleId)

    const { draftSave, clearDraftSave, isDraftSaving,isFetchingDraft, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
        context_type: 'training_schedule',
        context_instance_id: trainingScheduleId,
        enableFetch: false,
    })

    useEffect(() => {
        if (scheduleResponse?.data && scheduleResponse.data.length > NUMBERMAP.ZERO && !draftData?.data) {
            const trainingData = scheduleResponse.data[NUMBERMAP.ZERO]

            setForm({
                title: trainingData.title ?? '',
                date_of_training: trainingData.date_of_training ?? null,
                mode: trainingData.mode_of_training ?? '',
                trainer: trainingData.trainer ?? '',
                competency: trainingData.trainer_competency ?? '',
                training: trainingData.training_materials ?? '',
                Location: trainingData.location ?? '',
                isEvaluated: trainingData.is_training_schedule_evaluated
            })

            setSelectedEmployeeId(trainingData.trainer?.toString() ?? '')

            setInitialSupportingFiles(trainingData.training_documents ?? [])
            setInitialCertificateFiles(trainingData.certificate_documents ?? [])

            const newAttendees = trainingData.attendees.map(
                (attendee: any, index: number) => ({
                    id: index + NUMBERMAP.ONE,
                    name: `${attendee.first_name} ${attendee.last_name}`,
                    Department: attendee.department_name ?? '',
                    employeeId: attendee.attendee_id?.toString() ?? '',
                })
            )
            setAttendees(newAttendees)

            const newSkills = trainingData.skills.map((skill: any, index: number) => ({
                id: index + NUMBERMAP.ONE,
                skill_name: skill.skill_name ?? '',
                fk_eqms_hr_skill_master_id: skill.skill_id?.toString() ?? '',
            })) ?? []
            setSkills(newSkills)
        }
    }, [scheduleResponse])
    const resetForm = () =>{
        setForm(DEFAULT_FORM)
        setCertificateFiles(FINALFILEINITIALDATA)
        setInitialCertificateFiles([])
        setInitialSupportingFiles([])
        setSupportingFiles(FINALFILEINITIALDATA)
    }
    useEffect(() => {
        resetForm()
        fetchemployeelist()
        fetchDraft()
        if (scheduleId !== CREATE) {
            trainingById()
        }
    }, [scheduleId])


    useEffect(() => {
        if (draftData?.data) {
            setForm(draftData.data)
            if (draftData.data?.attendees) {
                setAttendees(draftData.data.attendees)
            }
            if (draftData.data?.skills) {
                setSkills(draftData.data.skills)
            }

            // Get documents from draftDocuments if available, otherwise use documents
            const draftTrainingDocs = draftData?.data?.draftDocuments?.['training_documents'] ?? []
            const draftCertificateDocs = draftData?.data?.draftDocuments?.['certificate_documents'] ?? []
            const serverDocs = draftData.data?.documents ?? []

            // Filter server documents by type
            const serverCertificateDocs = serverDocs.filter((document: any) =>
                document.document_type === 'eqms_hr_training_certificate_supporting_file'
            )
            const serverTrainingDocs = serverDocs.filter((document: any) =>
                document.document_type === 'eqms_hr_training_materials_supporting_file'
            )

            // Combine server and draft documents, filtering to only include documents with file_id
            const allCertificateDocs = [...serverCertificateDocs, ...draftCertificateDocs].filter((doc: any) => {
                return doc.file_id !== undefined && doc.file_id !== null
            })
            const allTrainingDocs = [...serverTrainingDocs, ...draftTrainingDocs].filter((doc: any) => {
                return doc.file_id !== undefined && doc.file_id !== null
            })

            setInitialCertificateFiles(allCertificateDocs)
            setInitialSupportingFiles(allTrainingDocs)

            setSelectedEmployeeId(draftData?.data?.trainer)

            // Initialize draftDocuments from draftData
            if (draftData?.data?.draftDocuments && typeof draftData?.data?.draftDocuments === 'object') {
                setDraftDocuments(draftData?.data?.draftDocuments)
            }

            // Initialize draftDelete from draftData
            if (draftData?.data?.draftDelete && Array.isArray(draftData?.data?.draftDelete)) {
                setDraftDelete(draftData?.data?.draftDelete)
            }
        }
    }, [draftData])

    const handleDraftSave = (formData: any, attendeesData: any[], skillsData: any[], fileData?: { certificate?: DocumentStructure, training?: DocumentStructure }) => {
        const certificateFileData = (fileData?.certificate ?? certificateFiles) as unknown as FinalFileData
        const trainingFileData = (fileData?.training ?? supportingFiles) as unknown as FinalFileData

        // Prepare final documents object with both sections
        const finalDocuments = {
            certificate_documents: certificateFileData ?? FINALFILEINITIALDATA,
            training_documents: trainingFileData ?? FINALFILEINITIALDATA,
        }
        // Use the generic utility function for multiple file sections
        const draftPreparation = prepareDraftDocumentsGeneric(
            draftDocuments,
            draftDelete,
            { ...formData, trainer: selectedEmployeeId ?? formData.trainer, certificate_documents: initialCertificateFiles, training_documents: initialSupportingFiles },
            finalDocuments,
            draftData,
            TRAINING_SCHEDULE_DRAFT_CONFIG
        )

        if (draftPreparation.draftDocuments) {
            setDraftDocuments(draftPreparation.draftDocuments)
        }
        if (draftPreparation.draftDelete) {
            setDraftDelete(draftPreparation.draftDelete)
        }

        // Extract drafted documents from draftDocuments
        const extractedCertificateDocs = draftPreparation.draftDocuments['certificate_documents'] ?? []
        const extractedTrainingDocs = draftPreparation.draftDocuments['training_documents'] ?? []
        const payload = {
            id: trainingScheduleId ?? new Date().getTime(),
            ...formData,
            employeeId: selectedEmployeeId ?? '',
            attendees: attendeesData,
            skills: skillsData,
            type: 'draft',
            documents: draftData?.data?.documents ?? [],
            draftDelete: draftPreparation.draftDelete,
            draftDocuments: {
                certificate_documents: extractedCertificateDocs,
                training_documents: extractedTrainingDocs,
            },
        }

        // Collect all documents_to_create from both sections
        const allDocumentsToCreate = [
            ...(certificateFileData?.documents_to_create ?? []),
            ...(trainingFileData?.documents_to_create ?? []),
        ]

        draftSave({
            form_type: 'training_schedule',
            form_data: payload,
            upload_documents: {
                documents_to_create: allDocumentsToCreate,
                create_meta_data: draftPreparation.createMetaData,
                update_meta_data: draftPreparation.updateMetaData,
                deleteDraftDocuments: draftPreparation?.documentsToDelete,
                documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
            },
            timestamp: new Date().toISOString(),
        })
    }

    const handleChange = (field: string, value: any) => {
        setForm((prev) => {
            const updated = { ...prev, [field]: value ?? '' }
            handleDraftSave(updated, attendees, skills)
            return updated
        })
        setErrors((prev) => ({ ...prev, [field]: '' }))
    }

    const handleEmployeeChange = (employeeId: string) => {
        setSelectedEmployeeId(employeeId)
        handleChange(
            TRAINER,
            employeeId
        )
    }

    const handleAttendeeChange = (employeeId: string) => {
        const selectedEmployee = employeeResponse?.data?.find(
            (emp: any) => emp.id === parseInt(employeeId)
        )
        setAttendeeForm((prev) => ({
            ...prev,
            employeeId: employeeId ?? '',
            name: selectedEmployee ? selectedEmployee.employee_name : '',
            Department: selectedEmployee ? selectedEmployee.department_name : '',
        }))

        // Clear error if attendee is selected
        if (employeeId) {
            setErrors((prev) => ({ ...prev, attendees: '' }))
        }
    }

    const handleSkillChange = (skillId: string) => {
        setSelectedSkillId(skillId)
        const selectedSkillData = skillResponse?.data?.find(
            (skill: any) => skill.skill_id === parseInt(skillId)
        )
        setSelectedSkill(selectedSkillData ? selectedSkillData.skill_name : '')
        if (skillId) {
            setErrors((prev) => ({ ...prev, skills: '' }));
        }
    }
    const getAttendeeOptions = () => {

        return employeeResponse?.data?.filter(
            (emp: any) => {
                // If editing, allow the current attendee to be in the options
                if (editAttendeeId !== null) {
                    const currentAttendee = attendees.find(a => a.id === editAttendeeId);
                    if (currentAttendee && currentAttendee.employeeId === String(emp.id)) {
                        return true; // Include current attendee being edited
                    }
                }
                // Filter out other attendees that are already added
                return !attendees.some(
                    (attendee) => attendee.employeeId === String(emp.id)
                )
            }
        ) ?? [];
    }

    const getSkillOptions = () => {
        return skillResponse?.data?.filter(
            (skill: any) => {
                // If editing, allow the current skill to be in the options
                if (editSkillId !== null) {
                    const currentSkill = skills.find(s => s.id === editSkillId);
                    if (currentSkill && currentSkill.fk_eqms_hr_skill_master_id === String(skill.skill_id)) {
                        return true; // Include current skill being edited
                    }
                }
                // Filter out other skills that are already added
                return !skills.some(
                    (selectedSkill) => selectedSkill.fk_eqms_hr_skill_master_id === String(skill.skill_id)
                );
            }
        ) ?? [];
    }

    const validate = () => {
        const newErrors: { [key: string]: string } = {}
        if (!form.title?.trim()) newErrors.title = ERRORS.TRAINING_TITLE_ERROR
        if (!form.date_of_training) newErrors.date_of_training = ERRORS.DATE_ERROR
        if (!form.mode?.trim()) newErrors.mode = ERRORS.MODE_OF_TRAINING_ERROR
        if (!form?.trainer) newErrors.trainer = ERRORS.NAME_OF_TRAINING_ERROR
        if (skills.length === NUMBERMAP.ZERO) newErrors.skills = ERRORS.AT_LEAST_ONE_SKILL
        if (attendees.length === NUMBERMAP.ZERO) newErrors.attendee = ERRORS.AT_LEAST_ONE_ATTENDEE

        if (form.isEvaluated) {
            showActionAlert('customAlert', {
                title: TRAINING_EVALUATED_SCHEDULE.ALERT_TITLE,
                text: TRAINING_EVALUATED_SCHEDULE.TRAINING_EVALUATED_ALERT,
                icon: TRAINING_EVALUATED_SCHEDULE.ERROR_ICON,
                cancelButton: false,
                confirmButton: false,
            })
            return false
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === NUMBERMAP.ZERO
    }

    const handleDateChange = (value: any) => {
        const formattedDate = value ?? ''
        handleChange(DATE_CHANGE, formattedDate)
    }
    const prepareFileMetadatas = () => {
        // Get all file_ids from draftData.data.documents (preserved documents)
        const preservedDocumentIds = extractPreservedDocumentIds(draftData)
        const allDocumentsToDelete = [
            ...certificateFiles.documents_to_delete,
            ...supportingFiles.documents_to_delete
        ]

        // Prepare draft documents using the generic utility
        const createMetadata: Record<string, any> = {};
        const updateMetadata: Record<string, any> = {};
        const deleteMetadata: Record<string, any> = {};

        // Initialize create metadata sections
        createMetadata[FILE_SECTION_TABLES[CERTIFICATE_DOCUMENTS]] = {}
        createMetadata[FILE_SECTION_TABLES[TRAINING_DOCUMENTS]] = {}
        updateMetadata[FILE_SECTION_TABLES[CERTIFICATE_DOCUMENTS]] = { ...certificateFiles.update_meta_data }
        updateMetadata[FILE_SECTION_TABLES[TRAINING_DOCUMENTS]] = { ...supportingFiles.update_meta_data }


        // Merge update metadata from draft preparation - filter preserved documents
        const updateMetaDataBySection: Record<string, Record<string, any>> = {}
        if (draftData?.data?.draftUpdateMetaData && Object.keys(draftData?.data?.draftUpdateMetaData).length > NUMBERMAP.ZERO) {
            // Group by section if needed
            draftData?.data?.draftUpdateMetaData.forEach((document: any) => {
                // Determine which section this document belongs to based on document_type
                const sectionKey = document.document_type === 'eqms_hr_training_certificate_supporting_file'
                    ? FILE_SECTION_TABLES[CERTIFICATE_DOCUMENTS]
                    : FILE_SECTION_TABLES[TRAINING_DOCUMENTS]

                if (!updateMetaDataBySection[sectionKey]) {
                    updateMetaDataBySection[sectionKey] = {}
                }
                updateMetaDataBySection[sectionKey][document.file_id + '_' + document.file_name] = document
            })
        }

        // Filter update metadata to exclude preserved documents
        const filteredUpdateMetaData = filterNestedUpdateMetaData(
            allDocumentsToDelete,
            updateMetaDataBySection
        )

        // Build updateMetadata from filtered results
        Object.keys(filteredUpdateMetaData).forEach((sectionKey) => {
            updateMetadata[sectionKey] = filteredUpdateMetaData[sectionKey]
        })

        // Merge delete metadata - use documentsToDelete and draftDelete from draft preparation
        const documentsToDeleteBySection: Record<string, string[]> = {}

        // Collect certificate delete IDs
        const certificateDeleteIds: string[] = [
            ...certificateFiles.documents_to_delete.map(String),
            ...(draftData?.data?.draftDelete?.eqms_hr_training_certificate_supporting_file?.map(String) ?? [])
        ]
        if (certificateDeleteIds.length > NUMBERMAP.ZERO) {
            documentsToDeleteBySection[FILE_SECTION_TABLES[CERTIFICATE_DOCUMENTS]] = certificateDeleteIds
        }

        // Collect training delete IDs
        const trainingDeleteIds: string[] = [
            ...supportingFiles.documents_to_delete.map(String),
            ...(draftData?.data?.draftDelete?.eqms_hr_training_materials_supporting_file?.map(String) ?? [])
        ]
        if (trainingDeleteIds.length > NUMBERMAP.ZERO) {
            documentsToDeleteBySection[FILE_SECTION_TABLES[TRAINING_DOCUMENTS]] = trainingDeleteIds
        }

        // Filter documents_to_delete to exclude preserved documents
        const filteredDeleteBySection = filterDocumentsToDelete(
            preservedDocumentIds,
            documentsToDeleteBySection
        )

        // Build deleteMetadata from filtered results
        Object.keys(filteredDeleteBySection).forEach((sectionKey) => {
            deleteMetadata[sectionKey] = {
                fk_eqms_file_id: filteredDeleteBySection[sectionKey].map(Number).filter(id => !isNaN(id)),
            }
        })

        const documentsToCreate = [
            ...certificateFiles.documents_to_create.map((file: File) => {
                if (file instanceof File) {
                    const meta = certificateFiles.create_meta_data[file.name];
                    if (meta) {
                        const uuid = crypto.randomUUID();
                        const extension = file.name.split('.').pop();
                        const uniqueFileName = `${uuid}.${extension}`;
                        const newFile = new File([file], uniqueFileName, { type: file.type });
                        createMetadata[FILE_SECTION_TABLES[CERTIFICATE_DOCUMENTS]][uniqueFileName] = {
                            ...meta,
                            fk_eqms_file_id: '{fileId}',
                        };
                        return newFile;
                    }
                    return file;
                }
                return file;
            }),
            ...supportingFiles.documents_to_create.map((file: File) => {
                if (file instanceof File) {
                    const meta = supportingFiles.create_meta_data[file.name];
                    if (meta) {
                        const uuid = crypto.randomUUID();
                        const extension = file.name.split('.').pop();
                        const uniqueFileName = `${uuid}.${extension}`;
                        const newFile = new File([file], uniqueFileName, { type: file.type });
                        createMetadata[FILE_SECTION_TABLES[TRAINING_DOCUMENTS]][uniqueFileName] = {
                            ...meta,
                            fk_eqms_file_id: '{fileId}',
                        };
                        return newFile;
                    }
                    return file;
                }
                return file;
            }),
        ];

        return {
            fileOperation: { create: createMetadata, update: updateMetadata, delete: deleteMetadata },
            documents_to_create: documentsToCreate,
        };
    };

    const getFileSetter = (section: FileSection) => {
        const setters = {
            eqms_hr_training_certificate_supporting_file: setInitialCertificateFiles,
            eqms_hr_training_materials_supporting_file: setInitialSupportingFiles,
        }
        return setters[section]
    }

    const handleFileUpload = useCallback(
        (newFile: File | UploadedFileData, section: FileSection) => {
            const setter = getFileSetter(section);
            if (setter) {
                let uniqueFile: File | UploadedFileData = newFile;
                if (newFile instanceof File) {
                    const uuid = crypto.randomUUID();
                    const extension = newFile.name.split('.').pop();
                    const uniqueFileName = `${uuid}.${extension}`;
                    uniqueFile = new File([newFile], uniqueFileName, { type: newFile.type });
                }
                setter((prev) => [...prev, uniqueFile]);
            }
        },
        []
    );

    const handleFileEdit = useCallback(
        (updatedFile: UploadedFileData, section: FileSection) => {
            const setter = getFileSetter(section)
            if (setter) {
                setter((prev) =>
                    prev.map((file) => {
                        const currentId = file.id ?? file.document_id
                        const updatedId = updatedFile.id ?? updatedFile.document_id
                        return currentId === updatedId ? { ...file, ...updatedFile } : file
                    })
                )
            }
        },
        []
    )

    const handleFileSubmit = 
        (data: DocumentStructure, section: FileSection) => {
            if (section === TRAINING_DOCUMENTS) {
                setSupportingFiles((prev) => {
                    const merged = mergeFinalFileData(prev, data)
                    handleDraftSave(form, attendees, skills, {
                        training: merged,
                        certificate: certificateFiles,
                    })
                    return merged
                })
            } else if (section === CERTIFICATE_DOCUMENTS) {
                setCertificateFiles((prev) => {
                    const merged = mergeFinalFileData(prev, data)
                    handleDraftSave(form, attendees, skills, {
                        certificate: merged,
                        training: supportingFiles,
                    })
                    return merged
                })
            }
        }
    

    const handleSave = async () => {
        if (!validate()) return;
        // Clear draft save when submitting final form
        clearDraftSave();
        const result = prepareFileMetadatas();

        let keyValue: KeysInterface =
            scheduleId !== CREATE
                ? {
                    eqms_hr_training_schedule: {
                        id: Number(scheduleId),
                    },
                    eqms_hr_training_attendee: {
                        fk_eqms_hr_training_schedule_id: Number(scheduleId),
                    },
                    eqms_hr_training_skill: {
                        fk_eqms_hr_training_schedule_id: Number(scheduleId),
                    },
                }
                : {};
        let dataframeworkOtherParamsBag: KeysInterface =
            scheduleId !== CREATE
                ? {
                    eqms_hr_training_schedule: [
                        {
                            status: NUMBERMAP.ONE,
                        },
                    ],
                    eqms_hr_training_attendee: attendees.map(() => ({
                        fk_eqms_hr_training_schedule_id: Number(scheduleId),
                        status: NUMBERMAP.ONE,
                    })),
                    eqms_hr_training_skill: skills.map(() => ({
                        fk_eqms_hr_training_schedule_id: Number(scheduleId),
                        status: NUMBERMAP.ONE,
                    })),
                }
                : {
                    eqms_hr_training_schedule: [
                        {
                            status: NUMBERMAP.ONE,
                        },
                    ],
                    eqms_hr_training_attendee: attendees.map(() => ({
                        status: NUMBERMAP.ONE,
                    })),
                    eqms_hr_training_skill: skills.map(() => ({
                        status: NUMBERMAP.ONE,
                    })),
                };

        // Filter out deleted documents from draftDocuments
        const deleteIds = [
            ...(certificateFiles.documents_to_delete),
            ...(supportingFiles.documents_to_delete),
        ]
        const filteredDocuments = draftData?.data?.documents?.filter((doc: any) =>
            !deleteIds.includes(Number(doc.file_id))
        ) ?? []

        const response = await magicFormSave({
            currentFormRef: formRef,
            dataframeworkOperatorType:
                scheduleId !== CREATE
                    ? COMMON_CONSTANTS.UPDATE
                    : COMMON_CONSTANTS.INSERT,
            dataframeworkOtherParamsBag: dataframeworkOtherParamsBag,
            keys: keyValue,
            diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
            fileMetadata: result,
            draftDocuments: filteredDocuments
        });

        if (
            response.response.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
        ) {
            // Generate document after successful save using attendee IDs   
            if (scheduleId !== CREATE) {
                invalidateQuery();
                trainingById();
            }
            router.push(ROUTER_PATH.EDIT_LIST);
            showActionAlert(STATUS.SUCCESS);
            setInitialSupportingFiles([]);
            setInitialCertificateFiles([]);
        } else {
            showActionAlert(STATUS.FAILED);
        }
    };

    const handleOpenModal = () => {
        setAttendeeForm(DEFAULT_ATTENDEE)
        setEditAttendeeId(null)
        setModalOpen(true)
    }

    const handleEditAttendee = (row: any) => {
        const selectedEmployee = employeeResponse?.data?.find(
            (emp: any) => emp.employee_name === row.name
        )
        setAttendeeForm({
            id: row.id,
            name: row.name,
            Department: row.Department,
            employeeId: selectedEmployee ? String(selectedEmployee.id) : '',
        })
        setEditAttendeeId(row.id)
        setModalOpen(true)
    }

    const handleSaveAttendee = () => {
        if (!attendeeForm.employeeId?.toString().trim()) {
            setErrors((prev) => ({
                ...prev,
                attendees: ERRORS.AT_LEAST_ONE_ATTENDEE,
            }))
            return
        }

        if (!attendeeForm.name) return

        if (editAttendeeId !== null) {
            const updatedAttendees = [...attendees]
            const index = updatedAttendees.findIndex((a) => a.id === editAttendeeId)
            if (index !== -NUMBERMAP.ONE) {
                updatedAttendees[index] = { ...attendeeForm, id: editAttendeeId }
                setAttendees(updatedAttendees)
                setErrors((prev) => ({ ...prev, attendee: '' }))
                handleDraftSave(form, updatedAttendees, skills)
            }
        } else {
            const newAttendees = [
                ...attendees,
                {
                    ...attendeeForm,
                    id: attendees.length ? attendees[attendees.length - NUMBERMAP.ONE].id + NUMBERMAP.ONE : NUMBERMAP.ONE,
                },
            ]
            setAttendees(newAttendees)
            setErrors((prev) => ({ ...prev, attendee: '' }))
            handleDraftSave(form, newAttendees, skills)

        }

        setModalOpen(false)
        setAttendeeForm(DEFAULT_ATTENDEE)
        setEditAttendeeId(null)
    }


    const handleDeleteAttendee = (id: number) => {

        showActionAlert(DELETE).then((result) => {
            if (result.isConfirmed) {
                const updatedAttendees = attendees.filter((a) => a.id !== id)
                setAttendees(updatedAttendees)
                handleDraftSave(form, updatedAttendees, skills)

            }
        })
    }

    const handleOpenSkillModal = () => {
        setSelectedSkill('')
        setSelectedSkillId('')
        setEditSkillId(null)
        setErrors((prev) => ({ ...prev, skills: '' }));
        setSkillModalOpen(true)
    }

    const handleSaveSkill = () => {
        if (!selectedSkill || !selectedSkillId) {
            setErrors((prev) => ({
                ...prev,
                skills: ERRORS.AT_LEAST_ONE_SKILL,
            }))
            return;
        }

        const skill = {
            id: editSkillId ?? (skills.length ? skills[skills.length - NUMBERMAP.ONE].id + NUMBERMAP.ONE : NUMBERMAP.ONE),
            skill_name: selectedSkill,
            fk_eqms_hr_skill_master_id: selectedSkillId,
        };

        if (editSkillId !== null) {
            const updatedSkills = [...skills];
            const index = updatedSkills.findIndex((s) => s.id === editSkillId);
            if (index !== -NUMBERMAP.ONE) {
                updatedSkills[index] = skill;
                setSkills(updatedSkills);
                handleDraftSave(form, attendees, updatedSkills);

            }
        } else {
            const newSkills = [...skills, skill];
            setSkills(newSkills);
            handleDraftSave(form, attendees, newSkills);

        }

        // Clear the skill error correctly here
        setErrors((prev) => ({ ...prev, skills: '' }));

        // Reset modal state
        setSkillModalOpen(false);
        setSelectedSkill('');
        setSelectedSkillId('');
        setEditSkillId(null);
    };


    const handleEditSkill = (row: any) => {
        setSelectedSkill(row.skill_name)
        setSelectedSkillId(row.fk_eqms_hr_skill_master_id ?? '')
        setEditSkillId(row.id)
        setSkillModalOpen(true)
    }

    const handleDeleteSkill = (id: number) => {

        showActionAlert(DELETE).then((result) => {
            if (result.isConfirmed) {
                const updatedSkills = skills.filter((s) => s.id !== id)
                setSkills(updatedSkills)
                handleDraftSave(form, attendees, updatedSkills)

            }
        })
    }

    const attendeeColumns = [
        {
            field: ATTENDEE_FIELD.SERIAL,
            headerName: ATTENDEE_HEADERS.S_NO_HEADER,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => params.row.id,
        },
        {
            field: ATTENDEE_FIELD.NAME,
            headerName: NAME_CONSTANT,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => (
                <>
                    <input
                        type={TEXT}
                        data-sourcename={DATA_SOURCE_NAME.TRAINING_ATTENDEE}
                        data-fieldname={DATA_FIELD_NAMES.EMPLOYEE_ID_FIELD}
                        data-is-grid={TRUE}
                        readOnly
                        value={params.row.employeeId}
                        style={CommonInlineStyles.displayNone}
                    />
                    {params.value}
                </>
            ),
        },
        {
            field: DEPARTMENT_LABEL,
            headerName: DEPARTMENT_LABEL,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => params.row.Department,
        },
        {
            field: FIELDS.ACTION,
            headerName: HEADER_NAME.ACTION,
            flex: NUMBERMAP.HALF,
            renderCell: (params: any) => (
                <ActionButton
                    onEdit={() => handleEditAttendee(params.row)}
                    onDelete={() => handleDeleteAttendee(params.row.id)}
                />
            ),
        },
    ]

    const skillsColumns = [
        {
            field: ATTENDEE_FIELD.SERIAL,
            headerName: ATTENDEE_HEADERS.S_NO_HEADER,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => params.row.id,
        },
        {
            field: ATTENDEE_FIELD.SKILL_NAME,
            headerName: ATTENDEE_HEADERS.SKILL_NAME_ID,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => (
                <div>
                    <input
                        type={TEXT}
                        data-sourcename={DATA_SOURCE_NAME.TRAINING_SKILL}
                        data-fieldname={DATA_FIELD_NAMES.SKILL}
                        data-is-grid={TRUE}
                        readOnly
                        value={params.row.fk_eqms_hr_skill_master_id}
                        style={CommonInlineStyles.displayNone}
                    />
                    {params.value}
                </div>
            ),
        },
        {
            field: FIELDS.ACTION,
            headerName: HEADER_NAME.ACTION,
            flex: NUMBERMAP.HALF,
            renderCell: (params: any) => (
                <ActionButton
                    onEdit={() => handleEditSkill(params.row)}
                    onDelete={() => handleDeleteSkill(params.row.id)}
                />
            ),
        },
    ]
    return (
        <FormContainer ref={formRef} id={CONTAINER_ID}>
            {isDraftSaving && <DraftLoading />}
            <GlobalLoader loading={isAnyLoading(trainingScheduleLoading,isFetchingDraft)} />
            <FormWrapper>
                <Label title={TITLE} />
                <FormContent>
                    <Grid2 sx={{ pointerEvents: form.isEvaluated ? 'none' : 'auto' }}>
                        <Grid2 container spacing={NUMBERMAP.TWO}>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <InputField
                                    label={LABEL}
                                    placeholder={PLACE_HOLDERS.TRAINING}
                                    value={form.title}
                                    onChange={(v) => handleChange(DATA_FIELD_NAMES.TITLE, v)}
                                    error={errors.title}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.TITLE}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <DatePicker
                                    label={DATE}
                                    value={form.date_of_training ? dayjs(form.date_of_training ?? form?.date_of_training) : null}
                                    onChange={(v) => handleDateChange(v)}
                                    error={errors.date_of_training ?? ''}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.DATE_TRAINING}
                                    dataIsAutocomplete={formatDateForAPI(form.date_of_training)}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <InputField
                                    label={MODE_OF_TRAINING}
                                    placeholder={PLACE_HOLDERS.MODE}
                                    value={form.mode}
                                    onChange={(v) => handleChange(MODE, v)}
                                    error={errors.mode}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.MODE_TRAINING}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
                                <DataGridTable
                                    showAddButton
                                    onAddRow={handleOpenModal}
                                    columns={attendeeColumns}
                                    idField={ID_FIELD}
                                    rows={attendees}
                                    hideFooter
                                    title={ATTENDEES}
                                />
                                <ErrorText>{errors.attendee}</ErrorText>
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
                                <DataGridTable
                                    columns={skillsColumns}
                                    showAddButton
                                    onAddRow={handleOpenSkillModal}
                                    idField={ID_FIELD}
                                    rows={skills}
                                    hideFooter
                                    title={SKILL}
                                />
                                <ErrorText>{errors.skills}</ErrorText>
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <InputField
                                    label={LABELS.NAME_TRAINER}
                                    placeholder={PLACE_HOLDERS.TRAINER}
                                    keyField={ID_FIELD}
                                    valueField={VALUE_FIELDS.EMPLOYEE}
                                    isDropdown
                                    value={selectedEmployeeId ?? ''}
                                    onChange={handleEmployeeChange}
                                    options={employeeResponse?.data ?? []}
                                    disabled={employeesLoading}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.EMPLOYEE_ID_FIELD}
                                    dataIsAutocomplete={selectedEmployeeId ?? ''}
                                    error={errors.trainer}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <Description
                                    label={LABELS.COMPETENCY}
                                    placeholder={PLACE_HOLDERS.COMPETENCY}
                                    value={form.competency}
                                    onChange={(value) => handleChange(COMPETENCY_NAME, value)}
                                    error={errors.competency}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.COMPETENCY}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
                                <FileUploadManager
                                    subHeader={TRAINING_SCHEDULE_FILE_HEADERS.COMPETENCY_CERTIFICATES}
                                    initialFiles={initialCertificateFiles ?? []}
                                    onFileUpload={(file) =>
                                        handleFileUpload(file, CERTIFICATE_DOCUMENTS)
                                    }
                                    onFileEdit={(file) => handleFileEdit(file, CERTIFICATE_DOCUMENTS)}
                                    onSubmit={(data) => handleFileSubmit(data, CERTIFICATE_DOCUMENTS)}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <Description
                                    label={LABELS.TRAINING_MATERIALS}
                                    placeholder={PLACE_HOLDERS.TRAINING_MATERIALS}
                                    value={form.training}
                                    onChange={(value) => handleChange(TRAIN_NAME, value)}
                                    error={errors.training}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.TRAINING_MATERIALS}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.TWELVE }}>
                                <FileUploadManager
                                    subHeader={TRAINING_SCHEDULE_FILE_HEADERS.TRAINING_MATERIALS}
                                    initialFiles={initialSupportingFiles ?? []}
                                    onFileUpload={(file) =>
                                        handleFileUpload(file, TRAINING_DOCUMENTS)
                                    }
                                    onFileEdit={(file) => handleFileEdit(file, TRAINING_DOCUMENTS)}
                                    onSubmit={(data) => handleFileSubmit(data, TRAINING_DOCUMENTS)}
                                />
                            </Grid2>
                            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                                <InputField
                                    label={HEADER_NAME.LOCATION}
                                    placeholder={PLACE_HOLDERS.LOCATION}
                                    value={form.Location}
                                    onChange={(value) => handleChange(LOCATION_NAME, value)}
                                    dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                    dataFieldName={DATA_FIELD_NAMES.LOCATION_FIELD}
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <ButtonGroup
                        buttons={[
                            {
                                label: BUTTON_LABELS.CANCEL,
                                onClick: async () => {
                                    await checkUnsavedDraftBeforeLeave()
                                    router.push(ROUTER_PATH.EDIT_LIST)
                                },
                            },
                            { label: BUTTON_LABELS.SAVE, onClick: handleSave, variant: CONTAINED },
                        ]}
                    />
                </FormContent>
                <CommonModal
                    title={editAttendeeId ? EDIT_ATTENDEE : ADD_ATTENDEE}
                    open={modalOpen}
                    buttonRequired
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveAttendee}
                >
                    <Grid2 container spacing={NUMBERMAP.TWO}>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={LABELS.ATTENDEE}
                                placeholder={PLACE_HOLDERS.ATTENDEES}
                                keyField={ID_FIELD}
                                valueField={VALUE_FIELDS.EMPLOYEE}
                                isDropdown
                                value={attendeeForm.employeeId ?? ''}
                                onChange={handleAttendeeChange}
                                options={getAttendeeOptions()}
                                disabled={employeesLoading}
                                dataSourceName={DATA_SOURCE_NAME.TRAINING_SCHEDULE}
                                dataFieldName={DATA_FIELD_NAMES.EMPLOYEE_ID_FIELD}
                                dataIsAutocomplete={attendeeForm.employeeId}
                            />
                            {errors.attendees && (
                                <ErrorText>
                                    {errors.attendees}
                                </ErrorText>
                            )}

                        </Grid2>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InfoField label={DEPARTMENT_LABEL} value={attendeeForm.Department} />
                        </Grid2>
                    </Grid2>
                </CommonModal>
                <CommonModal
                    title={editSkillId ? EDIT_SKILL : ADD_SKILL}
                    open={skillModalOpen}
                    buttonRequired
                    onClose={() => {
                        setSkillModalOpen(false)
                        setSelectedSkill('')
                        setSelectedSkillId('')
                        setEditSkillId(null)
                        setErrors((prev) => ({ ...prev, skills: '' }))
                    }}
                    onSave={handleSaveSkill}
                >
                    <Grid2 container spacing={NUMBERMAP.TWO}>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={ATTENDEE_HEADERS.SKILL_NAME_POPUP}
                                placeholder={PLACE_HOLDERS.SKILL}
                                isDropdown
                                keyField={KEY_FIELDS.SKILL_ID_KEY}
                                valueField={ATTENDEE_FIELD.SKILL_NAME}
                                value={selectedSkillId}
                                onChange={handleSkillChange}
                                options={getSkillOptions()}
                                dataSourceName={DATA_SOURCE_NAME.TRAINING_SKILL}
                                dataFieldName={DATA_FIELD_NAMES.SKILL}
                                dataIsAutocomplete={selectedSkillId}
                            />
                            {errors.skills && (
                                <ErrorText>
                                    {errors.skills}
                                </ErrorText>
                            )}
                        </Grid2>
                    </Grid2>
                </CommonModal>
            </FormWrapper>
        </FormContainer>
    )
}

export default TrainingScheduleForm