"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    InputField,
    Label,
    ButtonGroup,
    showActionAlert,
    DataGridTable,
    ActionButton,
    RichTextEditor,
    Description,
} from '@/components/ui';
import { Grid2, Checkbox, FormControlLabel } from '@mui/material';
import {
    FormContainer,
    FormWrapper,
    FormContent,
} from '@/styles/modules/user/userOnboard';
import { NUMBERMAP, STATUS, FINALFILEINITIALDATA } from '@/constants/common';
import DatePicker from '@/components/ui/data-picker/DataPicker';
import dayjs from 'dayjs';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { COMMON_CONSTANTS, convertMuiDayjsToUTC, mergeFinalFileData, FinalFileData, nonDigitRegex, emailRegex, currencyValidation, wholeNumberValidation, mapFileResponse, mapDocumentsByCategory } from '@/lib/utils/common';
import { ErrorText } from '@/styles/common';

import { ButtonContainer } from '@/styles/components/ui/button';
import {
    useQuotationById,
    useUpsertQuotation,
    useAllCustomers,
    useProductModels,
} from '@/hooks/modules/sales/useQuotation';
import { useGetProductAll } from '@/hooks/modules/dnd/useProject';
import { useOrganizationStatus } from '@/hooks/useCommonDropdown';
import { FORM_FIELD_NAMES } from '@/constants/modules/sales/quotation';
import {
    INITIATE_QUOTATION_DEFAULT_FORM,
    INITIATE_QUOTATION_DEFAULT_PRODUCT,
    INITIATE_QUOTATION_PAGE_STRINGS,
    INITIATE_QUOTATION_DROPDOWN_KEYS,
    INITIATE_QUOTATION_TABLE_FIELDS,
    initiateQuotationErrorItems,
    INITIAL_ERRORS,
    applyCustomQuotationValidation,
} from '@/constants/modules/sales/initiateQuotationPage';
import { validateFormFields } from '@/lib/utils/validateFormAndMapErrors';
import type {
    ProductDetailForm,
    QuotationFormState,
    InputValue,
} from '@/types/modules/sales/quotation';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';
import { removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';

const QuotationForm: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const quotationId = params.id;
    const isEditMode = Boolean(
        quotationId && quotationId !== INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.CREATE_ID
    );
    const initialDraftLoading = useRef(true)
    const formRef = useRef(null);
    const [form, setForm] = useState<QuotationFormState>({
        ...INITIATE_QUOTATION_DEFAULT_FORM,
    });
    const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS);
    const [products, setProducts] = useState<ProductDetailForm[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [productForm, setProductForm] = useState<ProductDetailForm>({
        ...INITIATE_QUOTATION_DEFAULT_PRODUCT,
    });
    const [productFormErrors, setProductFormErrors] = useState<{ [key: string]: string }>({});
    const [editProductId, setEditProductId] = useState<string | null>(null);
    const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
    const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]);
    const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
    const [draftDelete, setDraftDelete] = useState<string[]>([]);
    const [customerDisplayValue, setCustomerDisplayValue] = useState<string>('');

    // Draft save hook
    const quotationIdForDraft = isEditMode && quotationId && quotationId !== INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.CREATE_ID
        ? Number(quotationId)
        : null;
    const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
        context_type: 'quotation',
        context_instance_id: quotationIdForDraft,
        enableFetch: false
    });

    // API hooks
    const { data: quotationData, refetch: fetchQuotation } = useQuotationById(
        Number(quotationId), isEditMode);
    const { data: customersData } = useAllCustomers();
    const { data: statusData } = useOrganizationStatus();
    const { mutate: saveQuotation } = useUpsertQuotation();
    const { data: productData } = useGetProductAll();
    const { data: modelResponse } = useProductModels(productForm.product_id);
    
    // Get context_type from Redux (convert slug from "initiate-quotation" to "initiate_quotation")
    // Fetch draft on mount
    useEffect(() => {
        if (!isEditMode) {
            fetchDraft()
        } else {
            fetchQuotation()
        }
        setTimeout(() => {
            initialDraftLoading.current = false
        }, NUMBERMAP.THREETHOUSANDFIVEHUNDRED)
    }, [quotationId])

    // Load quotation data when editing
    const loadProductData = (data) => {
        if (data.products && Array.isArray(data.products)) {
            setProducts(data.products.map((product, index) => ({
                id: String(index + NUMBERMAP.ONE),
                ...product,
            })));
        }
    }
    useEffect(() => {
        if (quotationData?.data) {
            if (Array.isArray(quotationData.data) && quotationData.data.length > NUMBERMAP.ZERO) {
                const data = quotationData.data[NUMBERMAP.ZERO];
                const customerInfo = data.customer ?? null;
                const formData = {
                    ...INITIATE_QUOTATION_DEFAULT_FORM,
                    ...data,
                    ...customerInfo,
                };
                
                // Handle case where customer_id is empty string but customer_name has a value
                if (formData.customer_id === '' && formData.customer_name) {
                    formData.customer_type = 'others';
                    setCustomerDisplayValue(formData.customer_name);
                } else if (formData.customer_id) {
                    setCustomerDisplayValue(String(formData.customer_id));
                }
                
                setForm(formData);

                // Load products
                loadProductData(data)
                // Load files
                setUploadedDocuments(data?.supporting_files ?? []);

            }
            else {
                let draftedData = quotationData
                if (draftedData?.data?.documents) {
                    draftedData.data.documents = mapFileResponse(draftedData.data.documents ?? []);
                    draftedData.data.draftDocuments = mapDocumentsByCategory(draftedData.data?.draftDocuments ?? {});
                }
                draftLoading(draftedData?.data);
            }
        }
    }, [quotationData]);

    const draftLoading = (data) => {
        setForm({
            ...data,
        });
        
        // Handle case where customer_id is empty string but customer_name has a value
        if (data.customer_id === '' && data.customer_name) {
            setCustomerDisplayValue(data.customer_name);
        } else if (data.customer_id) {
            setCustomerDisplayValue(String(data.customer_id));
        }
        
        if (data.products && Array.isArray(data.products)) {
            setProducts(data.products);
        }
        setUploadedDocuments([...(data?.draftDocuments?.supporting_files ?? []), ...(data?.documents ?? [])]);
        setDraftDocuments(data?.draftDocuments ?? {});
        setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : []);

    }
    // Load draft data
    useEffect(() => {
        if (draftData?.data) {
            draftLoading(draftData.data);
        }
    }, [draftData]);

    useEffect(() => {
        if (finalFileData.documents_to_delete?.length > NUMBERMAP.ZERO) {
            setUploadedDocuments((prev) =>
                prev.filter((file: any) => {
                    const fileId = file?.file_id ?? file?.id;
                    return !finalFileData.documents_to_delete.includes(fileId);
                })
            );
        }

        if (finalFileData.local_files_to_delete?.length > NUMBERMAP.ZERO) {
            setUploadedDocuments((prev) =>
                prev.filter((file: any) => {
                    if (file?.file?.name) {
                        const lastIndex = file.file.name.lastIndexOf('.');
                        const id =
                            lastIndex !== NUMBERMAP.NEGATIVE_ONE
                                ? file.file.name.substring(NUMBERMAP.ZERO, lastIndex)
                                : file.file.name;
                        return !finalFileData.local_files_to_delete.includes(id);
                    }

                    return !finalFileData.local_files_to_delete.includes(file?.id);
                })
            );
        }
    }, [finalFileData]);

    const handleDraftSave = (formDataToSave: QuotationFormState, productsToSave?: ProductDetailForm[], fileData?: FinalFileData) => {
        const finalFileDataValue = fileData ?? finalFileData
        const productsToUse = productsToSave ?? products
        let draftDatas = draftData?.data ? draftData : quotationData

        const draftConfig = {
            fileFieldToSectionMap: { 'supporting_files': 'supporting_files' },
            sectionTypeToNameMap: { 'supporting_files': 'supporting_files' },
            responseDataKeyMap: { 'supporting_files': 'supporting_files' },
        }

        const arrayDraftDeleteForPrep: string[] | Record<string, string[]> = draftDelete.length > NUMBERMAP.ZERO 
            ? { [FORM_FIELD_NAMES.SUPPORTING_FILES]: draftDelete } 
            : []
        
        const objectDraftDeleteForPrep: string[] | Record<string, string[]> = typeof draftDelete === 'object' && !Array.isArray(draftDelete) 
            ? draftDelete 
            : []
        
        const draftDeleteForPrep: string[] | Record<string, string[]> = Array.isArray(draftDelete)
            ? arrayDraftDeleteForPrep
            : objectDraftDeleteForPrep

        const draftPreparation = prepareDraftDocumentsGeneric(
            draftDocuments,
            draftDeleteForPrep,
            { ...formDataToSave, [FORM_FIELD_NAMES.SUPPORTING_FILES]: uploadedDocuments ?? [] },
            { [FORM_FIELD_NAMES.SUPPORTING_FILES]: finalFileDataValue ?? FINALFILEINITIALDATA },
            draftDatas,
            draftConfig
        )

        if (draftPreparation.draftDocuments) {
            setDraftDocuments(draftPreparation.draftDocuments)
        }
        if (draftPreparation.draftDelete) {
            const deleteArray = Array.isArray(draftPreparation.draftDelete)
                ? draftPreparation.draftDelete
                : (draftPreparation.draftDelete[FORM_FIELD_NAMES.SUPPORTING_FILES] ?? Object.values(draftPreparation.draftDelete).flat())
            setDraftDelete(deleteArray)
        }

        const fieldsToRemove = [FORM_FIELD_NAMES.SUPPORTING_FILES]
        const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

        const payload = {
            id: quotationIdForDraft ?? new Date().getTime(),
            ...cleaned,
            products: productsToUse,
            draftDocuments: draftPreparation.draftDocuments,
            draftDelete: draftPreparation.draftDelete,
            type: 'draft',
        }

        draftSave({
            form_type: 'quotation',
            form_data: payload,
            upload_documents: {
                documents_to_create: finalFileDataValue?.documents_to_create ?? [],
                create_meta_data: draftPreparation.createMetaData,
                update_meta_data: draftPreparation.updateMetaData,
                documents_to_delete: [],
                documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
            },
            timestamp: new Date().toISOString(),
        })
    }

    const handleInputChange = (field: string, value: any) => {
        setForm((prev) => {
            const newData = { ...prev, [field]: value ?? '' };
            if (!initialDraftLoading.current) {
                handleDraftSave(newData);
            }
            return newData;
        });
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const handleQuantityChange = (prev: ProductDetailForm, value: InputValue): ProductDetailForm => {
        if (!value) {
            return { ...prev, [FORM_FIELD_NAMES.QUANTITY]: '' };
        }
        const valueString = String(value);
        // Allow empty string or valid whole number (no decimals)
        if (valueString === '' || wholeNumberValidation.test(valueString)) {
            return { ...prev, [FORM_FIELD_NAMES.QUANTITY]: valueString };
        }
        return prev;
    };

    const handlePriceChange = (prev: ProductDetailForm, value: InputValue): ProductDetailForm => {
        if (!value) {
            return { ...prev, [FORM_FIELD_NAMES.PRICE]: '' };
        }
        const valueString = String(value);
        // Allow empty string or valid currency format (positive number with max 2 decimal places)
        if (valueString === '' || currencyValidation.test(valueString)) {
            // Restrict to maximum 9 digits before decimal point
            const parts = valueString.split('.');
            const integerPart = parts[NUMBERMAP.ZERO] ?? '';
            const decimalPart = parts[NUMBERMAP.ONE] ?? '';
            const digitCount = integerPart.replace(nonDigitRegex, '').length;
            if (digitCount > NUMBERMAP.NINE) {
                return prev;
            }
            // Ensure decimal part has max 2 digits
            const formattedValue = decimalPart.length > NUMBERMAP.TWO
                ? `${integerPart}.${decimalPart.substring(NUMBERMAP.ZERO, NUMBERMAP.TWO)}`
                : valueString;
            return { ...prev, [FORM_FIELD_NAMES.PRICE]: formattedValue };
        }
        return prev;
    };

    const handleProductModelChange = (prev: ProductDetailForm, field: string, value: string | number | null): ProductDetailForm => {
        const newData = { ...prev, [field]: value };
        if (field === FORM_FIELD_NAMES.PRODUCT_ID) {
            newData.model_id = null;
            newData.model_name = '';
            const selectedProduct = (productData?.data ?? []).find(
                (p: any) => Number(p.product_id ?? p.id) === Number(value)
            );
            newData.product_name = selectedProduct?.product_name ?? selectedProduct?.product_type ?? '';
        } else if (field === FORM_FIELD_NAMES.MODEL_ID) {
            const selectedModel = (modelResponse?.data ?? []).find(
                (m: any) => Number(m.model_id ?? m.id) === Number(value)
            );
            newData.model_name = selectedModel?.model_name ?? selectedModel?.name ?? '';
        }
        return newData;
    };

    const handleProductInputChange = (field: string, value: string | number | null) => {
        setProductForm((prev) => {
            if (field === FORM_FIELD_NAMES.QUANTITY) {
                return handleQuantityChange(prev, value);
            }
            if (field === FORM_FIELD_NAMES.PRICE) {
                return handlePriceChange(prev, value);
            }
            return handleProductModelChange(prev, field, value);
        });
        if (productFormErrors[field]) {
            setProductFormErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    // Combine regular customers with custom customer if customer_type is 'others'
    const baseCustomers = customersData?.data ?? [];
    const hasCustomCustomer = (form.customer_type === 'others' && form.customer_name) || 
                              (form.customer_id === '' && form.customer_name);
    const customerOptions = hasCustomCustomer
        ? [...baseCustomers, {
            [INITIATE_QUOTATION_DROPDOWN_KEYS.CUSTOMER.KEY]: form.customer_name,
            [INITIATE_QUOTATION_DROPDOWN_KEYS.CUSTOMER.VALUE]: form.customer_name,
        }]
        : baseCustomers;

    // Extract customer field value logic into independent statement
    const getCustomerFieldValue = (): string => {
        // Handle case where customer_id is empty string but customer_name has a value (custom added data)
        if (form.customer_id === '' && form.customer_name) {
            return customerDisplayValue ?? form.customer_name;
        }
        if (form.customer_type === 'others') {
            return customerDisplayValue;
        }
        return form.customer_id ? String(form.customer_id) : '';
    };

    const handleCustomerChange = (customerId: string) => {
        // Handle empty/null values when dropdown is cleared
        if (!customerId || customerId === '' || customerId === 'null' || customerId === 'undefined') {
            handleInputChange(FORM_FIELD_NAMES.CUSTOMER_ID, null);
            handleInputChange(FORM_FIELD_NAMES.CUSTOMER_NAME, '');
            setCustomerDisplayValue('');
            return;
        }

      const numericValue = Number(customerId);
      // First check in regular customers list (not including custom customer)
      const selectedCustomer = (customersData?.data ?? []).find(
        (c: any) => Number(c.customer_id ?? c.id) === numericValue
      );
      
      // Check if it's a custom customer:
      // 1. Value is not a valid number (string customer name), OR
      // 2. It matches the current custom customer name (when re-selecting the custom customer)
      const isCustomCustomer = (customerId && isNaN(numericValue)) || 
                                (form.customer_type === 'others' && customerId === form.customer_name) ||
                                (form.customer_id === '' && form.customer_name && customerId === form.customer_name);
      
      if (isCustomCustomer) {
        // Custom customer: set customer_type to "others" and customer_name to the entered value
        const trimmedName = customerId.trim();
        handleInputChange(FORM_FIELD_NAMES.CUSTOMER_TYPE, 'others');
        handleInputChange(FORM_FIELD_NAMES.CUSTOMER_NAME, trimmedName);
        handleInputChange(FORM_FIELD_NAMES.CUSTOMER_ID, null);
        // Store the customer name in state variable for InputField display
        setCustomerDisplayValue(trimmedName);
      } else {
        // Existing customer: set customer_type to "existing", customer_id and customer_name from selected customer
        handleInputChange(FORM_FIELD_NAMES.CUSTOMER_TYPE, ' ');
        handleInputChange(FORM_FIELD_NAMES.CUSTOMER_ID, numericValue);
        if (selectedCustomer) {
          handleInputChange(FORM_FIELD_NAMES.CUSTOMER_NAME, selectedCustomer.customer_name ?? '');
        }
        // Store the customer_id for InputField display
        setCustomerDisplayValue(String(customerId));
      }
    };

    const handleStatusChange = (statusId: string) => {
        handleInputChange(FORM_FIELD_NAMES.STATUS, Number(statusId));
    };

    const handleDateChange = (value: any) => {
        const formattedDate = value ?? null;
        handleInputChange(FORM_FIELD_NAMES.QUOTATION_DATE, formattedDate);
    };

    const validate = () => {
        // Use common validation utility for standard fields
        const validationResult = validateFormFields(form, initiateQuotationErrorItems, INITIAL_ERRORS);
        const newErrors = { ...validationResult.errors };

        // Custom validation for customer_name based on customer_type
        if (form.customer_type === 'others') {
            if (!form.customer_name?.trim()) {
                newErrors.customer_name =
                    INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.CUSTOMER_NAME;
            }
        } else if (!form.customer_id) {
            newErrors.customer_name =
                INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.CUSTOMER_NAME;
        }


        // Custom validation for email
        if (!form.email_id?.trim()) {
            newErrors.email_id = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.EMAIL_ID;
        } else if (!emailRegex.test(form.email_id.trim())) {
            newErrors.email_id = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.INVALID_EMAIL_ID;
        }

        // Apply custom validation for quotation_date, status, products, and terms_and_condition
        const customValidationErrors = applyCustomQuotationValidation(form, products, newErrors);
        Object.assign(newErrors, customValidationErrors);

        setErrors(newErrors);
        const isValid = Object.values(newErrors).every(error => error === '');
        return isValid;
    };

    const handleFileUpload = useCallback((file: any) => {
        setUploadedDocuments((prev) => [...prev, file]);
    }, []);

    const handleFileEdit = useCallback((updatedFile: any) => {
        setUploadedDocuments((prev) =>
            prev.map((file: any) => {
                const currentId = file?.file_id ?? file?.id;
                const updatedId = updatedFile?.document_id ?? updatedFile?.file_id ?? updatedFile?.id;
                return String(currentId) === String(updatedId) ? { ...file, ...updatedFile } : file;
            })
        );
    }, []);

    const handleFileSubmit = (data: FinalFileData) => {
        setFinalFileData((prev) => mergeFinalFileData(prev, data));
        if (!initialDraftLoading.current) {
            handleDraftSave(form, products, mergeFinalFileData(finalFileData, data));
        }
    }

    const createFileMetadata = createFileMetadataGenerator({
        isEditMode,
        draftData,
        existingData: quotationData,
        finalFileData,
        dataPath: 'supporting_files',
    });

    const buildFormData = (): FormData => {
        const formData = new FormData();

        // Append basic fields
        if (form.quotation_id) {
            formData.append('quotation_id', form.quotation_id.toString());
        }
        formData.append('quotation_number', form.quotation_number);
        formData.append('customer_type', form.customer_type);
        // For custom customers (customer_type === 'others'), send customer_name and don't send customer_id
        // For existing customers, send the numeric customer_id
        if (form.customer_type === 'others' || (form.customer_id === '' && form.customer_name)) {
            formData.append('customer_name', form.customer_name);
        } else if (form.customer_id && typeof form.customer_id === 'number') {
            formData.append('customer_id', form.customer_id.toString());
        }
        formData.append('address', form.address);
        formData.append('feature_and_application', form.feature_and_application);
        formData.append('contact_person_name', form.contact_person_name);
        formData.append('email_id', form.email_id);
        formData.append('product_supply', form.product_supply);
        formData.append('quotation_date', convertMuiDayjsToUTC(form.quotation_date) ?? '');
        formData.append('status', form.status?.toString() ?? '');
        formData.append('terms_and_condition', form.terms_and_condition.toString());

        // Append product_details as JSON
        const productDetails = products.map(({ id,...product }) => ({
            ...product,
            product_status: product.product_status ?? NUMBERMAP.ZERO,
        }));
        formData.append('product_details', JSON.stringify(productDetails));

        // Handle file uploads and append file metadata
        appendFileMetadataToFormData(formData, finalFileData, createFileMetadata);

        return formData;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const formData = buildFormData();

        // Clear draft on successful save
        clearDraftSave();

        saveQuotation(formData, {
            onSuccess: (response) => {
                showActionAlert(STATUS.SUCCESS);
                setFinalFileData(FINALFILEINITIALDATA);
                setUploadedDocuments([]);
                router.push(INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.ROUTE);
            },
            onError: () => {
                showActionAlert(STATUS.FAILED);
            },
        });
    };

    const handleCancel = async () => {
        await checkUnsavedDraftBeforeLeave();
        router.push(INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.ROUTE);
        setProducts([]);
        setErrors(INITIAL_ERRORS);
    };

    const handleOpenProductModal = () => {
        setProductForm({ ...INITIATE_QUOTATION_DEFAULT_PRODUCT });
        setProductFormErrors({});
        setEditProductId(null);
        setModalOpen(true);
    };

    const handleEditProduct = (row: ProductDetailForm) => {
        setProductForm({
            ...row,
        });
        setProductFormErrors({});
        setEditProductId(row.id ?? null);
        setModalOpen(true);
    };

    const validateQuantity = (quantity: string | undefined): string => {
        if (!quantity?.trim()) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.QUANTITY;
        }
        const quantityValue = quantity.trim();
        if (!wholeNumberValidation.test(quantityValue)) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.INVALID_QUANTITY;
        }
        const numericValue = parseInt(quantityValue, NUMBERMAP.TEN);
        if (isNaN(numericValue) || numericValue <= NUMBERMAP.ZERO) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.QUANTITY_MUST_BE_POSITIVE;
        }
        return '';
    };

    const validatePrice = (price: string | undefined): string => {
        if (!price?.trim()) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.PRICE;
        }
        const priceValue = price.trim();
        if (!currencyValidation.test(priceValue)) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.INVALID_PRICE;
        }
        const numericValue = parseFloat(priceValue);
        if (isNaN(numericValue) || numericValue <= NUMBERMAP.ZERO) {
            return INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.PRICE_MUST_BE_POSITIVE;
        }
        return '';
    };

    const validateProductForm = (): { [key: string]: string } => {
        const newErrors: { [key: string]: string } = {};

        if (!productForm.product_id) {
            newErrors.product_id = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.PRODUCT_ID;
        }
        if (!productForm.model_id) {
            newErrors.model_id = INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.MODEL_ID;
        }

        const quantityError = validateQuantity(productForm.quantity);
        if (quantityError) {
            newErrors.quantity = quantityError;
        }

        const priceError = validatePrice(productForm.price);
        if (priceError) {
            newErrors.price = priceError;
        }

        return newErrors;
    };

    const checkForDuplicateProduct = (): boolean => {
        const duplicateProduct = products.find((p) => {
            if (editProductId !== null && p.id === editProductId) {
                return false;
            }
            if (p.product_status === NUMBERMAP.TWO) {
                return false;
            }
            return (
                Number(p.product_id) === Number(productForm.product_id) &&
                Number(p.model_id) === Number(productForm.model_id)
            );
        });

        if (duplicateProduct) {
            showActionAlert('customAlert', {
                title: INITIATE_QUOTATION_PAGE_STRINGS.ALERTS.DUPLICATE_PRODUCT_TITLE,
                text: INITIATE_QUOTATION_PAGE_STRINGS.ERRORS.DUPLICATE_PRODUCT_MODEL,
                icon: 'error',
                cancelButton: false,
                confirmButton: false,
                confirmButtonText: INITIATE_QUOTATION_PAGE_STRINGS.ALERTS.DUPLICATE_PRODUCT_CONFIRM_BUTTON,
            });
            return true;
        }
        return false;
    };

    const saveProductToState = () => {
        if (editProductId !== null) {
            const updatedProducts = [...products];
            const index = updatedProducts.findIndex((p) => p.id === editProductId);
            updatedProducts[index] = { ...productForm, id: editProductId };
            setProducts(updatedProducts);
            if (!initialDraftLoading.current) {
                handleDraftSave(form, updatedProducts);
            }
        } else {
            const newProducts = [...products, { ...productForm, id: String(products.length + NUMBERMAP.ONE) }];
            setProducts(newProducts);
            if (!initialDraftLoading.current) {
                handleDraftSave(form, newProducts);
            }
        }
    };

    const resetProductForm = () => {
        setModalOpen(false);
        setProductForm({ ...INITIATE_QUOTATION_DEFAULT_PRODUCT });
        setProductFormErrors({});
        setEditProductId(null);
        setErrors((prev) => ({ ...prev, products: '' }));
    };

    const handleSaveProduct = () => {
        const newErrors = validateProductForm();
        setProductFormErrors(newErrors);

        if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
            return;
        }

        if (checkForDuplicateProduct()) {
            return;
        }

        saveProductToState();
        resetProductForm();
    };

    const handleDeleteProduct = async (id: string) => {
        const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT);
        if (!result.isConfirmed) return;

        setProducts((prevProducts) => {
            const productIndex = prevProducts.findIndex((p) => p.id === id);
            const updatedProducts = [...prevProducts];
            updatedProducts[productIndex] = {
                ...updatedProducts[productIndex],
                product_status: NUMBERMAP.TWO,
            };
            if (!initialDraftLoading.current) {
                handleDraftSave(form, updatedProducts);
            }
            return updatedProducts;
        });
    };

    const productColumns = [
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.S_NO,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.S_NO,
            flex: NUMBERMAP.ONE,
        },
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.PRODUCT_NAME,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.PRODUCT_NAME,
            flex: NUMBERMAP.TWO,

        },
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.MODEL_NAME,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.MODEL_NAME,
            flex: NUMBERMAP.TWO,

        },
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.QUANTITY,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.QUANTITY,
            flex: NUMBERMAP.ONE,
        },
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.PRICE,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.PRICE,
            flex: NUMBERMAP.ONE,
        },
        {
            field: INITIATE_QUOTATION_TABLE_FIELDS.ACTIONS,
            headerName: INITIATE_QUOTATION_PAGE_STRINGS.TABLE_COLUMNS.ACTIONS,
            flex: NUMBERMAP.ONE,
            renderCell: (params: any) => (
                <ActionButton
                    onEdit={() => handleEditProduct(params.row)}
                    onDelete={() => handleDeleteProduct(params.id)}
                />
            ),
        },
    ];

    const actionButtons = [
        { label: INITIATE_QUOTATION_PAGE_STRINGS.BUTTONS.CANCEL, onClick: handleCancel },
        { label: INITIATE_QUOTATION_PAGE_STRINGS.BUTTONS.SAVE, onClick: handleSave },
    ];

    return (
        <FormContainer ref={formRef}>
            <FormWrapper>
                {isDraftSaving && <DraftLoading />}
                <Label title={INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.PAGE_TITLE} />
                <FormContent>
                    <Grid2 container spacing={NUMBERMAP.TWO}>
                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.QUOTATION_NUMBER}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.QUOTATION_NUMBER}
                                value={form.quotation_number}
                                onChange={(v: string) => handleInputChange(FORM_FIELD_NAMES.QUOTATION_NUMBER, v)}
                                error={errors.quotation_number}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.CUSTOMER_NAME}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.CUSTOMER_NAME}
                                isDropdown
                                keyField={INITIATE_QUOTATION_DROPDOWN_KEYS.CUSTOMER.KEY}
                                valueField={INITIATE_QUOTATION_DROPDOWN_KEYS.CUSTOMER.VALUE}
                                value={getCustomerFieldValue()}
                                onChange={handleCustomerChange}
                                options={customerOptions}
                                error={errors.customer_name}
                                customOption={true}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <Description
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.ADDRESS}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.ADDRESS}
                                value={form.address}
                                onChange={(value) => handleInputChange(FORM_FIELD_NAMES.ADDRESS, value)}
                                error={errors.address}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <RichTextEditor
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.FEATURES_AND_APPLICATION}
                                value={form.feature_and_application}
                                onChange={(value) => {
                                    if (!initialDraftLoading.current) {
                                        handleInputChange(FORM_FIELD_NAMES.FEATURE_AND_APPLICATION, value)
                                    }
                                }}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.FEATURES_AND_APPLICATION}
                                error={errors.feature_and_application}
                            />
                        </Grid2>

                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <DataGridTable
                                showAddButton
                                onAddRow={handleOpenProductModal}
                                columns={productColumns}
                                idField="id"
                                rows={products.filter((product) => product.product_status !== NUMBERMAP.TWO)}
                                hideFooter
                                title={INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.PRODUCT_DETAILS_TITLE}
                            />
                            {errors.products && <ErrorText>{errors.products}</ErrorText>}
                        </Grid2>

                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.CONTACT_PERSON_NAME}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.CONTACT_PERSON_NAME}
                                value={form.contact_person_name}
                                onChange={(v: string) => handleInputChange(FORM_FIELD_NAMES.CONTACT_PERSON_NAME, v)}
                                error={errors.contact_person_name}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.EMAIL_ID}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.EMAIL_ID}
                                value={form.email_id}
                                onChange={(v: string) => handleInputChange(FORM_FIELD_NAMES.EMAIL_ID, v)}
                                error={errors.email_id}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <RichTextEditor
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.PRODUCT_SUPPLY}
                                value={form.product_supply}
                                onChange={(value) => {
                                    if (!initialDraftLoading.current) {
                                        handleInputChange(FORM_FIELD_NAMES.PRODUCT_SUPPLY, value)
                                    }
                                }}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.PRODUCT_SUPPLY}
                                error={errors.product_supply}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <DatePicker
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.QUOTATION_DATE}
                                value={form.quotation_date ? dayjs(form.quotation_date) : null}
                                onChange={handleDateChange}
                                error={errors.quotation_date ?? ''}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.STATUS}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.STATUS}
                                isDropdown
                                keyField={INITIATE_QUOTATION_DROPDOWN_KEYS.STATUS.KEY}
                                valueField={INITIATE_QUOTATION_DROPDOWN_KEYS.STATUS.VALUE}
                                value={form.status ? String(form.status) : ''}
                                onChange={handleStatusChange}
                                options={statusData?.data ?? []}
                                error={errors.status}
                            />
                        </Grid2>

                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <FileUploadManager
                                subHeader={INITIATE_QUOTATION_PAGE_STRINGS.GENERAL.UPLOAD_SUBHEADER}
                                initialFiles={uploadedDocuments}
                                onFileUpload={handleFileUpload}
                                onFileEdit={handleFileEdit}
                                onSubmit={handleFileSubmit}
                            />
                        </Grid2>

                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={form.terms_and_condition === NUMBERMAP.ONE}
                                        onChange={(e) => handleInputChange(FORM_FIELD_NAMES.TERMS_AND_CONDITION, e.target.checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO)}
                                    />
                                }
                                label={
                                    <Grid2>
                                        <Grid2>
                                            {INITIATE_QUOTATION_PAGE_STRINGS.LABELS.TERMS_AND_CONDITIONS}
                                        </Grid2>
                                        <Grid2>
                                            {
                                                INITIATE_QUOTATION_PAGE_STRINGS.LABELS
                                                    .TERMS_AND_CONDITIONS_DESCRIPTION
                                            }
                                        </Grid2>
                                    </Grid2>
                                }
                            />
                            {errors.terms_and_condition && <ErrorText>{errors.terms_and_condition}</ErrorText>}
                        </Grid2>
                    </Grid2>

                    <ButtonContainer sx={{ marginTop: NUMBERMAP.FOUR }}>
                        <ButtonGroup buttons={actionButtons} />
                    </ButtonContainer>
                </FormContent>

                <CommonModal
                    title={
                        editProductId
                            ? INITIATE_QUOTATION_PAGE_STRINGS.MODAL.TITLE_EDIT
                            : INITIATE_QUOTATION_PAGE_STRINGS.MODAL.TITLE_ADD
                    }
                    open={modalOpen}
                    buttonRequired
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveProduct}
                >
                    <Grid2 container spacing={NUMBERMAP.ONE}>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.PRODUCT}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.PRODUCT}
                                isDropdown
                                keyField={INITIATE_QUOTATION_DROPDOWN_KEYS.PRODUCT.KEY}
                                valueField={INITIATE_QUOTATION_DROPDOWN_KEYS.PRODUCT.VALUE}
                                value={productForm.product_id ? String(productForm.product_id) : ''}
                                onChange={(v: string) => handleProductInputChange(FORM_FIELD_NAMES.PRODUCT_ID, Number(v))}
                                options={productData?.data ?? []}
                                error={productFormErrors.product_id}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.MODELS}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.MODELS}
                                isDropdown
                                keyField={INITIATE_QUOTATION_DROPDOWN_KEYS.MODEL.KEY}
                                valueField={INITIATE_QUOTATION_DROPDOWN_KEYS.MODEL.VALUE}
                                value={productForm.model_id ? String(productForm.model_id) : ''}
                                onChange={(v: string) => handleProductInputChange(FORM_FIELD_NAMES.MODEL_ID, Number(v))}
                                options={modelResponse?.data ?? []}
                                error={productFormErrors.model_id}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.QUANTITY}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.QUANTITY}
                                value={productForm.quantity}
                                onChange={(v: string) => handleProductInputChange(FORM_FIELD_NAMES.QUANTITY, v)}
                                error={productFormErrors.quantity}
                            />
                        </Grid2>
                        <Grid2 size={NUMBERMAP.TWELVE}>
                            <InputField
                                label={INITIATE_QUOTATION_PAGE_STRINGS.LABELS.PRICE}
                                placeholder={INITIATE_QUOTATION_PAGE_STRINGS.PLACEHOLDERS.PRICE}
                                value={productForm.price}
                                onChange={(v: string) => handleProductInputChange(FORM_FIELD_NAMES.PRICE, v)}
                                error={productFormErrors.price}
                            />
                        </Grid2>
                    </Grid2>
                </CommonModal>
            </FormWrapper>
        </FormContainer>
    );
};

export default QuotationForm;
