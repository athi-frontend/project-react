import { NUMBERMAP } from "@/constants/common";
import { FinalFileData } from "./common";

export function populateFormData(formData: FormData, finalFileData: FinalFileData): FormData {

  // documents_to_create (files)
  if (finalFileData.documents_to_create?.length > NUMBERMAP.ZERO) {
    finalFileData.documents_to_create.forEach((file: File) => {
      formData.append('documents_to_create', file, file.name);
    });
  }

  // documents_to_delete (IDs array)
  if (finalFileData.documents_to_delete?.length > NUMBERMAP.ZERO) {
    formData.append(
      'documents_to_delete',
      JSON.stringify(finalFileData.documents_to_delete.map((id: any) => Number(id)))
    );
  }

  // create_meta_data (object)
  if (finalFileData.create_meta_data && Object.keys(finalFileData.create_meta_data).length > NUMBERMAP.ZERO) {
    formData.append(
      'create_meta_data',
      JSON.stringify(finalFileData.create_meta_data)
    );
  }

  // update_meta_data (object)
  if (finalFileData.update_meta_data && Object.keys(finalFileData.update_meta_data).length > NUMBERMAP.ZERO) {
    formData.append(
      'update_meta_data',
      JSON.stringify(finalFileData.update_meta_data)
    );
  }

  return formData;
}
