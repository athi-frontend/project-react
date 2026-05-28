import { NUMBERMAP } from "@/constants/common"

export const DEFAULT_FORM_DATA = {
  firstName: '',
  lastName: '',
  department: '',
  employeeRole: '',
  nickName: '',
  emailId: '',
  contactNumber: '',
  responsibility: '',
  role: [] as string[],
  groupName: '',
  designation: '',
  employeeId: '',
}

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
export const NUMERIC_REGEX = /^\d+$/
export const ERROR_MESSAGES = {
  firstName: 'First Name is required',
  lastName: 'Last Name is required',
  nickName: 'Nick Name is required',
  emailIdRequired: 'Email ID is required',
  invalidEmail: 'Invalid Email ID',
  contactNumberRequired: 'Contact Number is required',
  invalidContactNumber: `Contact Number must be exactly ${NUMBERMAP.TEN} digits`,
  department: 'Department is required',
  responsibility: 'Responsibility is required',
  role: 'Role is required',
  groupName: 'Group Name is required',
  designation: 'Designation is required',
  employeeId: 'Employee No. is required',
}

export const InputProps = {
  NUMERIC: { inputMode: 'numeric', pattern: '[0-9]*' },
}

export const USER_REGISTRATION_ERROR_ITEMS: { field: keyof typeof DEFAULT_FORM_DATA; errormessage: string; type: "string" | "number" | "date" | "contact" | "array" | "email"; errorKey: string }[] = [
  { field: 'employeeId', errormessage: ERROR_MESSAGES.employeeId, type: 'string', errorKey: 'employeeId' },
  { field: 'nickName', errormessage: ERROR_MESSAGES.nickName, type: 'string', errorKey: 'nickName' },
  { field: 'role', errormessage: ERROR_MESSAGES.role, type: 'array', errorKey: 'role' },
  { field: 'emailId', errormessage: ERROR_MESSAGES.emailIdRequired, type: 'string', errorKey: 'emailId' },
  { field: 'emailId', errormessage: ERROR_MESSAGES.invalidEmail, type: 'email', errorKey: 'emailId' },
  { field: 'contactNumber', errormessage: ERROR_MESSAGES.contactNumberRequired, type: 'number', errorKey: 'contactNumber' },
  { field: 'contactNumber', errormessage: ERROR_MESSAGES.invalidContactNumber, type: 'contact', errorKey: 'contactNumber' },
  { field: 'responsibility', errormessage: ERROR_MESSAGES.responsibility, type: 'string', errorKey: 'responsibility' },
  { field: 'groupName', errormessage: ERROR_MESSAGES.groupName, type: 'string', errorKey: 'groupName' },
];