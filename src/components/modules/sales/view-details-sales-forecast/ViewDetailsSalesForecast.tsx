"use client";
import React, { useMemo } from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataGridTable, ButtonGroup } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { Grid2 } from "@mui/material";
import InfoField from "@/components/modules/dnd/project-info/InfoField";
import { TableContainer } from "@/styles/components/ui/datatable";
import { FORECASTDETAILS, BUTTON_LABELS_FORM } from "@/constants/modules/sales/forecastDetails";
import { useGetForecastByProduct } from "@/hooks/modules/sales/useForecastDetails";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import { ForcastDetails, DateParamsType } from "@/types/modules/sales/forecastDetails";
import { ButtonContainer } from "@/styles/components/ui/button";

/**
*Classification : Confidential
**/

interface ViewDetailsSalesForecastProps {
    product_id: number;
    dateParams: DateParamsType;
    onBack: () => void;
}

const ViewDetailsSalesForecast: React.FC<ViewDetailsSalesForecastProps> = ({ product_id, dateParams, onBack }) => {
    //fetch query hooks
    const { data: ProductForecastData, isLoading } = useGetForecastByProduct(product_id, dateParams);

    // Process forecast data
    const forecastData = useMemo(() => {
        if (!ProductForecastData?.data?.[NUMBERMAP.ZERO]?.next_forecast_details) return [];
        return ProductForecastData.data[NUMBERMAP.ZERO].next_forecast_details.map((forecast: ForcastDetails, index: number) => ({
            ...forecast,
            sno: index + NUMBERMAP.ONE,
        }));
    }, [ProductForecastData]);

    // Column definitions for the table
    const columns = [
        {
            field: FORECASTDETAILS.TABLE_FIELDS.SNO,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.S_NO,
            flex: NUMBERMAP.HALF,
        },
        {
            field: FORECASTDETAILS.TABLE_FIELDS.MODEL_NUMBER,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.MODEL_NO,
            flex: NUMBERMAP.ONE,
        },
        {
            field: FORECASTDETAILS.TABLE_FIELDS.MODEL_NAME,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.MODEL_NAME,
            flex: NUMBERMAP.ONE,
        },
        {
            field: FORECASTDETAILS.TABLE_FIELDS.MONTH,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.MONTH,
            flex: NUMBERMAP.ONE,
        },
        {
            field: FORECASTDETAILS.TABLE_FIELDS.PROJECTED,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.PROJECTED,
            flex: NUMBERMAP.ONE,
        },
        {
            field: FORECASTDETAILS.TABLE_FIELDS.SOLD,
            headerName: FORECASTDETAILS.TABLE_COLUMNS.SOLD_PROJECTION_MET,
            flex: NUMBERMAP.ONE_HALF,
        },
    ];

    return (
        <PageContainer >
            <GlobalLoader loading={isLoading} />
            <CommonSharedTale
                title={FORECASTDETAILS.PRODUCT_PAGE_TITLE}
                Table={
                    <TableContainer>
                        <Grid2 container spacing={NUMBERMAP.ONE}>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.PRODUCT_CATEGORY.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.product_category}
                                />

                            </Grid2>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.PRODUCT_SUB_TYPE.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.product_type}
                                />

                            </Grid2>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.PRODUCT_SUB_TYPE.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.product_subtype}
                                />

                            </Grid2>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.PRODUCT_NUMBER.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.product_id}
                                />

                            </Grid2>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.START_DATE.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.start_date}
                                />

                            </Grid2>
                            <Grid2 size={NUMBERMAP.SIX}>
                                <InfoField
                                    label={FORECASTDETAILS.FIELDS.END_DATE.FIELD_LABELS}
                                    value={ProductForecastData?.data?.[NUMBERMAP.ZERO]?.end_date}
                                />
                            </Grid2>
                            <Grid2 size={NUMBERMAP.TWELVE}>
                                <DataGridTable
                                    title={FORECASTDETAILS.FORECAST_DETAILS.TABLE_TITLE}
                                    rows={forecastData}
                                    columns={columns}
                                    idField={FORECASTDETAILS.FIELD_NAMES.ID_FIELD}
                                    hideFooter
                                />
                            </Grid2>
                        </Grid2>
                        <ButtonContainer>
                            <ButtonGroup buttons={[
                                { label: BUTTON_LABELS_FORM.CANCEL, onClick: onBack },
                            ]} />
                        </ButtonContainer>
                    </TableContainer>
                }
            />
        </PageContainer>
    );
};

export default ViewDetailsSalesForecast;

