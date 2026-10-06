export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const MEDIA_UPLOAD_URL = process.env.NEXT_PUBLIC_MEDIA_UPLOAD_URL || '';

export const CF_API_URL = process.env.NEXT_PUBLIC_CF_API_URL
  ? `${process.env.NEXT_PUBLIC_CF_API_URL}/api`
  : '';

// API endpoints
export const ENDPOINTS = {
  // Auth
  AUTH_TELEGRAM: '/auth/telegram',
  AUTH_REFRESH: '/auth/refresh',
  // Posts
  POSTS: (lang: string, page: number, pageSize: number) =>
    `/post?lang=${lang}&page=${page}&pageSize=${pageSize}`,
  POSTS_FRIENDS: (lang: string, page: number, pageSize: number) =>
    `/posts/followed?lang=${lang}&page=${page}&pageSize=${pageSize}`,
  // Post
  POST_ADD_LIKE: (postId?: string) => `/posts/${postId}/likes`,
  POST_DELETE_LIKE: (postId?: string, userId?: string) =>
    `/posts/${postId}/likes/${userId}`,
  POST_FOLLOW_USER: () => `/users/follow`,
  POST_SET_VIEW: (postId: string) => `/post/${postId}/views`,
  // Comments
  COMMENTS: (postId?: string) => `/posts/${postId}/comments`,
  COMMENT_ADD: (postId?: string) => `/posts/${postId}/comments`,
  COMMENT_DELETE: (postId?: string, commentId?: string) =>
    `/posts/${postId}/comments/${commentId}`,
  // User
  USER_PROFILE: (id: string) => `/users/${id}`,
  USER_ME: '/users/me',
  USER_FOLLOW: '/users/follow',
  USER_FOLLOWERS: (id: string) => `/users/${id}/followers`,
  USER_FOLLOWING: (id: string) => `/users/${id}/following`,
  USER_FOLLOWERS_COUNT: (id: string) => `/users/${id}/followers/count`,
  USER_FOLLOWING_COUNT: (id: string) => `/users/${id}/following/count`,
  USER_REFERRALS: (id: string) => `/users/${id}/referrals`,
  // Moments
  MOMENTS: '/moments',
  MOMENT: (id: string) => `/moments/${id}`,
  // Media
  MEDIA: '/media',
};
