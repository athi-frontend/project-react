"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Box, Grid2 } from "@mui/material";
import { DataTable, InputField, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import Checkbox from "@mui/material/Checkbox";
import { BUTTONSTYLE, NUMBERMAP, STATUS } from "@/constants/common";

import { PageContainer } from "@/styles/modules/hr/inductionTraining";
import { GRID_STYLES, PY20 } from "@/styles/common";
import { CLAUSE_FIELDS, getColumns, QARAHEAD_SLUG } from "@/constants/modules/dnd/clauseApplicability";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useFetchApplicability, useSaveApplicability } from "@/hooks/modules/dnd/useClauseApplicability";
import { useParams, useRouter } from "next/navigation";
import { ClauseApplicabilityData } from "@/types/modules/dnd/clauseApplicability";
import ReviewerModalManager from "@/components/modules/dnd/reviewer-modal/ReviewerModalManager";
import { useUserCustomFilter } from "@/hooks/useCommonDropdown";
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { CommentsHistoryContainer } from '@/styles/components/modules/taskSchedule';
import { ROUTE_PATHS } from '@/constants/modules/dnd/project';
import GlobalLoader from "@/components/shared/LoadingSpinner";

/**
    Classification : Confidential
**/
const QMSClauseApplicability: React.FC = () => {
    const [tableData, setTableData] = useState<ClauseApplicabilityData[]>([]);

    const params = useParams();
    const project_id = Number(params.id);
    const router = useRouter();
    const { data: usersResponse } = useUserCustomFilter({ role_name: QARAHEAD_SLUG });
    const { data: applicabilityData, isLoading: isLoadingSpecifications, isFetching: isFetchingSpecifications } = useFetchApplicability(project_id)
    const { mutate: saveApplicability, isPending } = useSaveApplicability();
    const [hasEditPermission, setHasEditPermission] = useState(true)
    // Set tableData when applicabilityData is received
    useEffect(() => {
        if (applicabilityData?.data) {
            setTableData(applicabilityData?.data ?? []);
        }
    }, [applicabilityData]);

    const isAnyLoading = () => {
        if (isLoadingSpecifications) return true
        if (isFetchingSpecifications) return true
        if (isPending) return true
        return false
    }

    // Log useDownloadFile hook output

    const userOptions = useMemo(() => {
        return (
            usersResponse?.data?.map((user: any) => ({
                id: user.id.toString(),
                name: `${user.firstName} ${user.lastName}`,
            })) ?? []
        );
    }, [usersResponse]);


    const handleCheckboxChange = (id: string, checked: boolean) => {
        setTableData((prev) =>
            prev.map((row) =>
                row.project_applicable_clause_id == id ? { ...row, is_checked: checked } : row
            )
        );
    };

    const handleDescriptionChange = (id: string, value: string) => {
        setTableData((prev) =>
            prev.map((row) =>
                row.project_applicable_clause_id == id ? { ...row, task_description: value } : row
            )
        );
    };


    function updateRowWithSelectedUser(row: any, id: string, value: string, userOptions: any[]) {
        if (row.project_applicable_clause_id == id) {
            const selectedUser = userOptions.find((opt) => opt.id == value);
            return {
                ...row,
                conductedby: selectedUser ? selectedUser.name : "",
                user_id: value,
            };
        }
        return row;
    }

    const handleDropdownChange = (id: string, value: string) => {
        setTableData((prev) =>
            prev.map((row) => updateRowWithSelectedUser(row, id, value, userOptions))
        );
    };

    const renderCheckboxCell = (params: GridRenderCellParams) => {
        return (
            <Grid2>
                <Checkbox
                    checked={params.row.is_checked ?? false}
                    onChange={(e) =>
                        {if(!hasEditPermission) return;
                        handleCheckboxChange(params.row.project_applicable_clause_id, e.target.checked)
                    }}
                    value={params.row.is_checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO}
                />
            </Grid2>
        );
    }

    const renderDescription = (params: GridRenderCellParams) => {
        return (
            <Box
                sx={GRID_STYLES.CELL_ALIGNMENT}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputField
                    label=""
                    placeholder={CLAUSE_FIELDS.DESCRIPTION}
                    value={params.row.task_description ?? ""}
                    hasEditable={!hasEditPermission}
                    onChange={(value: string) => {
                        if (!hasEditPermission) return;
                        handleDescriptionChange(params.row.project_applicable_clause_id, value);
                    }}
                />
            </Box>
        );
    };

    const renderConductedBy = (params: GridRenderCellParams) => {
        return (
            <Box sx={GRID_STYLES.CELL_BASIC_ALIGNMENT}>
                <InputField
                    label=""
                    placeholder={CLAUSE_FIELDS.SELECT}
                    isDropdown
                    keyField={CLAUSE_FIELDS.DROPDOWN.KEY_FIELD}
                    valueField={CLAUSE_FIELDS.DROPDOWN.VALUE_FIELD}
                    value={params.row.user_id ?? ""}
                    hasEditable={!hasEditPermission}
                    onChange={(value) => handleDropdownChange(params.row.project_applicable_clause_id, value)}
                    options={userOptions}
                />
            </Box>
        )
    }
    const columns = getColumns(renderCheckboxCell, renderDescription, renderConductedBy);


    const handleSave = () => {
        const payload = {
            applicability: tableData.map((row) => ({
                project_applicable_clause_id: parseInt(row.project_applicable_clause_id), // Convert string id to number
                assign_to: parseInt(row.user_id), // Convert string to number
                task_description: row.task_description,
                completion_status: row.completion_status, // Map status appropriately
                is_checked: row.is_checked ? NUMBERMAP.ONE : NUMBERMAP.ZERO // Convert boolean to number
            }))
        };

        saveApplicability(payload, {
            onSuccess: () => {
                showActionAlert(STATUS.SUCCESS)
            },
            onError: () => {
                showActionAlert(STATUS.FAILED)
            }
        })
    };

    const handleCancel = () => {
        router.push(ROUTE_PATHS.DND_PROJECT_LIST)
    };

    // Get permissions from applicabilityData or use default
    const permissions = applicabilityData?.meta_info?.action_control?.permissions ?? [];

    return (
        <PageContainer>
            <GlobalLoader loading={isAnyLoading()} />
            {applicabilityData && (
            <CommonSharedTale
                title={CLAUSE_FIELDS.TITLE}
                Table={
                    <>
                            <DataTable
                                rows={tableData ?? []}
                                columns={columns}
                                loading={isLoadingSpecifications}
                                IdField={CLAUSE_FIELDS.ID_FIELD}
                                checkbox={false}

                            />                        
                        <Box sx={PY20}>
                        <CommentsHistoryContainer>
                            <CommentsHistory 
                                comments={applicabilityData?.meta_info?.task_info?.task_comments} />
                        </CommentsHistoryContainer>
                        </Box>
                        <Grid2 sx={BUTTONSTYLE}>
                        <ReviewerModalManager
                            permissions={permissions}
                            isLoading={isLoadingSpecifications}
                            projectId={project_id}
                            menuId={applicabilityData?.meta_info?.action_control?.menuId}
                            menuName={applicabilityData?.meta_info?.action_control?.formName}
                            onPermissionChange={setHasEditPermission}
                            customHandlers={{
                                handleCancel: handleCancel,
                                handleSave: handleSave,
                                isDisabled: isPending
                            }}
                            reviewerList={applicabilityData?.meta_info?.task_info?.reviewer_list}
                        />
                        </Grid2>
                    </>
                }
            />
        )}
        </PageContainer>
    );
};

export default QMSClauseApplicability;
