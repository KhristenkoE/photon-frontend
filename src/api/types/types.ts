import { TaskCategory } from '@/api/constants';
import { UserType } from '@/api/types/posts';

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
  };
};

export interface UserBase {
  id: string;
  username: string;
  telegramId: number;
  name: string;
  surname: string;
  isPremium: boolean;
  consentVersion?: string | null;
}

export interface User extends UserBase {
  profile: {
    bio: string;
    avatar: Avatar;
  };
}

export interface UserMe extends UserBase {
  profile: {
    bio: string;
    avatar: Avatar;
    settings: UserProfileSettings;
  };
}

export interface FollowUser {
  telegramId: number;
  username: string;
  name: string;
  surname: string;
  profile: {
    avatar: Avatar;
  };
}

export interface Avatar {
  key: string;
  url: string;
}

export interface Profile {
  bio: string;
  avatarId: string;
  avatarKey: string;
}

export interface UserProfileSettings {
  privacyType: PrivacyType;
  requireFollowVerification: boolean;
}

export enum PrivacyType {
  PUBLIC,
  FRIENDS,
  PRIVATE,
}

export interface UpdateUserProfileRequest {
  user?: Partial<Pick<UserBase, 'username' | 'name' | 'surname'>>;
  profile?: Partial<Profile>;
  settings?: Partial<UserProfileSettings>;
}

export interface UserMeta {
  isFollowing: boolean;
  allowedToView: boolean;
  followersCount: number;
  followingCount: number;
}

export interface getUserResponse {
  data: User;
  meta: UserMeta;
}

export interface getUserMeResponse {
  data: UserMe;
  meta: Omit<UserMeta, 'allowedToView' | 'isFollowing'>;
}

export interface Follower {
  id: string;
  followerId: string;
  followedId: string;
  status: string;
  createdAt: string;
  modifiedAt: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
    meta: {
      alreadyRegistered: boolean;
    };
  };
}

export interface MediaUploadResponse {
  data: {
    id: string;
    key: string;
    created_at: Date | string;
    updated_at: Date | string;
  };
}

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress: number; // 0-100
}

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface GetMomentsParams extends PaginationParams {
  userTgId: string | number;
}

export interface CreateMomentRequest {
  userId: string;
  description: string;
  lang: string;
  mediaId: string;
  isDraft: boolean;
}

export interface UpdateMomentRequest {
  description: string;
  lang: string;
  mediaId: string;
  isDraft: boolean;
}

export interface Moment {
  id: string;
  description: string;
  userId: string;
  media: { id: string; key: string };
  createdAt: string;
  updatedAt: string;
  postId: string;
  type: string;
  likeCount: number;
  viewCount: number;
  repostCount: number;
  commentCount: number;
  user: UserType;
  isLiked: boolean;
  isFollowing: boolean;
}

export type MomentsResponse = {
  data: Moment[];
  meta: {
    count: number;
    hasNext: boolean;
  };
};

export interface UploadProgressEvent {
  loaded: number;
  total: number;
  progress: number; // 0-100
}

export type UploadProgressCallback = (event: UploadProgressEvent) => void;

export interface UploadProgress {
  progress: number;
  loaded: number;
  total: number;
}

export interface UserFund {
  id: string;
  currency: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserFundsResponse {
  data: UserFund[];
}

export interface Task {
  id: string;
  category: TaskCategory;
  name: string;
  type: string;
  isMultiple: boolean;
  reward: number;
  rewardCurrency: string;
  appearanceType: string;
  dependsOn: string;
  order: number;
  quantity: number;
  progress: number | null;
  isCompleted: boolean;
  isReceived: boolean;
  status: string;
  // custom field
  receivable?: boolean;
}
