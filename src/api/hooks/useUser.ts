'use client';

import { useQuery } from '@tanstack/react-query';
import { usersService } from '../services/users';

interface UseUserOptions {
  userId?: string;
  me?: boolean;
}

export const useUser = ({ userId, me = false }: UseUserOptions) => {
  const getUserQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersService.getUser(userId as string),
    enabled: !!userId && !me,
  });

  const getUserMeQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => usersService.getUserMe(),
    enabled: me,
  });

  return {
    user: {
      data: me ? getUserMeQuery.data : getUserQuery.data,
      isPending: me ? getUserMeQuery.isPending : getUserQuery.isPending,
      isError: me ? getUserMeQuery.isError : getUserQuery.isError,
      isSuccess: me ? getUserMeQuery.isSuccess : getUserQuery.isSuccess,
    },
  };
};
