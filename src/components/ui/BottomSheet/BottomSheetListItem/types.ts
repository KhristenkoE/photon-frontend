import { Dispatch, FC, SetStateAction, SVGProps } from 'react';
import { ListItemType } from '@/components/common/Navigation/types';

export enum ListItemTheme {
  DEFAULT = 'default',
  COMMENTS = 'comments',
}

export enum ListItemStatus {
  DEFAULT = 'default',
  DELETED = 'deleted',
  HIDDEN = 'hidden',
}

export interface BottomSheetListItemProps {
  type?: ListItemTheme;
  title: string;
  subtitle?: string;
  extraSubtitle?: string;
  icon?: FC<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  color?: string;
  id: ListItemType | string;
  src?: string;
  url?: string;
  onDelete?: (commentId?: string) => void;
  onHide?: (commentId?: string) => void;
  commentId?: string;
  status?: ListItemStatus;
  isMe?: boolean;
  isMyPost?: boolean;
  isSoon?: boolean;
  selectedCommentId?: string;
  setSelectedCommentId?: Dispatch<SetStateAction<string>>;
  elementId?: string;
  telegramId?: string;
}
