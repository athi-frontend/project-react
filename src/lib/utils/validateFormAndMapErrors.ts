/**
 * Common validation utility for form fields
 * This utility provides reusable validation functions that can be used across different screens
 */

/**
 * Classification : Confidential
 **/
import { NUMBERMAP } from '@/constants/common';
import { TELEPHONE_NUMBER_REGEX } from '@/constants/modules/vendor-management/vendorList';
import { FieldType, ErrorItem } from '@/types/validation'
import { EMAIL_REGEX } from '../modules/user/userOnboard';

/**
 * Validates if a contact number is valid
 * @param value - The contact number to validate
 * @returns true if valid, false otherwise
 */
export const isValidContactNumber = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  
  // Ensure value is a string or can be safely converted to string
  if (typeof value !== 'string' && typeof value !== 'number') return false;
  
  const stringValue = String(value).trim();
  if (stringValue.length === NUMBERMAP.ZERO) return false;
  
  // Use existing TELEPHONE_NUMBER_REGEX and validate length (10-12 digits)
  if (!TELEPHONE_NUMBER_REGEX.test(stringValue)) return false;
  
  // Remove + sign for length calculation
  const digitsOnly = stringValue.replace(/^\+/, '');
  const digitLength = digitsOnly.length;
  
  // Validate length: 10-12 digits
  return digitLength >= NUMBERMAP.TEN && digitLength <= NUMBERMAP.TWELVE;
};

/**
 * Checks if a value is invalid based on its type
 * @param value - The value to validate
 * @param type - The expected type of the field
 * @returns true if invalid, false if valid
 */
export const isInvalidByType = (
  value: unknown,
  type: FieldType
): boolean => {
  if (value === null || value === undefined) return true;
 
  switch (type) {
    case "string":
      // Ensure value is a string or can be safely converted to string
      if (typeof value !== 'string' && typeof value !== 'number') return true;
      return String(value).trim().length === NUMBERMAP.ZERO;
 
    case "number":
      return value === "" || Number.isNaN(Number(value));

    case "date":
      return !(value instanceof Date);

    case "email":
      if (typeof value !== 'string') return true;
      return !EMAIL_REGEX.test(value);

    case "contact":
      return !isValidContactNumber(value);

    case "array":
      return !Array.isArray(value) || value.length === NUMBERMAP.ZERO;

    default:
      return false;
  }
};


/**
 * Maps errors with validation based on form data and error items
 * @param errors - Array of error items to validate
 * @param formData - The form data object
 * @returns Object with field names (or errorKey if provided) as keys and error messages as values
 */
export const mapErrorsWithValidation = <
  T extends Record<string, any>
>(
  errors: ErrorItem[],
  formData: T
): Record<string, string> => {
  return errors.reduce((acc, curr) => {
    const key = curr.field as keyof T;
    const value = formData[key];
    // Use errorKey if provided, otherwise use field name
    const errorKey = curr.errorKey ?? curr.field;
 
    if (key in formData && isInvalidByType(value, curr.type) && !(errorKey in acc && acc[errorKey])) {
      acc[errorKey] = curr.errormessage;
    }
 
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Validates form fields based on error items configuration
 * This is a generic function that can be used for any form validation
 * @param formData - The form data to validate
 * @param errorItems - Array of error items defining validation rules
 * @param initialErrors - Initial error state object
 * @returns Object containing validation result and errors
 */
export const validateFormFields = <
  T extends Record<string, any>,
  E extends Record<string, string>
>(
  formData: T,
  errorItems: ErrorItem[],
  initialErrors: E
): { isValid: boolean; errors: E } => {
  const errors = mapErrorsWithValidation(errorItems, formData);
  
  // Merge with initial errors structure, preserving all keys from initialErrors
  const mergedErrors = { ...initialErrors };
  
  // Update with validation errors
  Object.keys(errors).forEach((key) => {
    if (key in mergedErrors) {
      (mergedErrors as any)[key] = errors[key];
    }
  });
  
  // Check if form is valid (no errors)
  const isValid = Object.values(mergedErrors).every(error => error === '');
  
  return {
    isValid,
    errors: mergedErrors,
  };
};

