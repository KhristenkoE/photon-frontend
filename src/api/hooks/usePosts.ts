import {
  InfiniteData,
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { usePostsStore } from '@/store/postsStore/postsStore';
import { postsService } from '@/api/services/posts';
import { useEffect, useState } from 'react';
import { TaskCategory } from '@/api/constants';
import { MomentsResponse } from '@/api/types/types';

const PAGE_SIZE = 15;

export const setQueryDataFollowing = (
  queryClient: QueryClient,
  userTgId: string | number,
  isFollowing: boolean,
) => {
  queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
    { queryKey: ['moments', Number(userTgId)] },
    (oldData) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((moment) =>
            moment.user.telegramId === Number(userTgId)
              ? { ...moment, isFollowing }
              : moment,
          ),
        })),
      };
    },
  );
};

export const useInfinitePosts = (lang: string) => {
  const addPosts = usePostsStore((s) => s.addPosts);
  const posts = usePostsStore((s) => s.posts);
  const isInitialized = usePostsStore((s) => s.isInitialized);
  const markInitialized = usePostsStore((s) => s.markInitialized);
  const [postsSize, setPostsSize] = useState<number>(PAGE_SIZE);

  const query = useInfiniteQuery({
    queryKey: ['posts', { lang }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsService.getPosts(lang, 1, PAGE_SIZE);
      const posts = res.data;
      setPostsSize(res.data.length);
      return { posts, page: pageParam };
    },
    getNextPageParam: (lastPage) => {
      const isEnd = lastPage.posts.length === 0;
      return isEnd ? 1 : lastPage.page + 1;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && !isInitialized) {
      const allPosts = query.data.pages.flatMap((p) => p.posts);
      if (allPosts.length > posts.length) {
        const newPosts = allPosts.slice(-postsSize);
        addPosts(newPosts);
        markInitialized(true);
      }
    }
  }, [query.data, addPosts, isInitialized, markInitialized]);

  return query;
};

export const useInfiniteFriendsPosts = (lang: string) => {
  const addFriendsPosts = usePostsStore((s) => s.addFriendsPosts);
  const friendsPosts = usePostsStore((s) => s.friendsPosts);
  const isInitialized = usePostsStore((s) => s.isInitialized);
  const markInitialized = usePostsStore((s) => s.markInitialized);
  const [postsSize, setPostsSize] = useState<number>(PAGE_SIZE);

  const query = useInfiniteQuery({
    queryKey: ['friendsPosts', { lang }],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsService.getFriendsPosts(lang, 1, PAGE_SIZE);
      const friendsPosts = res.data;
      setPostsSize(res.data.length);
      addFriendsPosts(res.data);
      return { friendsPosts, page: pageParam };
    },
    getNextPageParam: (lastPage) => {
      const isEnd = lastPage.friendsPosts.length === 0;
      return isEnd ? 1 : lastPage.page + 1;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && !isInitialized) {
      const allFriendsPosts = query.data.pages.flatMap((p) => p.friendsPosts);
      if (allFriendsPosts.length > friendsPosts.length) {
        const newFriendsPosts = allFriendsPosts.slice(-postsSize);
        addFriendsPosts(newFriendsPosts);
        markInitialized(false);
      }
    }
  }, [query.data, addFriendsPosts, isInitialized, markInitialized]);

  return query;
};

export const useAddPostLike = (postId: string, userId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    meta: {
      taskCategory: TaskCategory.Likes,
    },
    mutationFn: async () => {
      try {
        return await postsService.addLikeToPost(postId, userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Updating cache for moments
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
                    likeCount: moment.likeCount + 1,
                    isLiked: true,
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

// Hook for delete like to post
export const useDeletePostLike = (postId: string, userId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await postsService.deleteLikeFromPost(postId, userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: () => {
      // Updating cache for moments
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
                    likeCount: Math.max(moment.likeCount - 1, 0),
                    isLiked: false,
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

// Hook for following to user
export const useFollowToUser = () => {
  const queryClient = useQueryClient();
  const addFollow = usePostsStore((s) => s.addFollow);

  return useMutation({
    meta: {
      taskCategory: TaskCategory.SubscribeToUsers,
    },
    mutationFn: async (followedTgId: string | number) => {
      try {
        const res = await postsService.followToUser(followedTgId);
        addFollow(followedTgId, true);
        setQueryDataFollowing(queryClient, followedTgId, true);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};

// Hook for unfollowing to user
export const useUnfollowFromUser = () => {
  const queryClient = useQueryClient();
  const addFollow = usePostsStore((s) => s.addFollow);

  return useMutation({
    mutationFn: async (followedTgId: string | number) => {
      try {
        const res = await postsService.unfollowFromUser(followedTgId);
        addFollow(followedTgId, false);
        setQueryDataFollowing(queryClient, followedTgId, false);
        return res;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};

// Hook for set view post
export const useSetViewPost = () => {
  return useMutation({
    mutationFn: async (postId: string) => {
      try {
        return await postsService.setViewPost(postId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });
};
