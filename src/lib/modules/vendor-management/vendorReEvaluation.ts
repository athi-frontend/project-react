/**
 * Classification : Confidential
 */

import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types';
import dayjs from 'dayjs';

/**
 * Calculate evaluation to date based on frequency
 * @param lastReevaluationDate - The last re-evaluation date in UTC format
 * @param frequencyName - The frequency name (Yearly, Half-yearly, Monthly, Quarterly)
 * @returns The calculated evaluation to date in local timezone format
 */
export const calculateEvaluationToDate = (
  lastReevaluationDate: string,
  frequencyName: string | undefined
): string => {
  if (!lastReevaluationDate) return "";

  // Parse the UTC date and convert to local timezone
  const baseDate = dayjs(lastReevaluationDate);
  if (!baseDate.isValid()) return "";

  let addedDate: dayjs.Dayjs;

  switch (frequencyName) {
    case "Yearly":
      addedDate = baseDate.add(1, 'year');
      break;
    case "Half-yearly":
      addedDate = baseDate.add(6, 'months');
      break;
    case "Monthly":
      addedDate = baseDate.add(1, 'month');
      break;
    case "Quarterly":
      addedDate = baseDate.add(3, 'months');
      break;
    default:
      // If frequency is not recognized, return the base date in local format
      return baseDate.toISOString();
  }

  // Convert the calculated date to local timezone format
  return addedDate.toISOString();
};

/**
 * Transform criteria data to flat structure for new API response format
 * @param criteriaGroups - Array of criteria groups from API
 * @param supportingFiles - Array of supporting files (optional)
 * @returns Flat array of VendorCriteria items
 */
export const transformCriteriaToFlat = (
  criteriaGroups: any[],
  supportingFiles: any[] = []
): VendorCriteria[] => {
  const flatData: VendorCriteria[] = [];
  let globalSno = 1;
  let groupIndex = 0;

  // Map requirement_id to requirement name (1 = mandatory, 2 = optional, etc.)
  const requirementMap: Record<number, string> = {
    1: 'mandatory',
    2: 'optional',
  };

  criteriaGroups.forEach((group: any) => {
    const groupId = group.group_id;
    const groupName = group.group_name;
    const groupMapperId = group.group_mapper_id;

    // Use group.applicable_group_files first (new API structure), then documents, then supportingFiles
    let groupDocuments: any[];
    if (group.applicable_group_files &&
        Array.isArray(group.applicable_group_files) &&
        group.applicable_group_files.length > 0) {
      groupDocuments = group.applicable_group_files;
    } else {
      groupDocuments = [];
    }

    // Create parent row
    const parentRow: VendorCriteria & { group_id?: number; documents?: any[] } = {
      id: `parent_${groupId}`,
      sno: globalSno++,
      criteria: groupName,
      requirement: '-', // Parent rows don't have requirement
      group: groupIndex + 1,
      isParent: true,
      order: 1,
      status: group.status_id ,
      group_criteria_mapper_id: groupMapperId,
      group_id: groupId,
      documents: groupDocuments ?? [], // Store group documents at parent level
    };
    flatData.push(parentRow as VendorCriteria);

    // Create child rows from criteria array
    if (group.criteria && Array.isArray(group.criteria)) {
      const sortedCriteria = [...group.criteria].sort(
        (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
      );

      sortedCriteria.forEach((criteria: any, childIndex: number) => {
        const childRow: VendorCriteria & { re_evaluation_group_criteria_mapper_id?: number } = {
          id: `child_${criteria.criteria_mapper_id}`,
          sno: globalSno++,
          criteria: criteria.criteria_name,
          requirement: requirementMap[criteria.requirement_id],
          group: groupIndex + 1,
          isParent: false,
          order: childIndex + 1,
          status: criteria.status_id,
          group_criteria_mapper_id: criteria.criteria_mapper_id,
          criteriaId: criteria.criteria_id?.toString(),
          requirementId: criteria.requirement_id?.toString(),
          re_evaluation_group_criteria_mapper_id: criteria.re_evaluation_group_criteria_mapper_id,
        };
        flatData.push(childRow);
      });
    }

    groupIndex++;
  });

  return flatData;
};
