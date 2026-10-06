import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { commentsService } from '@/api/services/comments';
import { useEffect } from 'react';
import { useCommentsStore } from '@/store/commentsStore/commentsStore';
import xss from 'xss';
import { usePostsStore } from '@/store/postsStore/postsStore';
import { MomentsResponse } from '@/api';

// Hook for get comment list for post
export function useGetComments(postId?: string) {
  const addComments = useCommentsStore((s) => s.addComments);

  const query = useQuery({
    queryKey: ['moment', postId],
    queryFn: () => commentsService.getComments(postId),
    enabled: false,
  });

  useEffect(() => {
    if (query.data) {
      addComments(query.data.data);
    }
  }, [query.data, addComments]);

  return query;
}

// Hook for add comment to post
export const useAddComment = (postId?: string) => {
  const queryClient = useQueryClient();
  const handleCommentCount = usePostsStore((s) => s.handleCommentCount);

  return useMutation({
    // meta: {
    //   taskCategory: TaskCategory.Comments,
    // },
    mutationFn: async (text: string) => {
      try {
        const sanitizedText = xss(text);
        const response = await commentsService.addComment(
          postId,
          sanitizedText,
        );
        handleCommentCount(postId, true);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments'] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((moment) => {
                if (moment.postId === postId) {
                  return {
                    ...moment,
                    commentCount: moment.commentCount + 1,
                  };
                }
                return moment;
              }),
            })),
          };
        },
      );
    },
  });
};

// Hook for delete comment from post
export const useDeleteComment = (postId?: string) => {
  const queryClient = useQueryClient();
  const handleCommentCount = usePostsStore((s) => s.handleCommentCount);

  return useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const response = await commentsService.deleteComment(postId, commentId);
        handleCommentCount(postId, false);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments'] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((moment) => {
                if (moment.postId === postId) {
                  return {
                    ...moment,
                    commentCount: moment.commentCount - 1,
                  };
                }
                return moment;
              }),
            })),
          };
        },
      );
    },
  });
};

// Hook for hide comment from post
export const useHideComment = (postId?: string) => {
  const queryClient = useQueryClient();
  const handleCommentCount = usePostsStore((s) => s.handleCommentCount);

  return useMutation({
    mutationFn: async (commentId: string) => {
      try {
        const response = await commentsService.hideComment(postId, commentId);
        handleCommentCount(postId, false);
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments'] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((moment) => {
                if (moment.postId === postId) {
                  return {
                    ...moment,
                    commentCount: moment.commentCount - 1,
                  };
                }
                return moment;
              }),
            })),
          };
        },
      );
    },
  });
};
