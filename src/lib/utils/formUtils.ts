import { showActionAlert } from '@/components/ui';
import { COMMON_CONSTANTS } from './common';

// Map to store label to ID mappings for reverse lookup
const labelToIdMap = new Map<string, string>();

export function labelToId(label: string): string {
  const finalId = label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_') // replace spaces with underscores
  
  // Store the mapping for reverse lookup
  labelToIdMap.set(finalId, label);
  
  return finalId;
}

export function idToLabel(id: string): string {
  // First try to get from the stored mapping
  const storedLabel = labelToIdMap.get(id);
  if (storedLabel) {
    return storedLabel;
  }
  
    // Convert back to readable format
    return id
      .replace(/_/g, ' ') // replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // capitalize first letter of each word
}

function isValueEmpty(value: any): boolean {
  if (value === undefined) return true;
  if (value === null) return true;
  if (value === '') return true;
  if (Array.isArray(value) && value.length === COMMON_CONSTANTS.EMPTY_ARRAY_LENGTH) return true;
  return false;
}

function findFirstEmptyField(
  formValues: { [key: string]: any },
  fieldOrder: string[]
): string | undefined {
  return fieldOrder.find((key: string) => isValueEmpty(formValues[key]));
}

function findElementByLabel(label: string): HTMLElement | null {
  // Try to find element by the original label first
  let element = document.getElementById(label);
  
  // If not found, try to find by converted ID
  if (!element) {
    element = findElementByConvertedId(label);
  }
  
  return element;
}

function findElementByConvertedId(label: string): HTMLElement | null {
  const allElements = document.querySelectorAll('[id]');
  for (const el of allElements) {
    const elementId = el.getAttribute('id');
    if (elementId && idToLabel(elementId) === label) {
      return el as HTMLElement;
    }
  }
  return null;
}

function focusAndScrollToElement(element: HTMLElement): void {
  element.focus();
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showFieldNotFoundAlert(label: string): void {
  showActionAlert('customAlert', {
    ...COMMON_CONSTANTS.FORM_VALIDATION_ERROR,
    text: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.text + label,
  });
}

export function validateAndFocusFirstEmptyField(
  formValues: { [key: string]: any },
  fieldOrder: string[],
  fieldLabelMap: { [key: string]: string }
): boolean {
  const firstEmpty = findFirstEmptyField(formValues, fieldOrder);

  if (!firstEmpty) {
    return true;
  }

  const label = fieldLabelMap[firstEmpty] || firstEmpty;
  const element = findElementByLabel(label);
  
  if (element) {
    focusAndScrollToElement(element);
    return true;
  }
  
  showFieldNotFoundAlert(label);
  return false;
}