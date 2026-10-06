export interface UserType {
  telegramId: string | number;
  username: string;
  imgKey: string;
  imgUrl: string;
  name: string;
  surname: string;
}

export interface PostType {
  id: string;
  lang: string;
  type: string;
  viewCount: number;
  commentCount: number;
  repostCount: number;
  likeCount: number;
  media: {
    id: string;
    key: string;
  };
  vibelist: {
    categoryId: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
  isFollowing: boolean;
  description: string;
  user: UserType;
}
