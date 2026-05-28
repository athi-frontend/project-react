"use client";
import React, { useState, useEffect, useRef } from "react";
import { Grid2, Box, Button } from "@mui/material";
import { RichTextEditor, InputField, DataGridTable, ButtonGroup, Label, ActionButton } from "@/components/ui";
import { GridColDef } from "@mui/x-data-grid";
import { NUMBERMAP } from "@/constants/common";
import { EditorLabelContainer, InputLabel } from '@/styles/components/ui/input';
import { FormContainer, FormWrapper, FormContent } from '@/styles/modules/user/userOnboard';
import { STYLE5, STYLE7 } from "@/styles/modules/hr/candidateEvaluation";
import InfoHover from "@/components/ui/info-hover/InfoHover";
import {
  INFO_TEXT,
  SECTION_TITLES,
  LABELS,
  TABLE_TYPES,
  createFormDataFromApi,
  createMarketingHistoryData,
  createRegulatoryApprovalData,
  createMarketClearanceData,
  createAdverseEventData,
  createFscaData,
  getEmptyFormData
} from '@/constants/modules/regulation/executiveSummary';
import AnnexureDropdown from "@/components/modules/regulation/annexure-dropdown/AnnexureDropdown";
import AddIcon from '@mui/icons-material/Add';
import { ICON_SIZE } from '@/styles/common'
import { BoxContainer, DurationContainer, DurationTypography, EventContainer, GridColumn, GridFourColumn, GridSecondColumn, GridThirdColumn, LabelContainer, FLEX_ROW } from "@/styles/modules/regulation/executiveSummary";
import SubHeader from "@/components/modules/regulation/executive-summary/SubHeader";
import { ButtonContainer } from "@/styles/components/ui/button";
import { COMMON_CONSTANTS, numberValidation } from '@/lib/utils/common';

/**
    Classification : Confidential
**/
const { DELETE_ALERT } = COMMON_CONSTANTS;
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert';
import MarketingHistoryModal from "@/components/modules/regulation/executive-summary/MarketingHistoryModal";
import RegulatoryModal from "@/components/modules/regulation/executive-summary/RegulatoryModal";
import StatusOfMarketClearanceModal from "@/components/modules/regulation/executive-summary/StatusOfMarketClearanceModal";
import AdverseEventModal from "@/components/modules/regulation/executive-summary/AdverseEventModal";
import FscaModal from "@/components/modules/regulation/executive-summary/FscaModal";
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUserId } from '@/store/slices/menuSlice';
import { useFetchAgencies, useFetchCountries, useFetchExecutiveSummary, usePostExecutiveSummary } from '@/hooks/modules/regulation/useExecutiveSummary';
import { useDraftSave } from '@/hooks/common/useDraftSave';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';
import { Value } from "@/styles/components/modules/projectInfo";
import {
  MarketingHistoryData,
  RegulatoryApprovalData,
  MarketClearanceData,
  AdverseEventData,
  FSCAData,
  FormData,
  ExecutiveSummaryData,
} from '@/types/modules/regulation/executiveSummary';
import { ZERO } from "@/constants/modules/dnd/productLifeDeclaration";
import { ClinicalEvidence, RegulatoryStatus, RiskManagement, SterilizationDevice } from "@/components/modules/regulation/executive-summary/ExecutiveInfos";

type SaveType = 'draft' | 'final';

const ExecutiveSummaryForm: React.FC = () => {
  const params = useParams();
  const projectId = Number(params.id);
  const userId = useSelector(selectUserId);

  const { data: executiveSummaryData, refetch: refetchExecutiveSummary } = useFetchExecutiveSummary(projectId, false);
  const { mutate: submitExecutiveSummary, isPending } = usePostExecutiveSummary();
  const { data: agencyOptions = [] } = useFetchAgencies();
  const { data: countryOptions = [] } = useFetchCountries();


  const { draftSave, clearDraftSave, isDraftSaving } = useDraftSave();

  const [marketingModal, setMarketingModal] = useState(false);
  const [regulatoryModal, setRegulatoryModal] = useState(false);
  const [statusOfMarketClearanceModal, setStatusOfMarketClearanceModal] = useState(false);
  const [adverseEventModal, setAdverseEventModal] = useState(false);
  const [fscaModal, setFscaModal] = useState(false);

  const [formData, setFormData] = useState<FormData>(getEmptyFormData());
  const isInitialDataLoad = useRef(true);

  // Trigger API call on component mount
  useEffect(() => {
    refetchExecutiveSummary();
  }, [refetchExecutiveSummary]);

  // State for table data
  const [marketingHistoryTableData, setMarketingHistoryTableData] = useState<MarketingHistoryData[]>([]);
  const [regulatoryApprovalTableData, setRegulatoryApprovalTableData] = useState<RegulatoryApprovalData[]>([]);
  const [marketClearanceTableData, setMarketClearanceTableData] = useState<MarketClearanceData[]>([]);
  const [adverseEventTableData, setAdverseEventTableData] = useState<AdverseEventData[]>([]);
  const [fscaTableData, setFscaTableData] = useState<FSCAData[]>([]);


  const handleTableUpdate = (data) => {
    // Update table data from API response using utility functions
    if (data.marketing_device_launch) {
      setMarketingHistoryTableData(createMarketingHistoryData(data.marketing_device_launch));
    }

    if (data.regulatory_approval) {
      setRegulatoryApprovalTableData(createRegulatoryApprovalData(data.regulatory_approval));
    }

    if (data.market_clearance) {
      setMarketClearanceTableData(createMarketClearanceData(data.market_clearance));
    }

    if (data.adverse_events) {
      setAdverseEventTableData(createAdverseEventData(data.adverse_events));
    }

    if (data.safety_correction) {
      setFscaTableData(createFscaData(data.safety_correction));
    }
  }
  // Prefill form data when API data is loaded
  useEffect(() => {
    if (executiveSummaryData?.data) {
      if ((executiveSummaryData.data.length > NUMBERMAP.ZERO)) {
        const data = executiveSummaryData.data[NUMBERMAP.ZERO];
        // Update form data using utility function
        setFormData(createFormDataFromApi(data));
        handleTableUpdate(data)
      }
      setTimeout(() => {
        isInitialDataLoad.current = false;
      }, NUMBERMAP.THOUSAND)
    }
  }, [executiveSummaryData]);

  // State for editing rows
  const [editingRow, setEditingRow] = useState<{ tableType: string; row: any } | null>(null);

  const handleEdit = (row: any, tableType: string) => {
    setEditingRow({ tableType, row });
    // Open the appropriate modal based on table type
    switch (tableType) {
      case TABLE_TYPES.MARKETING:
        setMarketingModal(true);
        break;
      case TABLE_TYPES.REGULATORY:
        setRegulatoryModal(true);
        break;
      case TABLE_TYPES.CLEARANCE:
        setStatusOfMarketClearanceModal(true);
        break;
      case TABLE_TYPES.ADVERSE:
        setAdverseEventModal(true);
        break;
      case TABLE_TYPES.FSCA:
        setFscaModal(true);
        break;
    }
  };

  const deleteTableRow = (id: string, tableType: string) => {
    switch (tableType) {
      case TABLE_TYPES.MARKETING:
        setMarketingHistoryTableData(prev => prev.filter(item => item.id !== id));
        break;
      case TABLE_TYPES.REGULATORY:
        setRegulatoryApprovalTableData(prev => prev.filter(item => item.id !== id));
        break;
      case TABLE_TYPES.CLEARANCE:
        setMarketClearanceTableData(prev => prev.filter(item => item.id !== id));
        break;
      case TABLE_TYPES.ADVERSE:
        setAdverseEventTableData(prev => prev.filter(item => item.id !== id));
        break;
      case TABLE_TYPES.FSCA:
        setFscaTableData(prev => prev.filter(item => item.id !== id));
        break;
    }
  };

  const handleDelete = (id: string, tableType: string) => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        deleteTableRow(id, tableType);
      }
    });
  };

  const handleAddRow = (tableType: string) => {
    setEditingRow(null); // Clear any editing state
    switch (tableType) {
      case TABLE_TYPES.MARKETING:
        setMarketingModal(true);
        break;
      case TABLE_TYPES.REGULATORY:
        setRegulatoryModal(true);
        break;
      case TABLE_TYPES.CLEARANCE:
        setStatusOfMarketClearanceModal(true);
        break;
      case TABLE_TYPES.ADVERSE:
        setAdverseEventModal(true);
        break;
      case TABLE_TYPES.FSCA:
        setFscaModal(true);
        break;
    }
  };

  const saveMarketingHistoryRow = (data: any, newId: string) => {
    if (editingRow && editingRow.tableType === TABLE_TYPES.MARKETING) {
      setMarketingHistoryTableData(prev =>
        prev.map(item =>
          item.id === editingRow.row.id
            ? {
              id: editingRow.row.id,
              sno: editingRow.row.sno,
              year: data.year,
              qtyMarketed: data.quantity
            }
            : item
        )
      );
    } else {
      const newRow = {
        id: newId,
        sno: (marketingHistoryTableData.length + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, ZERO),
        year: data.year,
        qtyMarketed: data.quantity
      };
      setMarketingHistoryTableData(prev => [...prev, newRow]);
    }
    setMarketingModal(false);
  };

  const saveRegulatoryRow = (data: any, newId: string) => {
    if (editingRow && editingRow.tableType === TABLE_TYPES.REGULATORY) {
      setRegulatoryApprovalTableData(prev =>
        prev.map(item =>
          item.id === editingRow.row.id
            ? {
              id: editingRow.row.id,
              sno: editingRow.row.sno,
              approvedIndication: data.approvedIndication,
              approvedShelfLife: data.approvedShelfLife,
              classOfDevice: data.classOfDevice,
              dateOfFirstApproval: data.date,
              country_id: data.country ?? data.country_id ?? NUMBERMAP.ZERO,
            }
            : item
        )
      );
    } else {
      const newRow = {
        id: newId,
        sno: (regulatoryApprovalTableData.length + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, ZERO),
        approvedIndication: data.approvedIndication,
        approvedShelfLife: data.approvedShelfLife,
        classOfDevice: data.classOfDevice,
        dateOfFirstApproval: data.date,
        country_id: data.country ?? data.country_id ?? NUMBERMAP.ZERO,
      };
      setRegulatoryApprovalTableData(prev => [...prev, newRow]);
    }
    setRegulatoryModal(false);
  };

  const saveMarketClearanceRow = (data: any, newId: string) => {
    if (editingRow && editingRow.tableType === TABLE_TYPES.CLEARANCE) {
      setMarketClearanceTableData(prev =>
        prev.map(item =>
          item.id === editingRow.row.id
            ? {
              id: editingRow.row.id,
              sno: editingRow.row.sno,
              regulatoryAgency: data.regulatoryAgency,
              regulatoryAgencyId: data.regulatoryAgencyId,
              indicationForUse: data.indicationForUse,
              registrationStatus: data.registrationStatus,
              date: data.date
            }
            : item
        )
      );
    } else {
      const newRow = {
        id: newId,
        sno: (marketClearanceTableData.length + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, ZERO),
        regulatoryAgency: data.regulatoryAgency,
        regulatoryAgencyId: data.regulatoryAgencyId,
        indicationForUse: data.indicationForUse,
        registrationStatus: data.registrationStatus,
        date: data.date
      };
      setMarketClearanceTableData(prev => [...prev, newRow]);
    }
    setStatusOfMarketClearanceModal(false);
  };

  const saveAdverseEventRow = (data: any, newId: string) => {
    if (editingRow && editingRow.tableType === TABLE_TYPES.ADVERSE) {
      setAdverseEventTableData(prev =>
        prev.map(item =>
          item.id === editingRow.row.id
            ? {
              id: editingRow.row.id,
              sno: editingRow.row.sno,
              seriousAdverseEvent: data.seriousAdverseEvent,
              durationFrom: data.startDate,
              durationTo: data.endDate,
              numberOfSAE: data.numberOfSAE,
              totalUnitsSold: data.totalUnitsSold
            }
            : item
        )
      );
    } else {
      const newRow = {
        id: newId,
        sno: (adverseEventTableData.length + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, ZERO),
        seriousAdverseEvent: data.seriousAdverseEvent,
        durationFrom: data.startDate,
        durationTo: data.endDate,
        numberOfSAE: data.numberOfSAE,
        totalUnitsSold: data.totalUnitsSold
      };
      setAdverseEventTableData(prev => [...prev, newRow]);
    }
    setAdverseEventModal(false);
  };

  const saveFscaRow = (data: any, newId: string) => {
    // Handle countries data from modal (array of objects with id and country_name)
    let countriesIds: number[] = [];
    let countriesDisplay = "";

    if (Array.isArray(data.countries) && data.countries.length > NUMBERMAP.ZERO) {
      countriesIds = data.countries.map((country: any) => country.id);
      countriesDisplay = data.countries.map((country: any) => country.country_name).join(', ');
    }

    if (editingRow && editingRow.tableType === TABLE_TYPES.FSCA) {
      setFscaTableData(prev =>
        prev.map(item =>
          item.id === editingRow.row.id
            ? {
              id: editingRow.row.id,
              sno: editingRow.row.sno,
              dateOfFSCA: data.date,
              reasonForFSCA: data.reasonForFsca,
              countriesWhereFSCA: countriesDisplay,
              countriesIds: countriesIds,
              descriptionOfAction: data.actionDescription
            }
            : item
        )
      );
    } else {
      const newRow = {
        id: newId,
        sno: (fscaTableData.length + NUMBERMAP.ONE).toString().padStart(NUMBERMAP.TWO, ZERO),
        dateOfFSCA: data.date,
        reasonForFSCA: data.reasonForFsca,
        countriesWhereFSCA: countriesDisplay,
        countriesIds: countriesIds,
        descriptionOfAction: data.actionDescription
      };
      setFscaTableData(prev => [...prev, newRow]);
    }
    setFscaModal(false);
  };

  const handleSaveRow = (data: any, tableType: string) => {
    const newId = Date.now().toString();

    switch (tableType) {
      case TABLE_TYPES.MARKETING:
        saveMarketingHistoryRow(data, newId);
        break;
      case TABLE_TYPES.REGULATORY:
        saveRegulatoryRow(data, newId);
        break;
      case TABLE_TYPES.CLEARANCE:
        saveMarketClearanceRow(data, newId);
        break;
      case TABLE_TYPES.ADVERSE:
        saveAdverseEventRow(data, newId);
        break;
      case TABLE_TYPES.FSCA:
        saveFscaRow(data, newId);
        break;
    }
    setEditingRow(null);
  };

  useEffect(() => {
    if (!isInitialDataLoad.current) {
      handleSave('draft', null);
    }
  }, [marketingHistoryTableData, regulatoryApprovalTableData, marketClearanceTableData, adverseEventTableData, fscaTableData]);
  const handleSave = (type: SaveType, nextData: FormData) => {
    const loadData = nextData ?? formData
    const submitData: ExecutiveSummaryData = {
      project_id: projectId,
      project_description: loadData.introductoryInfo,
      intended_use: loadData.intendedUse,
      indications_of_use: loadData.indicationsForUse,
      class_of_device: loadData.classOfDevice,
      novel_feature: loadData.novelFeatures,
      sterilization_information: loadData.sterilizationInfo,
      regualtory_status: loadData.regulatoryStatus,
      clinical_evalution: loadData.clinicalEvidence,
      risk_management_control: loadData.riskManagement,
      declaration_conformity: loadData.declarationOfConformity,
      device_domestic_price: loadData.domesticPrice,
      non_viable_cell_tissue_derivative: loadData.animalHumanCells,
      microbal_recombinent_origin_material: loadData.microbialRecombinant,
      irradiating_component_type: loadData.irradiatingComponents,
      shelf_life: loadData.shelfLife,
      marketing_device_launch: marketingHistoryTableData.map(item => ({
        year: item.year,
        quantity: item.qtyMarketed
      })),
      regulatory_approval: regulatoryApprovalTableData.map(item => ({
        country_id: parseInt(item.country_id?.toString() ?? String(NUMBERMAP.ZERO), NUMBERMAP.TEN),
        approval_indication: item.approvedIndication,
        approved_shelf_life: item.approvedShelfLife,
        device_class: item.classOfDevice,
        approved_date: item.dateOfFirstApproval
      })),
      market_clearance: marketClearanceTableData.map(item => ({
        regulatory_agency_id: parseInt(item.regulatoryAgencyId ?? item.regulatoryAgency, NUMBERMAP.TEN) ?? NUMBERMAP.ZERO,
        indication_use: item.indicationForUse,
        registration_status: item.registrationStatus,
        clearance_date: item.date
      })),
      adverse_events: adverseEventTableData.map(item => ({
        serious_adverse_event: item.seriousAdverseEvent,
        start_date: item.durationFrom,
        end_date: item.durationTo,
        sae_reported_count: parseInt(item.numberOfSAE) ?? NUMBERMAP.ZERO,
        total_unit_sold: parseInt(item.totalUnitsSold) ?? NUMBERMAP.ZERO
      })),
      safety_correction: fscaTableData.map(item => {
        let countries: number[] = [];

        if (item.countriesIds && item.countriesIds.length > NUMBERMAP.ZERO) {
          // Handle both array of numbers and array of objects
          if (typeof item.countriesIds[NUMBERMAP.ZERO] === 'object' && item.countriesIds[NUMBERMAP.ZERO].id) {
            // If it's array of objects with id property, extract just the ids
            countries = item.countriesIds.map((country: any) => country.id);
          } else {
            // If it's already array of numbers
            countries = item.countriesIds;
          }
        } else if (item.countriesWhereFSCA) {
          countries = item.countriesWhereFSCA
            .split(',')
            .map((c: string) => parseInt(c.trim()))
            .filter((c: number) => !isNaN(c));
        }

        return {
          fsca_reason: item.reasonForFSCA,
          countries: countries,
          reason_action: item.descriptionOfAction,
          fsca_date: item.dateOfFSCA
        };
      }),
      created_by: userId ?? NUMBERMAP.ZERO
    };

    if (type === 'draft') {
      draftSave({
        project_id: projectId,
        form_type: 'executive_summary',
        form_data: submitData,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    clearDraftSave();
    submitExecutiveSummary(submitData);
  };

  const resetFormData = (data?: any) => {
    if (data) {
      setFormData(createFormDataFromApi(data));
    } else {
      setFormData(getEmptyFormData());
    }
  };

  const resetMarketingHistoryData = (data?: any) => {
    if (data?.marketing_device_launch) {
      setMarketingHistoryTableData(createMarketingHistoryData(data.marketing_device_launch));
    } else {
      setMarketingHistoryTableData([]);
    }
  };

  const resetRegulatoryData = (data?: any) => {
    if (data?.regulatory_approval) {
      setRegulatoryApprovalTableData(createRegulatoryApprovalData(data.regulatory_approval));
    } else {
      setRegulatoryApprovalTableData([]);
    }
  };

  const resetMarketClearanceData = (data?: any) => {
    if (data?.market_clearance) {
      setMarketClearanceTableData(createMarketClearanceData(data.market_clearance));
    } else {
      setMarketClearanceTableData([]);
    }
  };

  const resetAdverseEventData = (data?: any) => {
    if (data?.adverse_events) {
      setAdverseEventTableData(createAdverseEventData(data.adverse_events));
    } else {
      setAdverseEventTableData([]);
    }
  };

  const resetFscaData = (data?: any) => {
    if (data?.safety_correction) {
      setFscaTableData(createFscaData(data.safety_correction));
    } else {
      setFscaTableData([]);
    }
  };

  const resetAllTableData = () => {
    setMarketingHistoryTableData([]);
    setRegulatoryApprovalTableData([]);
    setMarketClearanceTableData([]);
    setAdverseEventTableData([]);
    setFscaTableData([]);
  };

  const handleCancel = () => {
    if (executiveSummaryData?.data && executiveSummaryData.data.length > NUMBERMAP.ZERO) {
      const data = executiveSummaryData.data[NUMBERMAP.ZERO];
      resetFormData(data);
      resetMarketingHistoryData(data);
      resetRegulatoryData(data);
      resetMarketClearanceData(data);
      resetAdverseEventData(data);
      resetFscaData(data);
    } else {
      resetFormData();
      resetAllTableData();
    }
  };
  const shelfLifeColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: "parameter", headerName: "Parameter", flex: NUMBERMAP.TWO },
    { field: "specification", headerName: "Specification", flex: NUMBERMAP.TWO },
  ];
  const marketingHistoryColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: "year", headerName: LABELS.YEAR, flex: NUMBERMAP.ONE },
    { field: "qtyMarketed", headerName: LABELS.QTY_MARKETED_NOS, flex: NUMBERMAP.TWO },
    {
      field: "actions",
      headerName: LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, TABLE_TYPES.MARKETING)} onDelete={() => handleDelete(params.id.toString(), TABLE_TYPES.MARKETING)} />
      ),
    },
  ];
  const regulatoryApprovalColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: "approvedIndication", headerName: LABELS.APPROVED_INDICATION, flex: NUMBERMAP.TWO },
    { field: "approvedShelfLife", headerName: LABELS.APPROVED_SHELF_LIFE, flex: NUMBERMAP.TWO },
    { field: "classOfDevice", headerName: LABELS.CLASS_OF_DEVICE_TABLE, flex: NUMBERMAP.TWO },
    { field: "dateOfFirstApproval", headerName: LABELS.DATE_OF_FIRST_APPROVAL, flex: NUMBERMAP.TWO },
    {
      field: "actions",
      headerName: LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, TABLE_TYPES.REGULATORY)} onDelete={() => handleDelete(params.id.toString(), TABLE_TYPES.REGULATORY)} />
      ),
    },
  ];
  const marketClearanceColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.HALF },
    {
      field: "regulatoryAgency", headerName: LABELS.REGULATORY_AGENCY_COUNTRY, flex: NUMBERMAP.TWO, renderCell: (params) => {
        if (agencyOptions.length > NUMBERMAP.ZERO) {
          const regulatoryAgency = agencyOptions.find((agency) => agency.id == params.row?.regulatory_agency_id || agency.id == params.row?.regulatoryAgencyId)
          if (regulatoryAgency) {
            return regulatoryAgency?.agency_name ?? '-'
          } else {
            return params.value
          }
        } else {
          return params.value
        }
      }
    },
    { field: "indicationForUse", headerName: LABELS.INDICATION_FOR_USE, flex: NUMBERMAP.ONE_HALF },
    { field: "registrationStatus", headerName: LABELS.REGISTRATION_STATUS, flex: NUMBERMAP.ONE_HALF },
    { field: "date", headerName: LABELS.DATE, flex: NUMBERMAP.ONE },
    {
      field: "actions",
      headerName: LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, TABLE_TYPES.CLEARANCE)} onDelete={() => handleDelete(params.id.toString(), TABLE_TYPES.CLEARANCE)} />
      ),
    },
  ];
  const adverseEventColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: "seriousAdverseEvent", headerName: LABELS.SERIOUS_ADVERSE_EVENT_SAE, flex: NUMBERMAP.TWO },
    {
      field: "duration",
      flex: NUMBERMAP.THREE,
      headerAlign: 'center',
      align: 'center',
      renderHeader: () => (
        <Grid2>
          <Grid2 sx={DurationTypography}>{LABELS.DURATION}</Grid2>
          <Grid2 sx={DurationContainer}>
            <Grid2>{LABELS.FROM}</Grid2>
            <Grid2>{LABELS.TO}</Grid2>
          </Grid2>
        </Grid2>
      ),
      renderCell: (params) => (
        <Grid2 sx={EventContainer}>
          <Grid2 sx={LabelContainer}>{params.row.durationFrom}</Grid2>
          <Grid2 sx={LabelContainer}>{params.row.durationTo}</Grid2>
        </Grid2>
      ),
    },


    { field: "numberOfSAE", headerName: LABELS.NUMBER_SAE_REPORTED, flex: NUMBERMAP.TWO },
    { field: "totalUnitsSold", headerName: LABELS.TOTAL_UNITS_SOLD, flex: NUMBERMAP.TWO },
    {
      field: "actions",
      headerName: LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, TABLE_TYPES.ADVERSE)} onDelete={() => handleDelete(params.id.toString(), TABLE_TYPES.ADVERSE)} />
      ),
    },
  ];
  const fscaColumns: GridColDef[] = [
    { field: "sno", headerName: LABELS.S_NO, flex: NUMBERMAP.ONE },
    { field: "dateOfFSCA", headerName: LABELS.DATE_OF_FSCA, flex: NUMBERMAP.TWO },
    { field: "reasonForFSCA", headerName: LABELS.REASON_FOR_FSCA, flex: NUMBERMAP.TWO },
    {
      field: "countriesWhereFSCA", headerName: LABELS.COUNTRIES_FSCA_CONDUCTED, flex: NUMBERMAP.TWO, renderCell: (params) => {
        if (countryOptions.length > NUMBERMAP.ZERO) {
          let countryData = null
          if (params.row?.countriesIds && params.row.countriesIds.length > NUMBERMAP.ZERO) {
            countryData = countryOptions.find((country) => country.id == params.row.countriesIds[NUMBERMAP.ZERO])
          } else {
            countryData = countryOptions.find((country) => country.id == params.row?.country_id)

          }
          if (countryData) {
            return countryData?.country_name ?? '-'
          } else {
            return params.value
          }
        } else {
          return params.value
        }
      }
    },
    { field: "descriptionOfAction", headerName: LABELS.DESCRIPTION_ACTION_TAKEN, flex: NUMBERMAP.THREE },
    {
      field: "actions",
      headerName: LABELS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params) => (
        <ActionButton onEdit={() => handleEdit(params.row, TABLE_TYPES.FSCA)} onDelete={() => handleDelete(params.id.toString(), TABLE_TYPES.FSCA)} />
      ),
    },
  ];
  const buttonConfig = [
    { label: LABELS.CANCEL, onClick: handleCancel, disabled: isPending },
    { label: LABELS.SAVE, onClick: () => handleSave('final'), disabled: isPending, loading: isPending }
  ];
  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <FormWrapper>
        <Label title={LABELS.EXECUTIVE_SUMMARY} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Box sx={FLEX_ROW}>
                <InputLabel>{LABELS.INTRO_INFO}</InputLabel><InfoHover infoText={INFO_TEXT.INTRODUCTORY_INFORMATION} />
              </Box>
              <Value variant="body1">{formData.introductoryInfo?.trim() ? formData.introductoryInfo : LABELS.DASH}</Value>
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Box sx={FLEX_ROW}>
                <InputLabel>{LABELS.INTENDED_USE}</InputLabel><InfoHover infoText={INFO_TEXT.INTENDED_USE} />
              </Box>
              <Value variant="body1">{formData.intendedUse?.trim() ? formData.intendedUse : LABELS.DASH}</Value>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Box sx={FLEX_ROW}>
                <InputLabel>{LABELS.INDICATIONS_FOR_USE}</InputLabel><InfoHover infoText={INFO_TEXT.INDICATIONS_FOR_USE} />
              </Box>
              <Value variant="body1">{formData.indicationsForUse?.trim() ? formData.indicationsForUse : LABELS.DASH}</Value>

            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <Box sx={FLEX_ROW}>

                <InputLabel>{LABELS.CLASS_OF_DEVICE}</InputLabel><InfoHover infoText={INFO_TEXT.CLASS_OF_DEVICE} />
              </Box>
              <Value variant="body1">{formData.classOfDevice?.trim() ? formData.classOfDevice : LABELS.DASH}</Value>
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELS.NOVEL_FEATURES}
                value={formData.novelFeatures}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, novelFeatures: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
                infoText={INFO_TEXT.NOVEL_FEATURES}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <EditorLabelContainer>
                <InputLabel>{LABELS.SHELF_LIFE}</InputLabel>
                <InfoHover infoText={INFO_TEXT.SHELF_LIFE} />
              </EditorLabelContainer>
              <DataGridTable
                showAddButton
                rows={formData.shelfLife}
                columns={shelfLifeColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELS.STERILIZATION_INFO}
                value={formData.sterilizationInfo}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, sterilizationInfo: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
                infoText={<SterilizationDevice />}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={LABELS.REGULATORY_STATUS}
                value={formData.regulatoryStatus}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, regulatoryStatus: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
                infoText={<RegulatoryStatus />}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5} alignItems="flex-start">
            <Grid2
              size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
              sx={GridColumn}
            >
              <RichTextEditor
                label={LABELS.CLINICAL_EVIDENCE}
                value={formData.clinicalEvidence}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, clinicalEvidence: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
                infoText={<ClinicalEvidence />}
              />
            </Grid2>

            <Grid2
              size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}
              sx={GridSecondColumn}
            >
              <RichTextEditor
                label={LABELS.RISK_MANAGEMENT}
                value={formData.riskManagement}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, riskManagement: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
                infoText={<RiskManagement />}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <AnnexureDropdown
                items={[]}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <AnnexureDropdown
                items={[]}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={GridColumn}>
              <RichTextEditor
                label={LABELS.DECLARATION_OF_CONFORMITY}
                value={formData.declarationOfConformity}
                onChange={(value) => setFormData(prev => { const updated = { ...prev, declarationOfConformity: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
                placeholder={LABELS.INPUT_TEXT}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={GridFourColumn}>
              <InputField
                label={LABELS.DOMESTIC_PRICE}
                placeholder={LABELS.PLACEHOLDER_DOMESTIC_PRICE}
                value={formData.domesticPrice}
                onChange={(value: any) => {
                  // Apply number validation for domestic price
                  if (value && !numberValidation.test(value)) {
                    return; // Don't update if not a valid number
                  }
                  setFormData(prev => { const updated = { ...prev, domesticPrice: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; });
                }}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{LABELS.MARKETING_HISTORY_DEVICE}</InputLabel>
                <Button variant="outlined" onClick={() => handleAddRow(TABLE_TYPES.MARKETING)}>
                  <AddIcon sx={ICON_SIZE} />
                  {LABELS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={marketingHistoryTableData}
                columns={marketingHistoryColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{LABELS.LIST_REGULATORY_APPROVALS}</InputLabel>
                <Button variant="outlined" onClick={() => handleAddRow(TABLE_TYPES.REGULATORY)}>
                  <AddIcon sx={ICON_SIZE} />
                  {LABELS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={regulatoryApprovalTableData}
                columns={regulatoryApprovalColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{LABELS.STATUS_MARKET_CLEARANCE}</InputLabel>
                <Button variant="outlined" onClick={() => handleAddRow(TABLE_TYPES.CLEARANCE)}>
                  <AddIcon sx={ICON_SIZE} />
                  {LABELS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={marketClearanceTableData}
                columns={marketClearanceColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={SECTION_TITLES.SAFETY_PERFORMANCE} />
              <Box sx={STYLE7}>
                <SubHeader title={SECTION_TITLES.SUMMARY_REPORTABLE} />
              </Box>
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{LABELS.FOR_SERIOUS_ADVERSE_EVENT}</InputLabel>
                <Button variant="outlined" onClick={() => handleAddRow(TABLE_TYPES.ADVERSE)}>
                  <AddIcon sx={ICON_SIZE} />
                  {LABELS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={adverseEventTableData}
                columns={adverseEventColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box sx={BoxContainer}>
                <InputLabel>{LABELS.FOR_FIELD_SAFETY_CORRECTIVE_ACTION}</InputLabel>
                <Button variant="outlined" onClick={() => handleAddRow(TABLE_TYPES.FSCA)}>
                  <AddIcon sx={ICON_SIZE} />
                  {LABELS.ADD_NEW}
                </Button>
              </Box>
              <DataGridTable
                showAddButton
                rows={fscaTableData}
                columns={fscaColumns}
                idField="id"
                hideFooter={true}
                checkboxSelection={false}
              />
            </Grid2>
          </Grid2>
          <Grid2 container sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <SubHeader title={LABELS.DEVICE_CONTAINS_FOLLOWING} />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={GridColumn}>
              <InputField
                label={LABELS.ANIMAL_HUMAN_CELLS}
                placeholder={LABELS.PLACEHOLDER_ANIMAL_HUMAN_CELLS}
                value={formData.animalHumanCells}
                onChange={(value: any) => setFormData(prev => { const updated = { ...prev, animalHumanCells: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }} sx={GridThirdColumn}>
              <InputField
                label={LABELS.MICROBIAL_RECOMBINANT}
                placeholder={LABELS.PLACEHOLDER_MICROBIAL_RECOMBINANT}
                value={formData.microbialRecombinant}
                onChange={(value: any) => setFormData(prev => { const updated = { ...prev, microbialRecombinant: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={LABELS.IRRADIATING_COMPONENTS}
                placeholder={LABELS.PLACEHOLDER_IRRADIATING_COMPONENTS}
                value={formData.irradiatingComponents}
                onChange={(value: any) => setFormData(prev => { const updated = { ...prev, irradiatingComponents: value }; if (!isInitialDataLoad.current) { handleSave('draft', updated); } return updated; })}
              />
            </Grid2>
          </Grid2>
          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>

      <MarketingHistoryModal
        onClose={() => setMarketingModal(false)}
        open={marketingModal}
        onSave={(data) => handleSaveRow(data, TABLE_TYPES.MARKETING)}
        initialData={editingRow?.tableType === TABLE_TYPES.MARKETING ? {
          year: editingRow.row.year,
          quantity: editingRow.row.qtyMarketed
        } : undefined}
      />
      <RegulatoryModal
        onClose={() => setRegulatoryModal(false)}
        open={regulatoryModal}
        onSave={(data) => handleSaveRow(data, TABLE_TYPES.REGULATORY)}
        initialData={editingRow?.tableType === TABLE_TYPES.REGULATORY ? {
          country: editingRow.row.country_id?.toString() ?? '',
          approvedIndication: editingRow.row.approvedIndication,
          approvedShelfLife: editingRow.row.approvedShelfLife,
          classOfDevice: editingRow.row.classOfDevice,
          date: editingRow.row.dateOfFirstApproval
        } : undefined}
      />
      <StatusOfMarketClearanceModal
        onClose={() => setStatusOfMarketClearanceModal(false)}
        open={statusOfMarketClearanceModal}
        onSave={(data) => handleSaveRow(data, TABLE_TYPES.CLEARANCE)}
        initialData={editingRow?.tableType === TABLE_TYPES.CLEARANCE ? {
          regulatoryAgency: editingRow.row.regulatoryAgency,
          regulatoryAgencyId: editingRow.row.regulatoryAgencyId ?? editingRow.row.regulatoryAgency,
          indicationForUse: editingRow.row.indicationForUse,
          registrationStatus: editingRow.row.registrationStatus,
          date: editingRow.row.date
        } : undefined}
      />
      <AdverseEventModal
        onClose={() => setAdverseEventModal(false)}
        open={adverseEventModal}
        onSave={(data) => handleSaveRow(data, TABLE_TYPES.ADVERSE)}
        initialData={editingRow?.tableType === TABLE_TYPES.ADVERSE ? {
          seriousAdverseEvent: editingRow.row.seriousAdverseEvent,
          startDate: editingRow.row.durationFrom,
          endDate: editingRow.row.durationTo,
          numberOfSAE: editingRow.row.numberOfSAE,
          totalUnitsSold: editingRow.row.totalUnitsSold
        } : undefined}
      />
      <FscaModal
        onClose={() => setFscaModal(false)}
        open={fscaModal}
        onSave={(data) => handleSaveRow(data, TABLE_TYPES.FSCA)}
        initialData={editingRow?.tableType === TABLE_TYPES.FSCA ? {
          date: editingRow.row.dateOfFSCA,
          reasonForFsca: editingRow.row.reasonForFSCA,
          countries: editingRow.row.countriesIds && editingRow.row.countriesIds.length > NUMBERMAP.ZERO ?
            editingRow.row.countriesIds : [],
          actionDescription: editingRow.row.descriptionOfAction
        } : undefined}
      />
    </FormContainer>
  );
};
export default ExecutiveSummaryForm;
