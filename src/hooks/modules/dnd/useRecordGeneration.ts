import { useQuery } from '@tanstack/react-query'
import {
    getDocumentsList, getStepperList
} from '@/services/modules/dnd/recordGeneration'

export const useRecordList = (project_id: string, form_id: string) => {
    return useQuery({
        queryKey: ['recordgenerate'],
        queryFn: () => getDocumentsList(project_id, form_id),
        enabled: false
    })
}

export const useStepperList = () => {
    return useQuery({
        queryKey: ['recordstepper'],
        queryFn: getStepperList,
    })
}

