"use client";
import React from "react";
import { Box } from "@mui/material";
import RemarkItem from "./RemarkItem";
import {
  remarksContainerStyles,
  remarksContentStyles,
  remarksListStyles,
  noCommentsMessageStyles,
} from "@/styles/components/ui/commonBox";
import { NUMBERMAP, REVIEWER_FORM } from "@/constants/common";

interface RemarkData {
  comment: string;
  date: string;
  ref_id: number;
  comment_type: string;
  comment_order: number;
  user_id: number;
  firstName: string;
  lastName: string;
}

interface RemarksScrollProps {
  remarks?: RemarkData[];
}

const RemarksScroll: React.FC<RemarksScrollProps> = ({
  remarks = []
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCreatedBy = (firstName: string, lastName: string): string => {
    return `${firstName} ${lastName}`;
  };

  const hasRemarks = remarks.length > NUMBERMAP.ZERO;

  return (
    <Box component="section" sx={remarksContainerStyles}>
      <Box sx={remarksContentStyles}>
        <Box sx={remarksListStyles}>
          {hasRemarks ? (
            remarks.map((remark, index) => (
              <RemarkItem
                key={remark.ref_id ?? index}
                createdBy={formatCreatedBy(remark.firstName, remark.lastName)}
                date={formatDate(remark.date)}
                comment={remark.comment}
              />
            ))
          ) : (
            <Box sx={noCommentsMessageStyles}>
              {REVIEWER_FORM.NO_COMMENTS}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RemarksScroll;
