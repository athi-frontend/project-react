'use client';
import React, { useState } from 'react';
import { Box, Typography, List, ListItem, IconButton, Collapse, } from '@mui/material';
import { ArrowDown2, Import } from 'iconsax-react';
import { NUMBERMAP } from '@/constants/common';
import { AnnexureBoxContainer, ListContainer } from '@/styles/modules/regulation/executiveSummary';
import { CURRENT_COLOR } from '@/constants/components/menu';
interface AnnexureItem {
  label: string;
  fileUrl: string;
}
interface AnnexureDropdownProps {
  title?: string;
  items: AnnexureItem[];
}
const AnnexureDropdown: React.FC<AnnexureDropdownProps> = ({ title = 'Annexure', items }) => {
  const [open, setOpen] = useState(false);
  const toggleDropdown = () => setOpen(!open);
  return (
    <Box>
      <Box onClick={toggleDropdown} sx={AnnexureBoxContainer}      >
        <Typography>{title}</Typography>
        <ArrowDown2 size={NUMBERMAP.EIGHTEEN} color={CURRENT_COLOR} variant="Outline" />
      </Box>
      <Collapse in={open}>
        <List disablePadding>
          {items.map((item) => (
            <ListItem key={item.label} disableGutters>
              <Box sx={ListContainer}>
                <Typography>{item.label}</Typography>
                <IconButton href={item.fileUrl} target="_blank" rel="noopener noreferrer" download size="small">
                  <Import
                    size={NUMBERMAP.EIGHTEEN}
                    color={CURRENT_COLOR}
                    variant="Linear"
                  />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};
export default AnnexureDropdown;
