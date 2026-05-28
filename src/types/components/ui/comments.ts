export interface Comment {
  comment_order: string
  comment: string
  date: string
  firstName: string
  lastName: string
}

export interface CommentsHistoryProps {
  comments?: Comment[]
  onCommentDetails?: (commentId: string) => void
  menuId?: number
  projectId?: number
  useApi?: boolean
  isModal?: boolean
  showEyeSlash?: boolean
}

export interface CommentItemProps {
  comment: string
  date: string
  firstName: string
  lastName: string
  isModal?: boolean
}


