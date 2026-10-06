import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users';
import {
  getUserMeResponse,
  UpdateUserProfileRequest,
  UserMe,
} from '../types/types';

export const useUserMe = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => usersService.getUserMe(),
  });

  const updateUserProfileMutation = useMutation({
    mutationKey: ['updateUserProfile'],
    mutationFn: (data: UpdateUserProfileRequest) =>
      usersService.updateUserProfile(data),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['user'], (oldData: getUserMeResponse) => {
        if (!oldData) return variables;

        const oldUserData = oldData.data;

        const updatedUser: UserMe = {
          ...oldUserData,
          profile: {
            ...oldUserData.profile,
            avatar: {
              ...oldUserData?.profile?.avatar,
              key:
                variables?.profile?.avatarKey ??
                oldUserData?.profile?.avatar.key,
            },
            bio: variables?.profile?.bio ?? oldUserData?.profile?.bio,
            settings: {
              privacyType:
                variables?.settings?.privacyType ??
                oldUserData?.profile?.settings?.privacyType,
              requireFollowVerification:
                variables?.settings?.requireFollowVerification ??
                oldUserData?.profile?.settings?.requireFollowVerification,
            },
          },
        };

        return { ...oldData, data: updatedUser };
      });
    },
  });

  return {
    user: {
      data: data,
      isLoading,
      error,
    },
    updateUserProfile: updateUserProfileMutation,
  };
};
