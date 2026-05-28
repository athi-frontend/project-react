"use client";
import React from "react";
import { Eye, EyeSlash } from "iconsax-react";
import CommentItem from "./CommentItem";
import {
  Container,
  MainContent,
  Header,
  Title,
  IconContainer,
  ScrollContainer,
  CommentsContainer,
  CommentsList,
  CommentSection,
  ModalContainer,
  ModalScrollContainer,
  NoCommentsMessage,
  CursorEnableSx,
} from '@/styles/components/ui/comments'
import { NUMBERMAP } from '@/constants/common';
import { CommentsHistoryProps } from '@/types/components/ui/comments'
import { COMMENTS_CONSTANTS } from '@/constants/components/ui/comments'

const CommentsHistory: React.FC<CommentsHistoryProps> = ({
  comments,
  isModal = false,
  showEyeSlash = true,
}) => {
  const [showHistory, setShowHistory] = React.useState(true);

  const shouldShowEyeSlash = isModal ? false : showEyeSlash;
  const ContainerComponent = isModal ? ModalContainer : Container;
  const ScrollContainerComponent = isModal ? ModalScrollContainer : ScrollContainer;

  const handleToggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const hasComments = comments && comments.length > NUMBERMAP.ZERO;

  // Reverse the order of comments from API (newest first)
  const sortedComments = comments ? [...comments].reverse() : [];

  return (
    <ContainerComponent>
      <MainContent>
        <Header>
          <Title>
            {COMMENTS_CONSTANTS.TITLE}
          </Title>
          {shouldShowEyeSlash && (
            <IconContainer
              role={COMMENTS_CONSTANTS.BUTTON}
              aria-label={showHistory ? COMMENTS_CONSTANTS.HIDE_COMMENTS_LABEL : COMMENTS_CONSTANTS.SHOW_COMMENTS_LABEL}
              aria-pressed={!showHistory}
              onClick={handleToggleHistory}
              sx={CursorEnableSx}
            >
              {showHistory ? (
                <EyeSlash size={NUMBERMAP.EIGHTEEN} color={COMMENTS_CONSTANTS.ICON_COLOR} variant={COMMENTS_CONSTANTS.BOLD} />
              ) : (
                <Eye size={NUMBERMAP.EIGHTEEN} color={COMMENTS_CONSTANTS.ICON_COLOR} variant={COMMENTS_CONSTANTS.BOLD} />
              )}
            </IconContainer>
          )}
        </Header>
        {showHistory && (
          <ScrollContainerComponent>
            <CommentsContainer>
              {hasComments ? (
                <CommentsList>
                  {sortedComments.map((comment) => (
                    <CommentSection key={crypto.randomUUID()}>
                      <CommentItem
                        firstName={comment.firstName}
                        lastName={comment.lastName}
                        date={comment.date}
                        comment={comment.comment}
                        isModal={isModal}
                      />
                    </CommentSection>
                  ))}
                </CommentsList>
              ) : (
                <CommentsList>
                  <CommentSection>
                    <NoCommentsMessage>
                      {COMMENTS_CONSTANTS.NO_COMMENTS}
                    </NoCommentsMessage>
                  </CommentSection>
                </CommentsList>
              )}
            </CommentsContainer>
          </ScrollContainerComponent>
        )}
      </MainContent>
    </ContainerComponent>
  );
};

export default CommentsHistory;
