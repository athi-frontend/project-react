'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Grid2, IconButton } from '@mui/material'
import { TableContainer } from '@/styles/common'
import { fetchSpecifications, useSaveRegulations, useRegulationMarket, useDeleteDevice } from '@/hooks/modules/dnd/useDirSpecificataion'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { ButtonGroup, Label, MultiSelect } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { Edit, Trash } from 'iconsax-react'
import { magicGridRowSave } from '@/lib/utils/magicSave'
import magicSaveConstants from '@/constants/magicSave'
import { useGetMarketList, useGetRegulationList } from '@/hooks/modules/dnd/useProject'
import { FORM_FIELDS_CONFIG, ROUTE_PATHS } from '@/constants/modules/dnd/project'
import { getColumns } from '@/lib/modules/dnd/dirSpecification'
import {
  SPECIFICATION_FORM_ID,
  SPECIFICATION_SCHEMA,
  SPECIFICATION_NAMES,
  ICON_PROPS,
  ICON_BUTTON_PROPS,
  DATA_GRID_DELETE_CLASS,
  FIELDS,
  TABLE_HEADERS,
  DEVICE_NAME,
  ACTIONS_NAME,
  DATA_SOURCE_NAMES,
  DATA_FIELD_NAMES,
  NO_SPECIFICATION,
  DATA_SOURCE,
  PERFORMANCE_SPECIFICATION_TITLE,
  STRINGS,
} from '@/constants/modules/dnd/dirSpecificataion'
import {
  buttonSectionStyles,
  pageLayerStyles,
  regulationStyles,
  gridSectionStyles
} from '@/styles/modules/dnd/dirSpecification'
import { NUMBERMAP } from '@/constants/common'
import { magicRead } from '@/lib/utils/magicRead'
import { BUTTONS, DELTE_DEVICE_ALERT } from '@/constants/modules/dnd/digSpecificaton'
import { GridColDef } from '@mui/x-data-grid'
import { renderSpecificationContent } from './SpecificationRenderer'
import {
  ProjectFormData,
  StepData,
  SpecsDataItem,
  SpecsDataResponse,
  RegulationItem,
  RegulationsListResponse,
  RegulationMarketDataResponse,
  MagicSaveResponse,
  StepConfiguration,
} from '@/types/components/modules/dirSpecifications'
import GlobalLoader from '@/components/shared/LoadingSpinner'

/**
Classification : Confidential
**/

/*
  Description: Validates the regulations form by checking if market and regulations are selected,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to validate regulations form
const validateRegulationsForm = (projectForm: ProjectFormData, regulationsList?: RegulationsListResponse) => {
  let hasError = false;
  const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
  
  if (!projectForm.market || projectForm.market.length === EMPTY_ARRAY_LENGTH) {
    newErrors.market = STRINGS.MARKET_REQUIRED
    hasError = true
  }
  if (
    !projectForm.regulations ||
    projectForm.regulations.length === EMPTY_ARRAY_LENGTH
  ) {
    newErrors.regulations = STRINGS.REGULATIONS_REQUIRED
    hasError = true
  }
  if (projectForm.market && projectForm.regulations &&
      projectForm.market.length > EMPTY_ARRAY_LENGTH &&
      projectForm.regulations.length > EMPTY_ARRAY_LENGTH
      ) {
    
    if (projectForm.regulations.length < projectForm.market.length) {
      newErrors.regulations = STRINGS.MARKET_REGULATION_REQUIRED;
      hasError = true;
    }
  }
  
  return { hasError, newErrors };
};

/*
  Description: Processes specification data to create step list with active specifications,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to process step data
const processStepData = (specsData: SpecsDataResponse) => {
  const { ACTIVE_STATUS } = COMMON_CONSTANTS;
  
  const steps =
    specsData?.data
      ?.filter((item: SpecsDataItem) => item.applicable_status === ACTIVE_STATUS)
      ?.map((item: SpecsDataItem) => ({
        id: item.design_specification_type_id,
        specificationApplicabilityID: item.specification_applicability_id,
        title: item.specification_type,
        subtitle: '',
      })) ?? [];
      
  if (steps.length === NUMBERMAP.ZERO) {
    steps.push({
      id: NUMBERMAP.ZERO,
      specificationApplicabilityID: NUMBERMAP.ZERO,
      title: NO_SPECIFICATION,
      subtitle: '',
    });
  }
  
  return steps;
};

/*
  Description: Creates device columns configuration for the data grid with edit and delete actions,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to create device columns
const createDeviceColumns = (handleEdit: Function, handleDelete: Function) => {
  const { IN_ACTIVE_STATUS } = COMMON_CONSTANTS;
  
  const deviceColumns: GridColDef[] = [
    {
      field: FIELDS.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.FOUR,
      renderHeader: (params) => (
        <b
          data-sourcename={DATA_SOURCE_NAMES.DEVICE}
          data-fieldname={SPECIFICATION_SCHEMA.ID}
        >
          {params.colDef.headerName}
        </b>
      ),
    },
    {
      field: FIELDS.DEVICE,
      headerName: DEVICE_NAME,
      flex: NUMBERMAP.FIVE,
      renderHeader: (params) => (
        <b
          data-sourcename={DATA_SOURCE_NAMES.DEVICE}
          data-fieldname={DATA_FIELD_NAMES.DEVICE_NAME}
        >
          {params.colDef.headerName}
        </b>
      ),
    },
    {
      field: FIELDS.ACTION,
      headerName: ACTIONS_NAME,
      flex: NUMBERMAP.ONE,
      renderHeader: (params) => (
        <b
          data-sourcename={DATA_SOURCE_NAMES.DEVICE}
          data-fieldname={DATA_FIELD_NAMES.STATUS}
        >
          {params.colDef.headerName}
        </b>
      ),
      renderCell: (params) => (
        /*
          Description: Added disabled state to the edit and delete icons,
          Author: Harsithiga B,
          Created: 21-08-2025,
          Modified:
          Classification : Confidential
        */
        <>
          <IconButton
            color={ICON_BUTTON_PROPS.EDIT_COLOR as "primary"}
            onClick={() => handleEdit(params.row.id, DEVICE_NAME_FORM)}
            disabled={params.row.status === IN_ACTIVE_STATUS}
          >
            <Edit size={NUMBERMAP.EIGHTEEN} color={ICON_PROPS.COLOR} />
          </IconButton>
          <IconButton
            color={ICON_BUTTON_PROPS.DELETE_COLOR as "error"}
            onClick={(e) => handleDelete(e, params.row)}
            data-sourcename={DATA_SOURCE_NAMES.DEVICE}
            data-fieldname={DATA_FIELD_NAMES.STATUS}
            data-status={params.row.status}
            value={params.row.status}
            disabled={params.row.status === IN_ACTIVE_STATUS}
          >
            <Trash size={NUMBERMAP.EIGHTEEN} color={ICON_PROPS.COLOR} />
          </IconButton>
        </>
      ),
    },
  ];
  
  return deviceColumns;
};

/*
  Description: Handles magic save delete operations for specifications and devices,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to handle magic save delete operations
const performMagicSaveDelete = async (
  currentTarget: HTMLElement,
  digId: number,
  specificationName: string,
  refetch: Function,
  setDomUpdate: Function,
  projectId?: number
) => {
  const { IN_ACTIVE_STATUS, UPDATE } = COMMON_CONSTANTS;
  
  let containerId;
  let dataframeworkOtherParamsBag = {};
  let keys = {};

  if (currentTarget.getAttribute(DATA_SOURCE) === DATA_SOURCE_NAMES.DEVICE) {
    containerId = SPECIFICATION_FORM_ID.OTHER_SPECIFICATION_DEVICE;
    keys = {
      eqms_device_lk: { id: digId, fk_eqms_project_id: projectId },
    };
    dataframeworkOtherParamsBag = {
      eqms_device_lk: [
        {
          status: IN_ACTIVE_STATUS,
        },
      ],
    };
  } else {
    containerId =
      (specificationName === FUNCTIONAL_SPECIFICATION || specificationName === SHELF_LIFE)
        ? SPECIFICATION_FORM_ID.FUNCTIONAL_SPECIFICATION_FORM_ID
        : SPECIFICATION_FORM_ID.OTHER_SPECIFICATION_FORM_ID;
    dataframeworkOtherParamsBag = {};
    keys = {
      eqms_dig_specification: { id: digId },
      eqms_dig_specification_mapper: { fk_eqms_target_specification_id: digId },
    };
  }

  const response = await magicGridRowSave({
    containerID: containerId,
    scopedEvents: currentTarget,
    eventClass: DATA_GRID_DELETE_CLASS,
    dataframeworkOperatorType: UPDATE,
    dataframeworkOtherParamsBag,
    keys,
    diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_NO,
  });

  const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS;
  showActionAlert(
    (response as MagicSaveResponse)?.response?.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ? SUCCESS_ALERT
      : FAILED_ALERT
  );
  refetch();
  setDomUpdate((prev: boolean) => !prev);
};

/*
  Description: Creates step configuration object for different specification types,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to create step configuration
const createStepConfiguration = (stepList: StepData[], getColValues: Function): StepConfiguration => {
  return stepList.reduce(
    (acc: StepConfiguration, step: StepData) => ({
      ...acc,
      [step.id]: {
        columns: getColValues(step.title),
        modal: '',
        listApi: '/list',
        addApi: '/add',
      },
    }),
    {}
  );
};

/*
  Description: Filters valid regulations based on currently selected markets to ensure data consistency,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to filter valid regulations based on current markets
const filterValidRegulations = (
  currentRegulations: (string | number)[],
  regulationsList: RegulationsListResponse,
  setProjectForm: Function
) => {
  const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS;
 
  if (
    currentRegulations.length > EMPTY_ARRAY_LENGTH &&
    regulationsList?.data &&
    regulationsList.data.length > EMPTY_ARRAY_LENGTH
  ) {
    // Filter regulations to keep only those associated with currently selected markets
    const validRegulations = currentRegulations.filter(
      (regulation: string | number) => {
        // Find the regulation in the regulations list
        const regulationData = regulationsList.data.find(
          (reg: RegulationItem) => reg.regulation_id == regulation
        );
 
        // Keep regulation only if it's associated with any of the currently selected markets
        return regulationData;
      }
    );
 
    // Update regulations state if any regulations were removed - ensure it's always an array
    if (validRegulations.length !== currentRegulations.length) {
      setProjectForm((prev: ProjectFormData) => ({
        ...prev,
        regulations: Array.isArray(validRegulations) ? validRegulations : [],
      }));
    }
  }
};

/*
  Description: Prefills market and regulations dropdowns with existing project data,
  Author: Harsithiga B,
  Created: 22-08-2025,
  Modified:
  Classification : Confidential
*/
// Helper function to prefill regulation market data
const prefillRegulationMarketData = (
  regulationMarketData: RegulationMarketDataResponse,
  specificationName: string,
  hasPrefilled: React.RefObject<boolean>,
  setProjectForm: Function
) => {
  if (
    specificationName === SPECIFICATION_NAMES.REGULATIONS &&
    regulationMarketData?.data &&
    !hasPrefilled.current
  ) {
    const { markets, regulations } = regulationMarketData.data;
    if (markets && regulations) {
      setProjectForm((prev: ProjectFormData) => ({
        ...prev,
        market: Array.isArray(markets) ? markets : [],
        regulations: Array.isArray(regulations) ? regulations : [],
      }));
      hasPrefilled.current = true;
    }
  }
};

// Constants
const {
  DELETE_ALERT,
  SUCCESS_ALERT,
  FAILED_ALERT,
  IN_ACTIVE_STATUS,
  ACTIVE_STATUS,
  EMPTY_ARRAY_LENGTH,
  SUCCESS_CODE,
} = COMMON_CONSTANTS;

const { FUNCTIONAL_SPECIFICATION, DEVICE_COMPATIBILITY, DEVICE_NAME_FORM, SHELF_LIFE } = SPECIFICATION_NAMES;
const DIRComponent = dynamic(
  () => import('@/components/ui/stepper/DIRComponent'),
  { ssr: false }
)

export default function DIRSpecification() {
  const gridRef = useRef(null)
  const [currentStep, setCurrentStep] = useState<number | null>(NUMBERMAP.ZERO)
  const [specificationInputId, setSpecificationInputId] = useState(
    NUMBERMAP.ZERO
  )
  const [stepList, setStepList] = useState<StepData[]>([])
  const [
    currentSpecificationApplicabilityId,
    setCurrentSpecificationApplicabilityId,
  ] = useState(0)
  const [openForm, setOpenForm] = useState<string | null>(null)
  const [physicalDataResponse, setPhysicalDataResponse] = useState([])
  const [deviceDataResponse, setDeviceDataResponse] = useState([])
  const [physicalLoading, setPhysicalLoading] = useState(false)
  const [specificationTitle, setSpecificationTitle] = useState('')
  const [specificationName, setSpecificationName] = useState('')
  const [domUpdate, setDomUpdate] = useState(false)
  const [accessoriesConsumablesApplicabilityId, setAccessoriesConsumablesApplicabilityId] = useState<number>(NUMBERMAP.ZERO)
  const [designSpecificationTypeId, setDesignSpecificationTypeId] = useState(NUMBERMAP.ZERO)
  
  const params = useParams()
  const router = useRouter()
  const projectID = params.id

  // Initialize with empty arrays to ensure controlled components
  const [projectForm, setProjectForm] = useState<ProjectFormData>({
    market: [],
    regulations: [],
  })
  
  const { data: marketList, refetch: productMarketRefetch } = useGetMarketList()
  
  /**
   * Regulations API conditional logic
   * 
   * Author: Harsithiga B
   * Date: 12-08-2025
   * Description: Ensures regulations API is called only when specification name is 'Regulations' 
   * AND markets are selected. Prevents unnecessary API calls and improves performance.
   */
  // Ensure regulations API is called only when specification name is 'Regulations' AND markets are selected
  const shouldCallRegulationsAPI = specificationName === SPECIFICATION_NAMES.REGULATIONS && 
    projectForm.market && projectForm.market.length > NUMBERMAP.ZERO
  const marketIds = shouldCallRegulationsAPI ? projectForm.market : []
  
  // Always call the hook but control when it's enabled - ensure we always pass a valid array
  const { data: regulationsList } = useGetRegulationList(marketIds as number[])

  const { mutate: saveRegulationMarket } = useSaveRegulations()
  const { mutate: deleteDevice } = useDeleteDevice()

  // Fetch regulation-market data for prefilling dropdowns
  const { data: regulationMarketData } = useRegulationMarket(
    specificationName === SPECIFICATION_NAMES.REGULATIONS && projectID ? Number(projectID) : 0
  )

  /** Author: Harsithiga B
  Date: 12-08-2025
  Description: Handling the API call only in Regulations **/
  useEffect(() => {
    if (specificationName === SPECIFICATION_NAMES.REGULATIONS) {
      productMarketRefetch()
    }
  }, [specificationName])

  /**
   * 
   * Author: Harsithiga B
   * Date: 21-08-2025
   * Description: When the regulations list meaningfully changes (due to market selection changes), 
   * automatically remove regulations that are no longer available or associated with 
   * currently selected markets. This ensures data consistency and prevents orphaned 
   * regulation selections. Includes safeguards to prevent processing during initial load
   * or when the list is empty.
   */
   useEffect(() => {
    if (projectForm.market.length === EMPTY_ARRAY_LENGTH) {
      setProjectForm((prev) => ({
        ...prev,
        regulations: [],
      }));
    }
  }, [projectForm.market.length])

  useEffect(() => {
    if (regulationsList?.data && projectForm.regulations.length > EMPTY_ARRAY_LENGTH) {
      filterValidRegulations(projectForm.regulations, regulationsList, setProjectForm);
    }
  }, [regulationsList?.data])
  
  /**
   * Prefill market and regulations dropdowns when data is available
   * 
   * Author: Harsithiga B
   * Date: 21-08-2025
   * Description: Automatically populates market and regulations dropdowns with existing project data
   * when the Regulations specification is selected. Uses a ref to ensure prefilling only happens once
   * and prevents useEffect dependency array size changes between renders.
   * Classification Level: Confidential
   */
  const hasPrefilled = useRef(false)
  
  // Reset prefilling flag when specification name changes
  useEffect(() => {
    if (specificationName !== SPECIFICATION_NAMES.REGULATIONS) {
      hasPrefilled.current = false
      // Clear errors when navigating away from Regulations
      setErrors({})
    }
  }, [specificationName])
  
  useEffect(() => {
      if (regulationMarketData && specificationName === SPECIFICATION_NAMES.REGULATIONS && !hasPrefilled.current) {
      prefillRegulationMarketData(regulationMarketData, specificationName, hasPrefilled, setProjectForm);
    }
  }, [regulationMarketData?.data, specificationName])
  
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})
  
  const handleInputChange = (
    name: keyof ProjectFormData,
    value: string | number | (string | number)[] | null
  ) => {
    // Ensure the value is always an array for form consistency
    const normalizedValue = (value ?? []) as (string | number)[];
    
    setProjectForm((prev) => ({
      ...prev,
      [name]: normalizedValue,
    }))
  
    setErrors((prevErrors) => {
      const newErrors = {...prevErrors};
      if (name === STRINGS.MARKET) {
        newErrors.market = '';
        newErrors.regulations = '';
      }
      if (name === STRINGS.REGULATIONS) {
        newErrors.regulations = '';
      }
    return newErrors;
    })
  }


  const keys = {
    eqms_dig_specification: {
      fk_eqms_project_applicable_specification_id:
        currentSpecificationApplicabilityId,
    },
  }

  const refetch = () => {
    readData(keys)
  }
  const {
    data: specsData,
    isLoading: loadpage,
    refetch: fetchSpecification,
  } = fetchSpecifications(Number(projectID))

  useEffect(() => {
    if (projectID) {
      fetchSpecification()
    }
  }, [projectID])

  const magicSaveDelete = async (currentTarget: any, digId: any) => {
    await performMagicSaveDelete(
      currentTarget,
      digId,
      specificationName,
      refetch,
      setDomUpdate,
      Number(projectID)
    );
  };

  useEffect(() => {
    if (currentStep && stepList.length > EMPTY_ARRAY_LENGTH) {
      const currentStepData = stepList.find((step) => step.id === currentStep)
      if (currentStepData) {
        setCurrentSpecificationApplicabilityId(
          currentStepData.specificationApplicabilityID
        )
        setDesignSpecificationTypeId(currentStepData.id)
        setSpecificationTitle(currentStepData.title)

        setSpecificationName(currentStepData.title)

      }
    }
    setDomUpdate(false)
  }, [currentStep, stepList])

  useEffect(() => {
    if (specsData?.data) {
      const steps = processStepData(specsData);
      setStepList(steps);
      
      // Set accessories & consumables applicability ID
      const accessoriesStep = steps.find(step => step.title === SPECIFICATION_NAMES.ACCESSORIES_CONSUMABLES);
      if (accessoriesStep) {
        setAccessoriesConsumablesApplicabilityId(accessoriesStep.specificationApplicabilityID);
      }
    }
  }, [specsData])

  /** Author: Harsithiga B
  Date: 12-08-2025
  Description: Redirecting to project List Page during Cancel
  Classification Level: Confidential **/
  const handleCancel = () =>{
    router.push(ROUTE_PATHS.DND_PROJECT_LIST)
  }

  const handleSave = async () => {
    if (specificationName === SPECIFICATION_NAMES.REGULATIONS) {
      const { hasError, newErrors } = validateRegulationsForm(projectForm, regulationsList);
      setErrors(newErrors);
      if (hasError) return;

      const market = projectForm.market.map((item: any) => (typeof item === 'object' && item.id !== undefined ? item.id : item));
      const regulations = projectForm.regulations.map((item: any) => (typeof item === 'object' && item.id !== undefined ? item.id : item));
      const payload = {
        project_id: projectID ? Number(projectID) : '',
        regulations,
        market,
      };
      saveRegulationMarket(payload, {
        onSuccess: (response: any) => {
          if (response?.code === NUMBERMAP.TWOHUNDRED || response?.code === SUCCESS_CODE) {
            showActionAlert(SUCCESS_ALERT);
          }
        },
        onError: () => {
          showActionAlert(FAILED_ALERT);
        }
      });
    }
  }

    const handleToggle = (formName: string) => {
    if (
      currentSpecificationApplicabilityId === NUMBERMAP.ZERO &&
      formName !== DEVICE_NAME_FORM
    ) {
      return
    }
    setSpecificationInputId(NUMBERMAP.ZERO)
    setOpenForm((prev) => (prev === formName ? null : formName))
  }

  const handleDelete = async (e: React.MouseEvent, data: any) => {
    const currentTarget = e.currentTarget
    /** Author: Harsithiga B
  Modified: 25-08-2025
  Description: Added custom alert for device deletion
  Classification Level: Confidential **/
  
    // Check if this is a device deletion (device table)
    const isDeviceDeletion = currentTarget.getAttribute(DATA_SOURCE) === DATA_SOURCE_NAMES.DEVICE
    
    let result
    if (isDeviceDeletion) {
      // Custom alert for device deletion
      result = await showActionAlert('customAlert', {
        title: DELTE_DEVICE_ALERT.DEVICE_DELETE_TITLE,
        text: DELTE_DEVICE_ALERT.DEVICE_DELETE_MESSAGE,
        icon: 'warning' as const,
        cancelButton: true,
        confirmButton: true,
      })
    } else {
      // Standard delete alert for specifications
      result = await showActionAlert(DELETE_ALERT)
    }
    
    if (result.isConfirmed) {
      if (isDeviceDeletion) {
        // Call device delete API
        deleteDevice(data.id, {
          onSuccess: () => {
            showActionAlert(SUCCESS_ALERT)
            refetch()
          },
          onError: () => {
            showActionAlert(FAILED_ALERT)
          }
        })
      } else {
        // Standard magic save delete for specifications
        const target = currentTarget

        const currentStatus = target.getAttribute(magicSaveConstants.DATA_STATUS)

        const newStatus =
          Number(currentStatus) === ACTIVE_STATUS
            ? IN_ACTIVE_STATUS
            : ACTIVE_STATUS

        target.setAttribute(magicSaveConstants.DATA_STATUS, newStatus.toString())

        if ('value' in target) {
          target.value = newStatus.toString()
        }
        magicSaveDelete(target, data.id)
      }
    }
  }
    const handleEdit = (id: number, formName: string) => {
    setSpecificationInputId(id)
    setOpenForm(formName)
  }


  const getColValues = (title: string) => {
    /*
      Description: Added disabled state to the edit and delete icons,
      Author: Harsithiga B,
      Created: 21-08-2025,
      Modified:
      Classification : Confidential
    */
    return getColumns(title?.toUpperCase(), (params) => (
      <>
        <IconButton
          color={ICON_BUTTON_PROPS.EDIT_COLOR as "primary"}
          onClick={() => handleEdit(params.row.id, specificationTitle)}
          disabled={params.row.status === IN_ACTIVE_STATUS}
        >
          <Edit size={NUMBERMAP.EIGHTEEN} color={ICON_PROPS.COLOR} />
        </IconButton>
        <IconButton
          color={ICON_BUTTON_PROPS.DELETE_COLOR as "error"}
          onClick={(e) => handleDelete(e, params.row)}
          data-sourcename={SPECIFICATION_SCHEMA.EQMS_DIG_SPECIFICATION}
          data-fieldname={SPECIFICATION_SCHEMA.STATUS}
          data-status={params.row.status}
          value={params.row.status}
          disabled={params.row.status === IN_ACTIVE_STATUS}
        >
          <Trash size={NUMBERMAP.EIGHTEEN} color={ICON_PROPS.COLOR} />
        </IconButton>
      </>
    ))
  }

  // Create device columns using the helper function
  const deviceColumns = createDeviceColumns(handleEdit, handleDelete);

  useEffect(() => {
      if (specificationName === DEVICE_COMPATIBILITY) {
        if (domUpdate) {
          readData(keys)
        }
      } else {
        readData(keys)
      }
    }, [domUpdate, specificationName])

  // Default columns that will be shown immediately
  const defaultColumns = getColumns(PERFORMANCE_SPECIFICATION_TITLE.toUpperCase())


  // Create step configuration using the helper function
  const stepConfig = createStepConfiguration(stepList, getColValues);

  const readData = async (keys) => {
    setPhysicalLoading(true)
    
    // Add device keys only if this is for DEVICE_NAME_FORM
    const finalKeys = specificationName === DEVICE_COMPATIBILITY 
      ? {
          ...keys,
          eqms_device_lk: { fk_eqms_project_id: Number(projectID) }
        }
      : keys
    
    // Add orderBy for performance specification
    const orderBy = specificationName === PERFORMANCE_SPECIFICATION_TITLE 
      ? {
          "eqms_dig_specification": {
            "id": "asc"
          }
        }
      : undefined
    
    const result = await magicRead(gridRef.current, finalKeys, undefined, orderBy)
    if (result?.code === SUCCESS_CODE && result?.data) {
      let filteredData = result.data.eqms_dig_specification;
      
      // Restructure data for shelf life specification
      if (specificationName === SPECIFICATION_NAMES.SHELF_LIFE && filteredData) {
        const restructuredData = [];
        filteredData.forEach(item => {
          if (item.eqms_dig_specification_mapper_eqms_dig_specification_mapper_fk_eqms_target_specification_idToeqms_dig_specification) {
            item.eqms_dig_specification_mapper_eqms_dig_specification_mapper_fk_eqms_target_specification_idToeqms_dig_specification.forEach(mapper => {
              restructuredData.push({
                ...item,
                id: mapper.fk_eqms_target_specification_id,
                specification_parameter: mapper.eqms_dig_specification_eqms_dig_specification_mapper_fk_eqms_source_specification_idToeqms_dig_specification?.specification_parameter ?? item.specification_parameter,
                usability_type: item.eqms_usability_type?.usability_type ?? item.usability_type
              });
            });
          } else {
            restructuredData.push(item);
          }
        });
        filteredData = restructuredData;
      }
      
      setPhysicalDataResponse(filteredData)
      const filteredDeviceData = result.data.eqms_device_lk
      setDeviceDataResponse(filteredDeviceData)
    }
    setPhysicalLoading(false)
  }

  return (
    <TableContainer>
      <GlobalLoader loading={loadpage}/>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }} sx={gridSectionStyles}>
          <DIRComponent getCurrentStep={setCurrentStep} steps={stepList} />
        </Grid2>
        {specificationName === SPECIFICATION_NAMES.REGULATIONS && (
          <Grid2 container sx={pageLayerStyles}>
            <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
              {stepList?.length > NUMBERMAP.ZERO && (
                <Label
                  key={JSON.stringify(stepList)}
                  title={
                    stepList.find((step) => step.id === currentStep)?.title ??
                    ''
                  }
                />
              )}
            </Grid2>
            <Grid2 container sx={regulationStyles}>
            <Grid2 size={{md: NUMBERMAP.SIX}}>
              <MultiSelect
                {...FORM_FIELDS_CONFIG.PRODUCT_MARKET}
                options={marketList?.data ?? []}
                value={Array.isArray(projectForm.market) ? projectForm.market : []}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELDS_CONFIG.PRODUCT_MARKET.onChange,
                    value
                  )
                }
                error={
                  Array.isArray(errors.market)
                    ? errors.market.join(', ')
                    : (errors.market ?? '')
                }
              />
            </Grid2>
            <Grid2
              size={{md: NUMBERMAP.SIX}}
            >
              <MultiSelect
                {...FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS}
                options={
                  Array.isArray(projectForm.market) && projectForm.market.length > EMPTY_ARRAY_LENGTH
                    ? (regulationsList?.data ?? [])
                    : []
                }
                value={Array.isArray(projectForm.regulations) ? projectForm.regulations : []}
                onChange={(value) =>
                  handleInputChange(
                    FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS.onChange,
                    value
                  )
                }
                error={
                  Array.isArray(errors.regulations)
                    ? errors.regulations.join(', ')
                    : (errors.regulations ?? '')
                }
                disabled={
                  !Array.isArray(projectForm.market) || projectForm.market.length === EMPTY_ARRAY_LENGTH
                }
              />
            </Grid2>
            </Grid2>

              <Grid2 size={NUMBERMAP.HUNDRED} sx={buttonSectionStyles}>
                <ButtonGroup
                  buttons={[
                    { label: BUTTONS.CANCEL, onClick: handleCancel },
                    { label: BUTTONS.SAVE, onClick: handleSave },
                  ]}
                />
              </Grid2>
          </Grid2>
        )}
      </Grid2>

        {/**
   * Regulations API conditional logic
   * 
   * Author: Harsithiga B
   * Date: 21-08-2025
   * Description: Displaying main specification content using helper function
   * Classification Level: Confidential
   */}
      {renderSpecificationContent({
        specificationName,
        projectID,
        gridRef,
        deviceDataResponse,
        deviceColumns,
        physicalLoading,
        stepList,
        currentStep,
        physicalDataResponse,
        stepConfig,
        defaultColumns,
        openForm,
        specificationInputId,
        specificationTitle,
        currentSpecificationApplicabilityId,
        accessoriesConsumablesApplicabilityId,
        designSpecificationTypeId,
        handleToggle,
        refetch,
        setDomUpdate
      })}
    </TableContainer>
  )
}