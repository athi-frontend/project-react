import { NUMBERMAP } from '@/constants/common'
import {
  PROJECT,
  PROJECTDETAILS,
  SECTION_LABELS,
  SECTION_PATHS,
  UNDEFINED,
  HRLIST
} from '@/constants/components/ui/stepper'

export const generatePath = (
  base: string,
  projectId: string | string[] | undefined,
  decision_name: string
): string => {
  const isDesignProceeding =
    decision_name === PROJECTDETAILS || decision_name === ''

  if (!isDesignProceeding || !projectId) {
    return '#'
  }

  return `${base}${projectId}`
}

export const stepperSections = (
  projectId: string | string[] | undefined,
  decision_name: string
) => {
  const hasProject =
    typeof window !== UNDEFINED && localStorage.getItem(PROJECT)

  const projectDetailsItems = [
    {
      label: SECTION_LABELS.INFO_SECTION,
      path: generatePath(SECTION_PATHS.INFO_SECTION, projectId, ''),
    },
    {
      label: SECTION_LABELS.MARKET_STUDY,
      path: generatePath(SECTION_PATHS.MARKET_STUDY, projectId, ''),
    },
    {
      label: SECTION_LABELS.HLD,
      path: generatePath(SECTION_PATHS.HLD, projectId, ''),
    },
    {
      label: SECTION_LABELS.FEASIBILITY_STUDY,
      path: generatePath(SECTION_PATHS.FEASIBILITY_STUDY, projectId, ''),
    },
    {
      label: SECTION_LABELS.PND,
      path: generatePath(SECTION_PATHS.PND, projectId, decision_name),
    },
    {
      label: SECTION_LABELS.PND_REVIEW,
      path: generatePath(SECTION_PATHS.PND_REVIEW, projectId, decision_name),
    },
  ]

  const planItems = [
    {
      label: SECTION_LABELS.DESIGN_PROJECT_PLAN,
      path: generatePath(
        SECTION_PATHS.DESIGN_PROJECT_PLAN,
        projectId,
        decision_name
      ),
    },
  ]

  const digItems = [
    {
      label: SECTION_LABELS.APPLICABILITY,
      path: generatePath(SECTION_PATHS.APPLICABILITY, projectId, decision_name),
    },
    {
      label: SECTION_LABELS.FUNCTIONAL_BLOCKS,
      path: generatePath(
        SECTION_PATHS.FUNCTIONAL_BLOCKS,
        projectId,
        decision_name
      ),
    },
    {
      label: SECTION_LABELS.SPECIFICATION,
      path: generatePath(SECTION_PATHS.SPECIFICATION, projectId, decision_name),
    },
    {
      label: SECTION_LABELS.INTENDED_USE,
      path: generatePath(SECTION_PATHS.INTENDED_USE, projectId, decision_name),
    },
  ]

  const RecordGeneration = [
    {
      title:"Record Generation",
      path:generatePath(`/dnd/record-generation/${NUMBERMAP.THREE}/`, projectId, decision_name),
      items:[
      ]
    }
  ]

  if (!hasProject) {
    if (decision_name !== PROJECTDETAILS) {
      return [
        {
          title: SECTION_LABELS.PROJECT_DETAILS,
          items: projectDetailsItems.slice(0, NUMBERMAP.FOUR),
        },
       
      ]
    }
    return [
      {
        title: SECTION_LABELS.PROJECT_DETAILS,
        items: projectDetailsItems,
      },
    ]
  }

  if (decision_name !== PROJECTDETAILS) {
    return [
      {
        title: SECTION_LABELS.PROJECT_DETAILS,
        items: [projectDetailsItems[NUMBERMAP.ZERO]],
      },
       ...RecordGeneration
    ]
  }

  return [
    {
      title: SECTION_LABELS.PROJECT_DETAILS,
      items: [projectDetailsItems[NUMBERMAP.ZERO]],
    },
    {
      title: SECTION_LABELS.PLAN,
      items: planItems,
    },
    {
      title: SECTION_LABELS.DIG,
      items: digItems,
    },
     ...RecordGeneration
  ]
}

export const hrStepperSection = () => {

  return [
    {
      title: 'HR',
      items: HRLIST,
    },
  ]
}
