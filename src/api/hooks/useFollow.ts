import { useToast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users';
import { getUserResponse, UserMeta } from '../types/types';
import { usePostsStore } from '@/store/postsStore/postsStore';
import { setQueryDataFollowing } from '@/api/hooks/usePosts';

interface UseFollowersOptions {
  userId?: string;
}

export const useFollow = (options?: UseFollowersOptions) => {
  const queryClient = useQueryClient();
  const { showError } = useToast();
  const addFollow = usePostsStore((s) => s.addFollow);

  const followMutation = useMutation({
    mutationKey: ['follow'],
    mutationFn: (userId: string) => usersService.follow(userId),
    onSuccess: (_, userId) => {
      queryClient.setQueryData(['user', userId], (oldData: getUserResponse) => {
        if (!oldData) return userId;

        const updatedUserMeta: UserMeta = {
          ...oldData.meta,
          isFollowing: !oldData.meta.isFollowing,
          followersCount: oldData.meta.followersCount + 1,
        };

        return { ...oldData, meta: updatedUserMeta };
      });
      setQueryDataFollowing(queryClient, userId, true);
      addFollow(userId, true);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  const unfollowMutation = useMutation({
    mutationKey: ['unfollow'],
    mutationFn: (userId: string) => usersService.unFollow(userId),
    onSuccess: (_, userId) => {
      queryClient.setQueryData(['user', userId], (oldData: getUserResponse) => {
        if (!oldData) return userId;

        const updatedUserMeta: UserMeta = {
          ...oldData.meta,
          isFollowing: !oldData.meta.isFollowing,
          followersCount: oldData.meta.followersCount - 1,
        };

        return { ...oldData, meta: updatedUserMeta };
      });
      setQueryDataFollowing(queryClient, userId, false);
      addFollow(userId, false);

      queryClient.invalidateQueries({ queryKey: ['following', userId] });
      queryClient.refetchQueries({
        queryKey: ['following', options?.userId],
        exact: true,
        type: 'active',
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  return {
    follow: {
      mutate: (userId?: string) =>
        followMutation.mutate(userId ?? options?.userId ?? ''),
      isPending: followMutation.isPending,
      isError: followMutation.isError,
      isSuccess: followMutation.isSuccess,
    },
    unfollow: {
      mutate: (userId?: string) =>
        unfollowMutation.mutate(userId ?? options?.userId ?? ''),
      isPending: unfollowMutation.isPending,
      isError: unfollowMutation.isError,
      isSuccess: unfollowMutation.isSuccess,
    },
  };
};
