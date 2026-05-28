import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProjectList,
  deleteProject,
  getProjectInfo,
  submitProject,
  getProductAll,
  getProductCategory,
  getProductGroup,
  getProductType,
  getProductSubType,
  getMarketList,
  getRegulationList,
  getTagsList,
  fetchFileUrlInfo,
  updateProject,
  getUserAccess,
} from '@/services/modules/dnd/project'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { ProjectListQueryKey } from '@/types/modules/dnd/project'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { RESPONSE_KEYS } from '@/constants/modules/dnd/project'
import {
  projectListInitialData,
} from '@/lib/modules/dnd/projectScreen'
import { USER_ACCESS_KEY } from '@/constants/common'

/**
 Classification : Confidential
**/

const { FAILED_ALERT, INDEX_ZERO } = COMMON_CONSTANTS
const {
  PROJECT_LIST,
  PROJECT_INFO,
  PRODUCT_CATEGORY,
  PRODUCT_GROUP,
  PRODUCT_TYPE,
  PRODUCT_SUBTYPE,
  MARKET,
  REGULATION,
  TAGS,
} = RESPONSE_KEYS

export const useProjectListData = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: [PROJECT_LIST, page, pageSize] as ProjectListQueryKey,
    queryFn: getProjectList,
    initialData: projectListInitialData,
    gcTime: INDEX_ZERO,
    initialDataUpdatedAt: INDEX_ZERO,
    refetchOnWindowFocus: false,
  })
}

export const useSaveProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      projectId,
      formData,
    }: {
      projectId?: number
      formData: FormData
    }) =>
      projectId ? updateProject(projectId, formData) : submitProject(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_LIST] })
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

export const useProjectInfo = (projectId: number) => {
  return useQuery({
    queryKey: [PROJECT_INFO, projectId],
    queryFn: () => getProjectInfo(projectId),
    enabled: !!projectId,
    staleTime: INDEX_ZERO,
    refetchOnWindowFocus: false,
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECT_LIST] })
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}
export const FILE_URL = 'file-download'
export const useDownloadFile = (documentMediaID: string | number) => {
  return useQuery({
    queryKey: [FILE_URL, documentMediaID],
    queryFn: fetchFileUrlInfo,
    enabled: !!documentMediaID && documentMediaID !== '',
  })
}

export const useGetProductCategory = () => {
  return useQuery({
    queryKey: [PRODUCT_CATEGORY],
    queryFn: getProductCategory,
    enabled: true,
    refetchOnWindowFocus: false,
  })
}

export const useGetProductGroup = () => {
  return useQuery({
    queryKey: [PRODUCT_GROUP],
    queryFn: getProductGroup,
    enabled: true,
    refetchOnWindowFocus: false,
  })
}

export const useGetProductType = () => {
  return useQuery({
    queryKey: [PRODUCT_TYPE],
    queryFn: getProductType,
    enabled: true,
    refetchOnWindowFocus: false,
  })
}

export const useGetProductAll = () => {
  return useQuery({
    queryKey: [PRODUCT_TYPE, 'all'],
    queryFn: getProductAll,
    enabled: true,
    refetchOnWindowFocus: false,
  })
}

export const useGetProductSubType = (productTypeIds: (string | number)[]) => {
  return useQuery({
    queryKey: [PRODUCT_SUBTYPE, productTypeIds.join(',')],
    queryFn: async () => {
      const response = await getProductSubType(productTypeIds)
      const transformedData =
        response.data
          ?.filter((item) => {
            const isValid =
              (item.id ?? item.product_sub_type_id) &&
              (item.name ?? item.product_sub_type)
            return isValid
          })
          .map((item) => ({
            product_sub_type_id: String(item.id ?? item.product_sub_type_id),
            product_sub_type: item.name ?? item.product_sub_type,
          })) ?? []
      return { data: transformedData }
    },
    initialData: { data: [] },
    enabled: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const useGetMarketList = () => {
  return useQuery({
    queryKey: [MARKET],
    queryFn: getMarketList,
    enabled: false,
    refetchOnWindowFocus: false,
  })
}

/**
 * Hook to fetch regulations list based on market IDs
 * 
 * Author Harsithiga B
 * Date 12-08-2025
 * Description Fetches regulations data when markets are selected. Includes safety checks
 * to prevent errors with empty arrays and only enables API calls when markets are available.
 */
export const useGetRegulationList = (_fetched_ID: number[] | string[]) => {
  return useQuery({
    // Prevent error when array is empty by checking length before join
    queryKey: [REGULATION, _fetched_ID && _fetched_ID.length > 0 ? _fetched_ID.join(',') : ''],
    queryFn: getRegulationList,
    // Only enable when markets are actually selected (prevents unnecessary API calls)
    enabled: _fetched_ID && _fetched_ID.length > 0,
    refetchOnWindowFocus: false,
  })
}

export const useGetTagsList = () => {
  return useQuery({
    queryKey: [TAGS],
    queryFn: async () => {
      const response = await getTagsList()
      const transformedData = response.data
      return { data: transformedData }
    },
    initialData: { data: [] },
    enabled: true,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

export const useUserAccess = (menuInstanceType: string, menuInstanceTypeId: number) => {
  return useQuery({
    queryKey: [USER_ACCESS_KEY, menuInstanceType, menuInstanceTypeId],
    queryFn: () => getUserAccess(menuInstanceType, menuInstanceTypeId),
    enabled: !!menuInstanceType && !!menuInstanceTypeId,
    refetchOnWindowFocus: false,
  })
}

export const downloadFile = async (documentId: number | string) => {
  try {
    const blob = await fetchFileUrlInfo({ queryKey: ['file', documentId] })
    return blob
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error downloading file'
    throw new Error(errorMessage)
  }
}
