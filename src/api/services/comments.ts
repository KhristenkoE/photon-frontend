import { apiClient } from '@/api/client';
import { PaginatedResponse } from '@/api';
import { ENDPOINTS } from '../endpoints';
import { CommentType } from '@/api/types/comments';

export const commentsService = {
  async getComments(postId?: string) {
    return apiClient.get<PaginatedResponse<CommentType>>(
      ENDPOINTS.COMMENTS(postId),
    );
  },

  async addComment(postId?: string, text?: string) {
    return apiClient.post(ENDPOINTS.COMMENT_ADD(postId), {
      text,
    });
  },

  async deleteComment(postId?: string, commentId?: string) {
    return apiClient.delete(ENDPOINTS.COMMENT_DELETE(postId, commentId));
  },

  async hideComment(postId?: string, commentId?: string) {
    return apiClient.patch(ENDPOINTS.COMMENT_DELETE(postId, commentId), {});
  },
};
