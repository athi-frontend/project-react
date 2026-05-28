/**
 * Classification: Confidential
 */

export interface VendorCriteria {
  id: number | string;
  sno: number;
  criteria: string;
  requirement: string;
  category?: string;
  group: number;
  isParent?: boolean;
  isChild?: boolean;
  isChildAvailable?: boolean;
  order: number; // order within the group
  status?: number;
  group_criteria_mapper_id?: number;
  sub_group_id?: number;
  display_order?: number;
  vendorGroupId?: string | number;
  criteriaId?: string | number;
  requirementId?: string | number;
  statusId?: string | number;
  remarks?: string;
  [key: string]: any; // Allow additional fields from original data
}

export type NumericStringNullable = number | string | null;

export type DragPosition = 'top' | 'bottom';

