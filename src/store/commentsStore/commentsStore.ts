import { create } from 'zustand';
import { CommentType } from '@/api/types/comments';

interface CommentsStore {
  comments: CommentType[];
  addComments: (comments: CommentType[]) => void;
}

export const useCommentsStore = create<CommentsStore>()((set) => ({
  comments: [],
  addComments: (comments) => {
    set(() => ({ comments }));
  },
}));
