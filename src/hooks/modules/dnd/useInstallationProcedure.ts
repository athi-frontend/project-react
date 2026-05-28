import { EQUIPMENT, INSTALLATION_ID, INSTALLATION_LIST_KEY, POSTINSTILATION, SKILL, TOOLS } from "@/constants/modules/dnd/installation"
import { deleteInstallation, getEquipment, getInstallationById, getInstallationList, getSkill, getTools, postInstallation } from "@/services/modules/dnd/installation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

/**
    Classification : Confidential
**/

export const useGetInstallationList = (projectId: number) => {
  return useQuery({
    queryKey: [INSTALLATION_LIST_KEY, projectId],
    queryFn: () => getInstallationList(projectId),
    enabled: !!projectId,
  })
}

export const useTools = () => {
  return useQuery({
    queryKey: [TOOLS],
    queryFn: getTools,
  })
}
export const useEquipment = () => {
  return useQuery({
    queryKey: [EQUIPMENT],
    queryFn: getEquipment,
  })
}
export const useSkill = () => {
  return useQuery({
    queryKey: [SKILL],
    queryFn: getSkill,
  })
}
 
export const usePostInstallation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [POSTINSTILATION],
    mutationFn: postInstallation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INSTALLATION_ID] })
    },
  })
}

export const useInstallationById = (installation_procedure_id: number) => {
  return useQuery({
    queryKey: [INSTALLATION_ID, installation_procedure_id],
    queryFn: () => getInstallationById(installation_procedure_id),
    enabled: !!installation_procedure_id,
  })
}

export const useDeleteInstallation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteInstallation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INSTALLATION_ID] })
    },
  })
}

