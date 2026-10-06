import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user';

export const useUserFunds = () => {
  const getUserFunds = useQuery({
    queryKey: ['userFunds'],
    queryFn: () => userService.getUserFunds(),
  });

  return {
    getUserFunds,
  };
};
