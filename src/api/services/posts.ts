import { apiClient } from '@/api/client';
import { PaginatedResponse } from '@/api';
import { CF_API_URL, ENDPOINTS } from '../endpoints';
import { PostType } from '@/api/types/posts';

export const postsService = {
  async getPosts(lang: string, page = 1, pageSize: number) {
    return apiClient.get<PaginatedResponse<PostType>>(
      ENDPOINTS.POSTS(lang, page, pageSize),
      {
        baseUrl: CF_API_URL,
      },
    );
  },
  async getFriendsPosts(lang: string, page = 1, pageSize: number) {
    return apiClient.get<PaginatedResponse<PostType>>(
      ENDPOINTS.POSTS_FRIENDS(lang, page, pageSize),
    );
  },

  async addLikeToPost(postId?: string, userId?: string) {
    return apiClient.post(ENDPOINTS.POST_ADD_LIKE(postId), {
      userId,
    });
  },

  async deleteLikeFromPost(postId?: string, userId?: string) {
    return apiClient.delete(ENDPOINTS.POST_DELETE_LIKE(postId, userId));
  },

  async followToUser(followedTgId: string | number) {
    return apiClient.post(ENDPOINTS.POST_FOLLOW_USER(), { followedTgId });
  },

  async unfollowFromUser(followedTgId: string | number) {
    return apiClient.delete(ENDPOINTS.POST_FOLLOW_USER(), {}, { followedTgId });
  },

  async setViewPost(postId: string) {
    return apiClient.post(
      ENDPOINTS.POST_SET_VIEW(postId),
      {},
      {
        baseUrl: CF_API_URL,
      },
    );
  },
};
