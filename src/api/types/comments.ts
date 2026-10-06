export interface CommentType {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
  user: {
    username: string;
    name: string;
    surname: string;
    telegramId: string;
  };
  userProfile: {
    avatar: {
      url: string;
      key: string;
    };
  };
  meta: {
    isMe: boolean;
  };
}
