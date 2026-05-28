"use client";
import React, { useState } from "react";
import { IconButton, Tooltip, Typography, ClickAwayListener, Box } from "@mui/material";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { PageContainer, tooltipSlotProps, actionsContainerSx, tooltipContentSx, LINK_STYLE } from "@/styles/modules/dnd/prototype";
import { usePrototypeList } from "@/hooks/modules/dnd/usePrototype";
import { useTheme } from '@mui/material/styles';
import { CardEdit } from "iconsax-react";
import { PROTOTYPE_STATUS, ACTION_TYPES, COLUMN_FIELDS, COLUMN_HEADERS, COLUMN_WIDTH, ID_FIELD, TOOLTIP_PLACEMENT, ICON_SIZES, PROTOTYPE_STATUS_CODE, BASE_INDEX, DESIGN_REVIEW_SCREEN, PROTOTYPE_STAGE_ROUTE, PILOT_STAGE_ROUTE } from "@/constants/modules/dnd/prototype";
import { useParams, useRouter } from 'next/navigation';
import { ApiPrototype, PrototypeData } from "@/types/modules/dnd/prototype";
import Link from 'next/link';
import { NUMBERMAP } from "@/constants/common";

const PrototypeList: React.FC<{type:string}> = ({type}) => {
  const params = useParams();
  const projectId = Number(params.id);
  const theme = useTheme();
  const { data: response } = usePrototypeList(Number(projectId),type);
  const rawData = response?.data;
  const router = useRouter();

  const prototypeData: (PrototypeData & { id: string, serialNumber: number })[] = rawData
    ? rawData.map((item: ApiPrototype, index: number) => ({
        id: item.project_stage_order_id.toString(), 
        serialNumber: index + BASE_INDEX, 
        role: item.execution_stage,
        status: item.status === PROTOTYPE_STATUS_CODE.ACTIVE ? PROTOTYPE_STATUS.ACTIVE : PROTOTYPE_STATUS.INACTIVE,
        project_stage_order_id: item.project_stage_order_id, 
      }))
    : [];

  const [tooltipStates, setTooltipStates] = useState<{
    [key: string]: { edit: boolean; delete: boolean };
  }>({});

  const toggleTooltip = (id: string, type: keyof typeof ACTION_TYPES) => {
    setTooltipStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: !(prev[id]?.[type] ?? false),
      },
    }));
  };

  const handleTooltipClick = (projectStageOrderId: number) => {
    const path = DESIGN_REVIEW_SCREEN(projectStageOrderId, projectId);
    router.push(path);
  };

  const handleClickAway = (id: number, type: keyof typeof ACTION_TYPES) => {
    setTooltipStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [type]: false,
      },
    }));
  };

  const columns: GridColDef[] = [
    {
      field: COLUMN_FIELDS.SERIAL_NUMBER, 
      headerName: COLUMN_HEADERS.ID,
      width: COLUMN_WIDTH.ID,
      sortable: false,
    },
    {
      field: COLUMN_FIELDS.ROLE,
      headerName: COLUMN_HEADERS.ROLE,
      width: NUMBERMAP.THREEHUNDRED,
      renderCell: (params) => {
        return(
        <Link
          href={`${type=="Pilot"?PILOT_STAGE_ROUTE:PROTOTYPE_STAGE_ROUTE}${projectId}?project_stage_order_id=${params.row.project_stage_order_id}`}
          style={LINK_STYLE}
        >
          {params.value}
        </Link>
      )
      },
    },
    {
      field: COLUMN_FIELDS.STATUS,
      headerName: COLUMN_HEADERS.STATUS,
      width: COLUMN_WIDTH.STATUS,
      sortable: false,
    },
    {
      field: COLUMN_FIELDS.ACTIONS,
      headerName: COLUMN_HEADERS.ACTIONS,
      width: COLUMN_WIDTH.ACTIONS,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowId = params.row.project_stage_order_id;

        return (
          <Box key={params.id} sx={actionsContainerSx}>
            <ClickAwayListener onClickAway={() => handleClickAway(rowId, ACTION_TYPES.DELETE)}>
              <Tooltip
                title={
                  <Box
                    sx={tooltipContentSx}
                    onClick={() => handleTooltipClick(rowId, ACTION_TYPES.DELETE)}
                  >
                    <Typography>Design Review Report</Typography>
                  </Box>
                }
                placement={TOOLTIP_PLACEMENT.TOP}
                open={tooltipStates[rowId]?.delete ?? false}
                slotProps={tooltipSlotProps}
              >
                <IconButton
                  onClick={() => toggleTooltip(rowId, ACTION_TYPES.DELETE)}
                >
                  <CardEdit size={ICON_SIZES.MEDIUM} color={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          </Box>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <CommonSharedTale
        title={type}
        Table={
          <DataTable
            rows={prototypeData}
            columns={columns}
            IdField={ID_FIELD}
            checkbox={false}
          />
        }
      />
    </PageContainer>
  );
};

export default PrototypeList;