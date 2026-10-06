import { useQuery } from '@tanstack/react-query';

import { usersService } from '../services/users';

export const useReferrals = (telegramId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['referrals'],
    queryFn: () => usersService.getReferrals(telegramId),
  });

  return { data, isLoading, error };
};

export const useFollowers = (telegramId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['followers', telegramId],
    queryFn: () => usersService.getFollowers(telegramId),
  });
  console.log(data, ' data');
  return { data, isLoading, error };
};

export const useFollowing = (telegramId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['following', telegramId],
    queryFn: () => usersService.getFollowing(telegramId),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  return { data, isLoading, error };
};
