"use client";
import React from "react";
import { Box, Typography } from '@mui/material';
import {
  CommentHeader,
  CommentCard,
  CommentContent,
  CommentText,
  ModalCommentCard,
  ModalCommentHeader,
  ModalCommentText,
} from '@/styles/components/ui/comments'
import { CommentItemProps } from '@/types/components/ui/comments'
import { formatDate } from "@/lib/utils/common";
 
const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  date,
  firstName,
  lastName,
  isModal = false,
}) => {
  // Automatically choose the appropriate styled components based on modal mode
  const CommentHeaderComponent = isModal ? ModalCommentHeader : CommentHeader;
  const CommentCardComponent = isModal ? ModalCommentCard : CommentCard;
  const formattedDate = formatDate(date, 'DD-MM-YYYY');
  const CommentTextComponent = isModal ? ModalCommentText : CommentText;

  const fullName = `${firstName} ${lastName}`;

  return (
    <Box>
      <CommentHeaderComponent>
        <Typography>{fullName}</Typography>
        <Typography>{formattedDate}</Typography>
      </CommentHeaderComponent>
      <CommentCardComponent>
        <CommentContent>
          <CommentTextComponent>
            {comment}
          </CommentTextComponent>
        </CommentContent>
      </CommentCardComponent>
    </Box>
  );
};

export default CommentItem;
