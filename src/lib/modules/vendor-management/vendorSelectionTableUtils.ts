/**
 * Classification: Confidential
 * Utility functions for Vendor Selection Table data transformation
 */

import type { SpecificationData, ColumnConfig, ChildColumnConfig, Sample } from '@/components/shared/VendorSelectionTable';

/**
 * Interface for API response structure
 * Accepts flexible structure to work with different API response formats
 */
export type InspectionResponseData = {
  data?: Array<{
    specification_details?: Array<{
      specification_id?: number;
      title?: string;
      description?: string;
      status?: number;
      samples?: Array<{
        sample_id: number;
        sample_number: number;
        sample_result: 0 | 1 | null;
        test_observation?: string;
      }> | Record<string, Array<{
        sample_id: number;
        sample_number: number;
        sample_result: 0 | 1 | null;
        test_observation?: string;
      }>>;
    }>;
    [key: string]: any;
  }>;
  [key: string]: any;
} | null | undefined;

/**
 * Transforms API inspection response data to VendorSelectionTable format
 * @param inspectionResponse - API response containing inspection data
 * @returns Array of SpecificationData objects
 */
export const transformInspectionDataToVendorSelection = (
  inspectionResponse: any
): SpecificationData[] => {
  if (!inspectionResponse?.data || !Array.isArray(inspectionResponse.data) || inspectionResponse.data.length === 0) {
    return [];
  }

  const firstItem = inspectionResponse.data[0];
  if (!firstItem.specification_details || !Array.isArray(firstItem.specification_details)) {
    return [];
  }

  return firstItem.specification_details.map((spec: any, index: number) => {
    // Check if samples are already grouped (Record<string, Sample[]>)
    let samplesGrouped: Record<string, Sample[]> = {};

    if (spec.samples && typeof spec.samples === 'object' && !Array.isArray(spec.samples)) {
      // Samples are already grouped by keys
      Object.keys(spec.samples).forEach((key) => {
        const sampleArray = Array.isArray(spec.samples[key]) ? spec.samples[key] : [spec.samples[key]];
        samplesGrouped[key] = sampleArray.map((sample: any) => ({
          sample_id: sample.sample_id,
          sample_number: sample.sample_number,
          sample_result: sample.sample_result ?? null,
          test_observation: sample.test_observation,
        }));
      });
    } else if (Array.isArray(spec.samples)) {
      // Samples are in array format - create a default group
      samplesGrouped['default'] = spec.samples.map((sample: any) => ({
        sample_id: sample.sample_id,
        sample_number: sample.sample_number,
        sample_result: sample.sample_result ?? null,
        test_observation: sample.test_observation,
      }));
    }

    return {
      title: spec.title ?? spec.description ?? `Specification ${index + 1}`,
      description: spec.description,
      status: spec.status,
      specification_id: spec.specification_id ?? index + 1,
      samples: samplesGrouped,
    };
  });
};

/**
 * Generates column configuration based on sample groups in the data
 * @param vendorSelectionData - Transformed specification data
 * @param parentHeaderName - Optional parent header name (default: "Samples")
 * @param childKey - Optional dynamic child key name (default: "child")
 * @param defaultColumns - Optional default columns to use when data is empty
 * @returns Array of ColumnConfig objects
 */
export const generateColumnsFromData = (
  vendorSelectionData: SpecificationData[],
  parentHeaderName: string = 'Samples',
  childKey: string = 'child',
  defaultColumns?: ColumnConfig[]
): ColumnConfig[] => {
  if (vendorSelectionData.length === 0) {
    // If user provided default columns, use them
    if (defaultColumns && defaultColumns.length > 0) {
      return defaultColumns;
    }
    // Otherwise, create default column structure
    const defaultColumn: ColumnConfig = {
      field: 'default',
      headerName: parentHeaderName,
      isChild: false,
      childkey: childKey,
    };
    defaultColumn[childKey] = [{
      field: 'default',
      headerName: 'Samples',
    }];
    return [defaultColumn];
  }

  // Collect all unique keys from all specifications
  const allKeys = new Set<string>();
  vendorSelectionData.forEach((spec) => {
    Object.keys(spec.samples).forEach((key) => allKeys.add(key));
  });

  // Convert to ColumnConfig array with parent-child structure
  const childColumns: ChildColumnConfig[] = Array.from(allKeys).map((key) => ({
    field: key,
    headerName: key === 'default' ? 'Samples' : key.charAt(0).toUpperCase() + key.slice(1),
  }));

  // Return parent column with child columns using dynamic key
  const parentColumn: ColumnConfig = {
    field: 'samples',
    headerName: parentHeaderName,
    isChild: false,
    childkey: childKey,
  };
  parentColumn[childKey] = childColumns;

  return [parentColumn];
};

/**
 * Calculates the maximum sample count from inspection response
 * @param inspectionResponse - API response containing inspection data
 * @param defaultCount - Default count to return if no samples found (default: 19)
 * @returns Maximum sample number found in the data
 */
export const calculateSampleCount = (
  inspectionResponse: any,
  defaultCount: number = 19
): number => {
  if (!inspectionResponse?.data || !Array.isArray(inspectionResponse.data) || inspectionResponse.data.length === 0) {
    return defaultCount;
  }

  const firstItem = inspectionResponse.data[0];
  if (!firstItem.specification_details || !Array.isArray(firstItem.specification_details)) {
    return defaultCount;
  }

  let maxSampleNumber = 0;
  firstItem.specification_details.forEach((spec: any) => {
    if (Array.isArray(spec.samples)) {
      spec.samples.forEach((sample: any) => {
        if (sample.sample_number && sample.sample_number > maxSampleNumber) {
          maxSampleNumber = sample.sample_number;
        }
      });
    } else if (spec.samples && typeof spec.samples === 'object') {
      // Handle grouped samples
      Object.values(spec.samples).forEach((sampleGroup: any) => {
        const samples = Array.isArray(sampleGroup) ? sampleGroup : [sampleGroup];
        samples.forEach((sample: any) => {
          if (sample.sample_number && sample.sample_number > maxSampleNumber) {
            maxSampleNumber = sample.sample_number;
          }
        });
      });
    }
  });

  return maxSampleNumber > 0 ? maxSampleNumber : defaultCount;
};

/**
 * Complete transformation function that returns all necessary data for VendorSelectionTable
 * @param inspectionResponse - API response containing inspection data
 * @param customSampleCount - Optional custom sample count (overrides calculated count)
 * @param defaultColumns - Optional default columns to use when data is empty
 * @param parentHeaderName - Optional parent header name (default: "Samples")
 * @param childKey - Optional dynamic child key name (default: "child")
 * @returns Object containing data, columns, and sampleCount
 */
export const prepareVendorSelectionTableData = (
  inspectionResponse: any,
  customSampleCount?: number,
  defaultColumns?: ColumnConfig[],
  parentHeaderName: string = 'Samples',
  childKey: string = 'child'
): {
  data: SpecificationData[];
  columns: ColumnConfig[];
  sampleCount: number;
} => {
  const data = transformInspectionDataToVendorSelection(inspectionResponse);
  const columns = generateColumnsFromData(data, parentHeaderName, childKey, defaultColumns);
  const sampleCount = customSampleCount ?? calculateSampleCount(inspectionResponse);

  return {
    data,
    columns,
    sampleCount,
  };
};

