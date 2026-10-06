import { create } from 'zustand';
import { PostType } from '@/api/types/posts';

interface PostsStore {
  posts: PostType[];
  friendsPosts: PostType[];
  imageCache: Record<string, string>;
  noFriends: boolean;
  currentIndex: number;
  currentIndexFriends: number;
  shownAdSlides: Set<number>;
  shownAdSlidesFriends: Set<number>;
  hasAdBeenShown: (index: number, isFeed: boolean) => boolean;
  markAdAsShown: (index: number, isFeed: boolean) => void;
  isInitialized: boolean;
  isInitializedFriends: boolean;
  addPosts: (newPosts: PostType[]) => void;
  addFriendsPosts: (newPosts: PostType[]) => void;
  addFollow: (userTgId: string | number, follow: boolean) => void;
  setCurrentIndex: (index: number, isFeed: boolean) => void;
  clearPosts: () => void;
  setPostLike: (postId: string, isLiked: boolean) => void;
  markInitialized: (isFeed: boolean) => void;
  resetInitialized: (isFeed: boolean) => void;
  handleCommentCount: (postId?: string, isAddedComment?: boolean) => void;
}

export const NO_FRIENDS_POST_YET = 'no-friends-posts-yet';

export const usePostsStore = create<PostsStore>()((set, get) => ({
  posts: [],
  friendsPosts: [],
  imageCache: {},
  noFriends: true,
  currentIndex: 0,
  currentIndexFriends: 0,
  isInitialized: false,
  shownAdSlides: new Set(),
  shownAdSlidesFriends: new Set(),
  isInitializedFriends: false,
  addPosts: (newPosts) => {
    set({ posts: [...get().posts, ...newPosts] });
  },
  addFriendsPosts: (newPosts) => {
    const currentPosts = get().friendsPosts;
    set({
      friendsPosts: [...currentPosts, ...newPosts],
    });
    if (newPosts && newPosts.length) {
      set({
        friendsPosts: get().friendsPosts.filter(
          (item) => item.id !== NO_FRIENDS_POST_YET,
        ),
        noFriends: false,
      });
    }
    const noFriendsPostIndex = currentPosts.findIndex(
      (item) => item.id === NO_FRIENDS_POST_YET,
    );
    if (
      currentPosts &&
      currentPosts.length &&
      newPosts &&
      !newPosts.length &&
      noFriendsPostIndex < 0
    ) {
      set({
        friendsPosts: [
          ...currentPosts,
          ...[
            {
              id: NO_FRIENDS_POST_YET,
              description: '',
              user: {
                telegramId: '',
                username: '',
                name: '',
                surname: '',
                imgKey: '',
                imgUrl: '',
              },
              lang: '',
              type: '',
              viewCount: 0,
              commentCount: 0,
              repostCount: 0,
              likeCount: 0,
              isLiked: false,
              isFollowing: false,
              media: {
                id: '',
                key: '',
              },
              vibelist: null,
              createdAt: '',
              updatedAt: '',
            },
          ],
        ],
      });
    }
  },
  addFollow: (userTgId, follow) => {
    const setFollowStatusHandler = (post: PostType) =>
      post.user.telegramId == userTgId
        ? { ...post, isFollowing: follow }
        : post;
    set({
      posts: get().posts.map(setFollowStatusHandler),
      friendsPosts: get().friendsPosts.map(setFollowStatusHandler),
    });
  },
  setCurrentIndex: (index, isFeed) =>
    set(isFeed ? { currentIndex: index } : { currentIndexFriends: index }),
  markAdAsShown: (index, isFeed) => {
    const updated = isFeed
      ? new Set(get().shownAdSlides)
      : new Set(get().shownAdSlidesFriends);
    updated.add(index);
    set(
      isFeed ? { shownAdSlides: updated } : { shownAdSlidesFriends: updated },
    );
  },
  hasAdBeenShown: (index, isFeed) =>
    isFeed
      ? get().shownAdSlides.has(index)
      : get().shownAdSlidesFriends.has(index),
  clearPosts: () => set({ posts: [] }),
  setPostLike: (postId: string, isLiked: boolean) => {
    const changeLikeCountHandle = (post: PostType) =>
      post.id === postId
        ? {
            ...post,
            isLiked,
            likeCount: isLiked ? ++post.likeCount : --post.likeCount,
          }
        : post;
    set({
      posts: get().posts.map(changeLikeCountHandle),
      friendsPosts: get().friendsPosts.map(changeLikeCountHandle),
    });
  },
  markInitialized: (isFeed) =>
    set(isFeed ? { isInitialized: true } : { isInitializedFriends: true }),
  resetInitialized: (isFeed) =>
    set(isFeed ? { isInitialized: false } : { isInitializedFriends: false }),
  handleCommentCount: (postId?: string, isAddedComment?: boolean) => {
    const changeCommentCountHandle = (post: PostType) =>
      post.id === postId
        ? {
            ...post,
            commentCount: isAddedComment
              ? ++post.commentCount
              : --post.commentCount,
          }
        : post;
    set({
      posts: get().posts.map(changeCommentCountHandle),
      friendsPosts: get().friendsPosts.map(changeCommentCountHandle),
    });
  },
}));
