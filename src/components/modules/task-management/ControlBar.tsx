"use client";
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Collapse,
  Divider,
  useTheme,
} from '@mui/material';
import { InputField } from '@/components/ui';
import { ArrowLeft2, ArrowRight2, SearchNormal1, Eye } from 'iconsax-react';
import {
  controlBarSx,
  navButtonSx,
  pageTitleSx,
  pageTitleTypographySx,
  verticalDividerSx,
  searchToggleSx,
  searchContainerSx,
  viewAllContainerSx,
  viewAllTextSx,
  nextButtonSx,
  pageMenuSx,
  menuItemSx,
  expandsearchToggleSx, searcToggleSx, viewAllClickedSx, viewAllExpandTextSx
} from '@/styles/modules/task-management/taskManagement';
import { NUMBERMAP } from '@/constants/common';
import { TASK_MANAGEMENT } from '@/constants/modules/task-management/taskManagement';
import { ControlBarProps } from "@/types/modules/task-management/taskManagement";

const ControlBar: React.FC<ControlBarProps> = ({
  currentPage,
  currentPageTitle,
  allPages,
  onPageChange,
  onSearchChange,
  searchValue: externalSearchValue = "",
  disabled = false,
}) => {
  const theme = useTheme();
  const controlBarRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [menuWidth, setMenuWidth] = useState<number | undefined>(undefined);
  
  // Internal state management
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isViewHovered, setIsViewHovered] = useState(false);
  const [isViewAllClicked, setIsViewAllClicked] = useState(false);
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [internalSearchValue, setInternalSearchValue] = useState(externalSearchValue);

  // Use external search value if provided, otherwise use internal
  const searchValue = onSearchChange ? externalSearchValue : internalSearchValue;
  const setSearchValue = onSearchChange ?? setInternalSearchValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlBarRef.current &&
        !controlBarRef.current.contains(event.target as Node)
      ) {
        if (isSearchExpanded) {
          handleSearchToggle();
        }
        setIsViewAllClicked(false);
        setIsViewHovered(false);
        setIsSearchHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);

  useEffect(() => {
    if (controlBarRef.current) {
      setMenuWidth(controlBarRef.current.offsetWidth);
    }
  }, []);

  // Internal handlers
  const handlePreviousPage = () => {
    if (currentPage > NUMBERMAP.ONE && !disabled) {
      onPageChange(currentPage - NUMBERMAP.ONE);
    }
  };

  const handleNextPage = () => {
    if (currentPage < allPages.length && !disabled) {
      onPageChange(currentPage + NUMBERMAP.ONE);
    }
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) {
      setSearchValue("");
    }
  };

  const handlePageMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePageMenuClose = () => {
    setAnchorEl(null);
    setIsViewAllClicked(false);
  };

  const handlePageSelect = (page: string) => {
    const pageIndex = allPages.indexOf(page);
    if (pageIndex !== -1) {
      onPageChange(pageIndex + NUMBERMAP.ONE);
    }
    handlePageMenuClose();
  };

  return (
    <Box sx={controlBarSx} ref={controlBarRef}>
      {!isSearchExpanded && !isViewAllClicked && (
        <>
          <IconButton
            size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
            onClick={handlePreviousPage}
            disabled={currentPage === NUMBERMAP.ONE || disabled}
            sx={navButtonSx}
          >
            <ArrowLeft2
              size={NUMBERMAP.TWENTY}
              color={
                currentPage === NUMBERMAP.ONE || disabled
                  ? theme.palette.text.secondary
                  : theme.palette.primary.main
              }
            />
          </IconButton>

          <Box sx={pageTitleSx}>
            <Typography
              variant={TASK_MANAGEMENT.TYPOGRAPHY_VARIANT}
              sx={pageTitleTypographySx}
            >
              {currentPageTitle}
            </Typography>
          </Box>

          <Divider
            orientation={TASK_MANAGEMENT.DIVIDER_ORIENTATION}
            flexItem
            sx={verticalDividerSx}
          />
        </>
      )}

      {isSearchExpanded && (
        <>
          <IconButton
            size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
            onClick={handlePreviousPage}
            disabled={currentPage === NUMBERMAP.ONE || disabled}
            sx={navButtonSx}
          >
            <ArrowLeft2
              size={NUMBERMAP.TWENTY}
              color={
                currentPage === NUMBERMAP.ONE || disabled
                  ? theme.palette.text.secondary
                  : theme.palette.primary.main
              }
            />
          </IconButton>

          <IconButton
            size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
            onClick={handleSearchToggle}
            sx={expandsearchToggleSx}
          >
            <SearchNormal1
              size={NUMBERMAP.FIFTEEN}
              color={theme.palette.text.secondary}
            />
          </IconButton>
          <Collapse
            in={isSearchExpanded}
            orientation={TASK_MANAGEMENT.COLLAPSE_ORIENTATION}
          >
            <Box sx={searchContainerSx} ref={searchContainerRef}>
              <InputField
                label=""
                placeholder={TASK_MANAGEMENT.INPUT_FIELD_PLACEHOLDER}
                value={searchValue}
                onChange={setSearchValue}
              />
            </Box>
          </Collapse>

          <IconButton
            size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
            onClick={handleNextPage}
            disabled={disabled}
            sx={nextButtonSx}
          >
            <ArrowRight2
              size={NUMBERMAP.TWENTY}
              color={theme.palette.primary.main}
            />
          </IconButton>
        </>
      )}

      {!isSearchExpanded && !isViewAllClicked && (
        <Box
          sx={searcToggleSx}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          onClick={handleSearchToggle}
        >
          <IconButton
            size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
            sx={searchToggleSx}
          >
            <SearchNormal1
              size={NUMBERMAP.TWENTY}
              color={theme.palette.text.secondary}
            />
          </IconButton>
          {isSearchHovered && (
            <Typography
              variant={TASK_MANAGEMENT.TYPOGRAPHY_VARIANT}
              sx={viewAllTextSx}
            >
              {TASK_MANAGEMENT.SEARCH_LABEL}
            </Typography>
          )}
        </Box>
      )}

      {isViewAllClicked ? (
        <Box
          sx={viewAllClickedSx}
          onClick={(event) => {
            if (anchorEl) {
              handlePageMenuClose();
              setIsViewAllClicked(false);
            } else {
              handlePageMenuClick(event);
              setIsViewAllClicked(true);
            }
          }}
        >
          <IconButton size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}>
            <ArrowLeft2
              size={NUMBERMAP.TWENTYFOUR}
              color={theme.palette.text.secondary}
            />
          </IconButton>
          <Typography
            variant={TASK_MANAGEMENT.TYPOGRAPHY_VARIANT}
            sx={viewAllExpandTextSx}
          >
            {TASK_MANAGEMENT.VIEW_ALL_LABEL}
          </Typography>
        </Box>
      ) : (
        !isSearchExpanded && (
          <Box
            sx={viewAllContainerSx}
            onMouseEnter={() => setIsViewHovered(true)}
            onMouseLeave={() => setIsViewHovered(false)}
            onClick={(event) => {
              handlePageMenuClick(event);
              setIsViewAllClicked(true);
            }}
          >
            <IconButton size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}>
              <Eye
                size={NUMBERMAP.TWENTYFOUR}
                color={theme.palette.text.secondary}
              />
            </IconButton>
            {isViewHovered && (
              <Typography
                variant={TASK_MANAGEMENT.TYPOGRAPHY_VARIANT}
                sx={viewAllTextSx}
              >
                {TASK_MANAGEMENT.VIEW_ALL_LABEL}
              </Typography>
            )}
          </Box>
        )
      )}

      {!isSearchExpanded && !isViewAllClicked && (
        <IconButton
          size={TASK_MANAGEMENT.ICON_BUTTON_SIZE}
          onClick={handleNextPage}
          disabled={disabled}
          sx={nextButtonSx}
        >
          <ArrowRight2
            size={NUMBERMAP.TWENTY}
            color={theme.palette.primary.main}
          />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handlePageMenuClose}
        anchorOrigin={{
          vertical: TASK_MANAGEMENT.MENU_ANCHOR_VERTICAL,
          horizontal: TASK_MANAGEMENT.LEFT,
        }}
        transformOrigin={{
          vertical: TASK_MANAGEMENT.MENU_TRANSFORM_VERTICAL,
          horizontal: TASK_MANAGEMENT.LEFT,
        }}
        PaperProps={{
          sx: {
            ...((pageMenuSx as any)(theme)),
            width: menuWidth,
          },
        }}
      >
        {allPages.map((page) => (
          <MenuItem
            key={page}
            onClick={() => handlePageSelect(page)}
            sx={menuItemSx}
          >
            {page}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default ControlBar;