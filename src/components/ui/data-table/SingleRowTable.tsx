"use client";
import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  Paper
} from "@mui/material";
import { NUMBERMAP } from "@/constants/common";
import { CalibrationContainer, HeaderContainer, HeaderContent, HeaderTitle, StyledTableContainer, LabelCell, ValueCell, CustomTypography, TableWith } from "@/styles/components/ui/singleRowTable";
export interface CalibrationField {
    id: string;
    label: string;
    value: string | React.ReactNode;
    type?: 'text' | 'icon' | 'custom';
  }
  
  export interface CalibrationConfigItem {
    field: string;
    label: string;
    type?: 'text' | 'icon' | 'custom';
    render?: (value: any, rowData: any) => React.ReactNode;
  }
  
  export interface CalibrationDetailsProps {
    /** Configurable title for the header section */
    title?: string;
    /** Array of data objects */
    data: Record<string, any>[];
    /** Configuration array defining which fields to display and their labels */
    config: CalibrationConfigItem[];
    /** Maximum width of the component */
    maxWidth?: string;
    /** Custom styling for the component */
    sx?: any;
  }
  
  // Legacy interface for backward compatibility
  export interface CalibrationDetailsLegacyProps {
    title?: string;
    fields: CalibrationField[];
    maxWidth?: string;
    sx?: any;
  }

// Type guard to check if props are legacy format
const isLegacyProps = (props: any): props is CalibrationDetailsLegacyProps => {
  return 'fields' in props && !('data' in props || 'config' in props);
};

const CalibrationDetails: React.FC<CalibrationDetailsProps | CalibrationDetailsLegacyProps> = (props) => {
  const {
    title = "Calibration Details",
    maxWidth = TableWith,
    sx,
  } = props;

  let processedFields: CalibrationField[] = [];

  if (isLegacyProps(props)) {
    // Handle legacy props format
    processedFields = Array.isArray(props.fields) ? props.fields : [];
  } else {
    // Handle new data/config format
    const { data, config } = props;
    const safeData = Array.isArray(data) ? data : [];
    const safeConfig = Array.isArray(config) ? config : [];

    // Process only the first row of data for single row table
    const rowData = safeData[NUMBERMAP.ZERO] ?? {};

    processedFields = safeConfig.map((configItem, index) => {
      const value = rowData[configItem.field];

      return {
        id: `${configItem.field}-${index}`,
        label: configItem.label,
        value: configItem.render
          ? configItem.render(value, rowData)
          : value ?? "N/A",
        type: configItem.type ?? 'text'
      };
    });
  }

  return (
    <CalibrationContainer sx={{ maxWidth, ...sx }}>
      <HeaderContainer>
        <HeaderContent>
          <HeaderTitle>{title}</HeaderTitle>
        </HeaderContent>
      </HeaderContainer>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableBody>
            {processedFields.map((field) => (
              <TableRow key={field.id}>
                <LabelCell>
                  {field.label}
                </LabelCell>
                <ValueCell>
                  {field.type === 'icon' || field.type === 'custom'
                    ? field.value
                    : (
                      <Typography
                        component="span"
                        sx={CustomTypography}
                      >
                        {field.value}
                      </Typography>
                    )
                  }
                </ValueCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </CalibrationContainer>
  );
};

export default CalibrationDetails;
