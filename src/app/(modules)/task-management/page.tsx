"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Grid2, Box, Typography, CircularProgress } from '@mui/material';
import { DataTable } from '@/components/ui';
import {
  taskManagementContainerSx,
  headerSectionSx,
  headerTitleSx,
  loadingSpinnerSx,
} from '@/styles/modules/task-management/taskManagement';
import { UserData, TaskTransitionRequestPayload } from "@/types/modules/task-management/taskManagement";
import { NUMBERMAP } from '@/constants/common';
import { TM_TABLE_COLUMNS, TM_TYPOGRAPHY_VARIANT, TM_ID_FIELD, TASK_MANAGEMENT } from '@/constants/modules/task-management/taskManagement';
import ControlBar from '@/components/modules/task-management/ControlBar';
import { useCombinedTaskData, useProjectTypeModuleAll } from '@/hooks/modules/task-mangement/useTaskManagement';
import { useAppSelector } from '@/store/slices/menuSlice';
import Link from "next/link";
import { UnderLine } from "@/styles/common";

const TaskManagementTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(NUMBERMAP.ONE);
  const [currentProjectTypeIds, setCurrentProjectTypeIds] = useState<number[]>([NUMBERMAP.TWO]);

  // Get user_id from Redux store - no fallback
  const userId = useAppSelector((state) => state.menu.user_id);

  // Get project type modules - no query parameters needed
  const { data: projectTypeData, isLoading: projectTypeLoading } = useProjectTypeModuleAll();

  // Get dynamic page titles from API data and filter by search, including static "All" option
  const allPages = useMemo(() => {
    if (!projectTypeData?.data) return [];

    // Add static "All" option at the beginning
    const modules = [TASK_MANAGEMENT.ALL_MODULES_OPTION, ...projectTypeData.data.map(module => module.module_name)];

    // Filter modules by search value
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      const filteredModules = modules.filter(moduleName =>
        moduleName.toLowerCase().includes(searchTerm)
      );
      return filteredModules;
    }

    return modules;
  }, [projectTypeData, searchValue]);

  // Reset current page when search results change
  useEffect(() => {
    if (allPages.length > NUMBERMAP.ZERO) {
      if (currentPage > allPages.length) {
        setCurrentPage(NUMBERMAP.ONE);
      }
    }
  }, [allPages, currentPage]);

  // Update project type IDs when page changes or project type data changes
  useEffect(() => {
    if (projectTypeData?.data && projectTypeData.data.length > NUMBERMAP.ZERO && allPages.length > NUMBERMAP.ZERO) {
      const pageIndex = currentPage - NUMBERMAP.ONE;
      // Get the current page title
      const currentPageTitle = allPages[pageIndex];
      // If "All" is selected, use all project type IDs
      if (currentPageTitle === TASK_MANAGEMENT.ALL_MODULES_OPTION) {
        const allProjectTypeIds = projectTypeData.data.flatMap(module => module.project_type_id);
        setCurrentProjectTypeIds(allProjectTypeIds);
      } else {
        // Find the module by name in the original data
        const currentModule = projectTypeData.data.find(module => module.module_name === currentPageTitle);

        if (currentModule) {
          // Use all project type IDs from the current module
          setCurrentProjectTypeIds(currentModule.project_type_id);
        } else {
          // Fallback to default if module not found
          setCurrentProjectTypeIds([NUMBERMAP.TWO]);
        }
      }
    }
  }, [currentPage, projectTypeData, allPages]);

  // Create payload with dynamic values based on current page and available project types
  const currentPayload: TaskTransitionRequestPayload = {
    project_type_id: currentProjectTypeIds,
    user_id: userId // Can be null - handled by hooks
  };

  // Use the combined task data hook with payload - no query parameters for project type module
  const { data: combinedTaskData, isLoading: taskDataLoading } = useCombinedTaskData(currentPayload);



  const currentPageTitle = allPages[currentPage - NUMBERMAP.ONE] ?? TASK_MANAGEMENT.PAGE_TITLE;

  // Transform API data to table format with pagination for "All" view
  const transformedTableData = useMemo(() => {
    if (!combinedTaskData?.data) return [];
    const tableData: UserData[] = [];
    let serialNo = NUMBERMAP.ONE;
    // Show all data for "All" view - no limits
    combinedTaskData.data.forEach((module) => {
      module.tasks.forEach((task) => {
        tableData.push({
          id: serialNo,
          sno: serialNo,
          task: task.task_name,
          projectName: task.project_name,
          moduleName: module.module_name,
          taskDescription: `${task.task_name} for ${task.project_name}`,
          assignedDate: task.user_task_status.assigned_date,
          status: task.user_task_status.status_name,
          taskURL: task.task_url
        });
        serialNo++;
      });
    });

    return tableData;
  }, [combinedTaskData]);
  // Loading and empty states are handled by DataTable's built-in props/messages

  const isLoading = projectTypeLoading === true || taskDataLoading === true;
  const isNoModuleFound = !isLoading && Boolean(searchValue.trim()) && allPages.length === NUMBERMAP.ZERO;

  return (
    <Box sx={taskManagementContainerSx}>
      <Grid2 container spacing={NUMBERMAP.THREE} sx={headerSectionSx}>
        <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.EIGHT }}>
          {!isLoading && !isNoModuleFound && (
            <Typography variant={TM_TYPOGRAPHY_VARIANT} sx={headerTitleSx}>
              {currentPageTitle}
            </Typography>
          )}
        </Grid2>
        {!isLoading && (
          <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.FOUR }}>
            <ControlBar
              currentPage={currentPage}
              currentPageTitle={isLoading || isNoModuleFound ? '' : currentPageTitle}
              allPages={allPages}
              onPageChange={setCurrentPage}
              onSearchChange={setSearchValue}
              searchValue={searchValue}
              disabled={isLoading}
            />
          </Grid2>
        )}
      </Grid2>
      {/* Loading state - hide table entirely */}
      {isLoading && (
        <Box sx={loadingSpinnerSx}>
          <CircularProgress size={NUMBERMAP.TWENTYSEVEN} />
        </Box>
      )}

      {/* Show message when search returns no modules (only when not loading) */}
      {!isLoading && isNoModuleFound && (
        <Box sx={loadingSpinnerSx}>
          <Typography variant="h6" color="text.secondary">
            {TASK_MANAGEMENT.NO_MODULE_FOUND}
          </Typography>
        </Box>
      )}

      {!isLoading && !isNoModuleFound && (
        <DataTable
          rows={transformedTableData}
          columns={TM_TABLE_COLUMNS.map((col) => {
            if (col.field === "task") {
              return {
                ...col,
                renderCell: (params) => (
                  <Link href={params.row.taskURL ?? '#'} style={UnderLine}>
                    {params.value}
                  </Link>
                ),
              }
            }
            return col
          })}
          IdField={TM_ID_FIELD}
          checkbox={false}
          loading={false}
        />
      )}
    </Box>
  );
};

export default TaskManagementTable;