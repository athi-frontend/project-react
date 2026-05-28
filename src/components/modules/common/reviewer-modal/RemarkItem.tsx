"use client";
import React from "react";
import { Box } from "@mui/material";
import {
  remarkItemContainerStyles,
  remarkHeaderStyles,
  creatorInfoStyles,
  dateInfoStyles,
  commentBoxStyles,
  commentTextStyles,
} from "@/styles/components/ui/commonBox";

interface RemarkItemProps {
  createdBy: string;
  date: string;
  comment: string;
}

const RemarkItem: React.FC<RemarkItemProps> = ({ createdBy, date, comment }) => {
  return (
    <Box component="article" sx={remarkItemContainerStyles}>
      <Box component="header" sx={remarkHeaderStyles}>
        <Box component="span" sx={creatorInfoStyles}>
          {createdBy}
        </Box>
        <Box component="time" sx={dateInfoStyles}>
          {date}
        </Box>
      </Box>
      <Box component="section" sx={commentBoxStyles}>
        <Box component="p" sx={commentTextStyles}>
          {comment}
        </Box>
      </Box>
    </Box>
  );
};

export default RemarkItem;
