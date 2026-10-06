import { create } from 'zustand';
import {
  BottomSheetListItemProps,
  ListItemStatus,
  ListItemTheme,
} from '@/components/ui/BottomSheet';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { PaginatedResponse } from '@/api';
import { CommentType } from '@/api/types/comments';
import { getMappedCommentsData } from '@/components/pages/Feed/components/Post/Actions/Actions';

export interface BottomSheetStateHistory {
  title: string;
  type?: ListItemTheme;
  currentPostId?: string;
  refetchCommentsFn?: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<PaginatedResponse<CommentType>, Error>>;
  list: (BottomSheetListItemProps & { id?: number | string })[];
}

interface BottomSheetState {
  history: BottomSheetStateHistory[];
  isOpen: boolean;
  isOpenComment: boolean;
  postUserTelegramId?: string | number;
  commentValue: string;
  keyboardVisible: boolean;
  setKeyboardVisible: (keyboardVisible: boolean) => void;
  open: (data: BottomSheetStateHistory) => void;
  setData: (
    data?: CommentType[],
    currentPostId?: string | number,
    telegramId?: number,
  ) => void;
  setCommentStatus: (commentId?: string, status?: ListItemStatus) => void;
  back: () => void;
  close: () => void;
  setIsOpenComment: (isOpenComment: boolean) => void;
  setCommentValue: (newComment: string) => void;
  setCurrentPostId: (postUserTelegramId?: string | number) => void;
}

export const useBottomSheetStore = create<BottomSheetState>((set, get) => ({
  history: [],
  commentValue: '',
  postUserTelegramId: '',
  keyboardVisible: false,
  isOpen: false,
  isOpenComment: false,
  open: (data) =>
    set((state) => ({
      history: [...state.history, data],
      isOpen: true,
    })),
  setKeyboardVisible: (keyboardVisible) =>
    set(() => ({
      keyboardVisible,
    })),
  setData: (data, postUserTelegramId, telegramId) =>
    set((state) => {
      if (data) {
        const mappedCommentsData = getMappedCommentsData(
          data,
          postUserTelegramId,
          telegramId,
        );
        return {
          history: state.history.map((history, index) =>
            index === state.history.length - 1
              ? { ...history, list: mappedCommentsData }
              : history,
          ),
        };
      }
      return {};
    }),
  setCommentStatus: (commentId, status = ListItemStatus.DELETED) =>
    set((state) => ({
      history: state.history.map((history, index) =>
        index === state.history.length - 1
          ? {
              ...history,
              list: history.list.map((comment) =>
                comment.commentId === commentId
                  ? { ...comment, status }
                  : comment,
              ),
            }
          : history,
      ),
    })),
  back: () => {
    const { history } = get();
    if (history.length > 1) {
      set((state) => ({
        history: state.history.slice(0, -1),
      }));
    } else {
      set({ isOpen: false, history: [] });
    }
  },
  close: () =>
    set({
      isOpen: false,
      history: [],
      commentValue: '',
      keyboardVisible: false,
    }),
  setIsOpenComment: (isOpenComment) => set({ isOpenComment }),
  setCommentValue: (commentValue) => set({ commentValue }),
  setCurrentPostId: (postUserTelegramId) => set({ postUserTelegramId }),
}));
