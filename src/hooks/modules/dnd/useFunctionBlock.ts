import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query'
import {
  fetchAllFunctionalBlocks,
  fetchMainBlock,
  fetchSubBlock,
  upsertMainBlock,
  upsertSubBlock,
  deleteMainBlock,
  deleteSubBlock,
} from '@/services/modules/dnd/functionBlock'
import { FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'
import {
  MenuStructure,
  MainBlock,
  SubBlock,
  ApiBlock,
  UpsertMainBlockPayload,
  UpsertSubBlockPayload,
} from '@/types/modules/dnd/functionalBlock'

const { QUERYKEYS, DEFAULTS, GENERAL, ERRORS } = FUNCTIONAL_BLOCK_CONSTANTS

export const useFetchFunctionalBlocksQuery = (projectId: number) => {
  return useQuery<
    {
      code: number
      message?: string
      data: [{ product_name: string; blocks: ApiBlock[] }]
    },
    Error,
    MenuStructure
  >({
    queryKey: [QUERYKEYS.QUERY_KEY_FUNCTIONAL_BLOCKS, projectId],
    queryFn: () => fetchAllFunctionalBlocks(projectId),
    select: (response) => {
      const data = response.data?.[0]
      const blocks = data?.blocks ?? []
      return {
        productname: data?.product_name ?? DEFAULTS.DEFAULT_PRODUCT_NAME,
        menu: blocks.map((block: ApiBlock) => ({
          id: block.functional_block_id?.toString() ?? GENERAL.EMPTY_STRING,
          name: block.title ?? DEFAULTS.DEFAULT_BLOCK_NAME,
          description: block.description ?? GENERAL.EMPTY_STRING,
          child:
            block.functional_subblocks?.map((subBlock) => ({
              id:
                subBlock.functional_sub_block_id?.toString() ??
                GENERAL.EMPTY_STRING,
              name: subBlock.title ?? DEFAULTS.DEFAULT_SUB_BLOCK_NAME,
              description: subBlock.description ?? GENERAL.EMPTY_STRING,
            })) ?? [],
        })),
         action_control: response?.meta_info?.action_control,
         meta_info: response?.meta_info
      }
    },
  })
}

export const useFetchMainBlockQuery = (
  mainBlockId: string | undefined,
  options?: Partial<
    UseQueryOptions<MainBlock, Error, MainBlock, [string, string | undefined]>
  >
) => {
  return useQuery({
    queryKey: [QUERYKEYS.QUERY_KEY_MAIN_BLOCK, mainBlockId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey
      if (!id) throw new Error(ERRORS.ERROR_MAIN_BLOCK_ID_UNDEFINED)
      return fetchMainBlock(id)
    },
    enabled: false,
    ...options,
  })
}

export const useFetchSubBlockQuery = (
  subBlockId: string | undefined,
  options?: Partial<
    UseQueryOptions<SubBlock, Error, SubBlock, [string, string | undefined]>
  >
) => {
  return useQuery({
    queryKey: [QUERYKEYS.QUERY_KEY_SUB_BLOCK, subBlockId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey
      if (!id) throw new Error(ERRORS.ERROR_SUB_BLOCK_ID_UNDEFINED)
      return fetchSubBlock(id)
    },
    enabled: false,
    ...options,
  })
}

export const useResetQueryData = () => {
  const queryClient = useQueryClient()
  return (mainBlockId: string | undefined, subBlockId: string | undefined) => {
    queryClient.setQueryData(
      [QUERYKEYS.QUERY_KEY_MAIN_BLOCK, mainBlockId],
      GENERAL.INITIAL_STATE_UNDEFINED
    )
    queryClient.setQueryData(
      [QUERYKEYS.QUERY_KEY_SUB_BLOCK, subBlockId],
      GENERAL.INITIAL_STATE_UNDEFINED
    )
  }
}

export const useMutateUpsertMainBlock = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, UpsertMainBlockPayload>({
    mutationFn: async (payload) => {
      const response = await upsertMainBlock(payload)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.QUERY_KEY_FUNCTIONAL_BLOCKS, projectId],
      })
    },
    onError: (err: Error) => {},
  })
}

export const useMutateUpsertSubBlock = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, UpsertSubBlockPayload>({
    mutationFn: async (payload) => {
      const response = await upsertSubBlock(payload)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.QUERY_KEY_FUNCTIONAL_BLOCKS, projectId],
      })
    },
    onError: (err: Error) => {},
  })
}

export const useMutateDeleteMainBlock = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const blockId = parseInt(id)
      if (isNaN(blockId)) throw new Error(GENERAL.MAINBLOCK)
      const response = await deleteMainBlock(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.QUERY_KEY_FUNCTIONAL_BLOCKS, projectId],
      })
    },
    onError: (err: Error) => {},
  })
}

export const useMutateDeleteSubBlock = (projectId: number) => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const subBlockId = parseInt(id)
      if (isNaN(subBlockId)) throw new Error(GENERAL.SUBBLOCK)
      const response = await deleteSubBlock(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYKEYS.QUERY_KEY_FUNCTIONAL_BLOCKS, projectId],
      })
    },
    onError: (err: Error) => {},
  })
}
