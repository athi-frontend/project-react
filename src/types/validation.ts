/**
 * Validation types and interfaces
 * Common types used for form validation across the application
 */

/**
 * Classification : Confidential
 **/

export type FieldType = "number" | "string" | "date" | "contact" | "array" | "email";

export type ErrorObject = Record<string, string>;

export interface ErrorItem {
  field: string;
  errormessage: string;
  type: FieldType;
  errorKey: string;
}

