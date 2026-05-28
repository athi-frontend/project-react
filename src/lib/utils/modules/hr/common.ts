import { NUMBERMAP } from "@/constants/common";
import { DocumentStructure } from "@/types/modules/hr/employeeList";

type Item = { type: string; [key: string]: any };

export const groupByType = (arr: Item[]) =>
   arr.reduce<Record<string, { fk_eqms_file_id: string }[]>>(
  (acc, { document_type, file_id }) => {
    // Ensure the array exists for this document_type
    acc[document_type] ??= [];
    
    // Then push the new item
    acc[document_type].push({ fk_eqms_file_id: file_id });
    
    return acc;
  },
  {}
);


export const groupByForHR = (arr: Item[]) =>
  arr.reduce<Record<string, Record<string, { file_id: string }>>>(
    (acc, { document_type, file_id ,file_name}) => {
      // Initialize inner object if not exists
      acc[document_type] ||= {};
      // Assign nested key-value pair
      acc[document_type][file_id+'_'+file_name] = { file_id: file_id };
      return acc;
    },
    {}
  );


export function hasAnyDocumentData(docs: Record<string, DocumentStructure>): boolean {
  return Object.values(docs).some(doc => {
    return (
      (doc.documents_to_create?.length ?? NUMBERMAP.ZERO) > NUMBERMAP.ZERO ||
      (doc.documents_to_delete?.length ?? NUMBERMAP.ZERO) > NUMBERMAP.ZERO ||
      Object.keys(doc.create_meta_data ?? {}).length > NUMBERMAP.ZERO ||
      Object.keys(doc.update_meta_data ?? {}).length > NUMBERMAP.ZERO ||
      (doc.local_files_to_delete?.length ?? NUMBERMAP.ZERO) > NUMBERMAP.ZERO
    );
  });
}