import {
  apiClient,
  Follower,
  FollowUser,
  getUserMeResponse,
  getUserResponse,
  UpdateUserProfileRequest,
} from '..';
import { ENDPOINTS } from '../endpoints';

export const usersService = {
  async getUser(userId: string) {
    return apiClient.get<getUserResponse>(ENDPOINTS.USER_PROFILE(userId));
  },

  async getUserMe() {
    return apiClient.get<getUserMeResponse>(ENDPOINTS.USER_ME);
  },
  async getFollowersCount(userId: string) {
    return apiClient.get<{ data: { count: number } }>(
      ENDPOINTS.USER_FOLLOWERS_COUNT(userId),
    );
  },

  async getFollowers(userId: string) {
    return apiClient.get<{ data: FollowUser[] }>(
      ENDPOINTS.USER_FOLLOWERS(userId),
    );
  },

  async getFollowing(userId: string) {
    return apiClient.get<{ data: FollowUser[] }>(
      ENDPOINTS.USER_FOLLOWING(userId),
    );
  },

  async getReferrals(userId: string) {
    return apiClient.get<{ data: FollowUser[] }>(
      ENDPOINTS.USER_REFERRALS(userId),
    );
  },

  async getFollowingCount(userId: string) {
    return apiClient.get<{ data: { count: number } }>(
      ENDPOINTS.USER_FOLLOWING_COUNT(userId),
    );
  },

  async updateUserProfile(data: UpdateUserProfileRequest) {
    return apiClient.patch<{ message: string; success: boolean }>(
      ENDPOINTS.USER_ME,
      data,
    );
  },

  async follow(userId: string) {
    return apiClient.post<{ message: string; data: Follower }>(
      ENDPOINTS.USER_FOLLOW,
      { followedTgId: userId },
    );
  },

  async unFollow(userId: string) {
    return apiClient.delete<{ message: string; success: boolean }>(
      ENDPOINTS.USER_FOLLOW,
      undefined,
      { followedTgId: userId },
    );
  },
};
