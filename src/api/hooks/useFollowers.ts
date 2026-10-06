import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users';

interface UseFollowersOptions {
  userId: string;
}

export const useFollowers = (options?: UseFollowersOptions) => {
  const getFollowersCountQuery = useQuery({
    queryKey: ['userFollowersCount', options?.userId],
    queryFn: () => usersService.getFollowersCount(options?.userId as string),
    enabled: !!options?.userId,
  });

  const getFollowingCountQuery = useQuery({
    queryKey: ['userFollowingCount', options?.userId],
    queryFn: () => usersService.getFollowingCount(options?.userId as string),
    enabled: !!options?.userId,
  });

  return {
    followersCount: {
      data: getFollowersCountQuery.data,
      isPending: getFollowersCountQuery.isPending,
      isError: getFollowersCountQuery.isError,
      isSuccess: getFollowersCountQuery.isSuccess,
    },
    followingCount: {
      data: getFollowingCountQuery.data,
      isPending: getFollowingCountQuery.isPending,
      isError: getFollowingCountQuery.isError,
      isSuccess: getFollowingCountQuery.isSuccess,
    },
  };
};
