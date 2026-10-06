import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { momentsService } from '@/api/services/moments';
import {
  CreateMomentRequest,
  Moment,
  MomentsResponse,
  UpdateMomentRequest,
} from '@/api/types/types';
import { useToast } from '@/hooks/useToast';
import { TaskCategory } from '@/api/constants';

interface UseMomentsOptions {
  userTgId?: string | number;
  userId?: string;
  pageSize?: number;
  momentId?: string;
}

export function useMoments(options?: UseMomentsOptions) {
  const queryClient = useQueryClient();
  const { showError } = useToast();

  // Query for fetching moments with pagination
  const momentsQuery = useInfiniteQuery({
    queryKey: ['moments', options?.userTgId],
    queryFn: async ({ pageParam = 0 }) => {
      if (!options?.userTgId) return null;

      return momentsService.getMoments({
        userTgId: options.userTgId,
        offset: pageParam * (options.pageSize ?? 9),
        limit: options.pageSize ?? 9,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.meta?.hasNext) return undefined;
      return lastPage.meta.hasNext ? allPages.length : undefined;
    },
    enabled: !!options?.userTgId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Mutations for creating, updating and deleting moments
  const createMomentMutation = useMutation({
    meta: {
      taskCategory: TaskCategory.PublishPhotos,
    },
    mutationFn: (data: CreateMomentRequest) =>
      momentsService.createMoment(data),
    onSuccess: (newMoment) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      // Update all moment queries for this user
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments', options?.userTgId] },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                {
                  data: [newMoment],
                  meta: {
                    count: 1,
                    hasNext: false,
                  },
                },
              ],
              pageParams: [0],
            };
          }

          // Add new moment to the first page
          const newPages = [...oldData.pages];
          if (newPages[0]) {
            const totalCount = oldData.pages.reduce(
              (acc, page) => acc + page.meta.count,
              0,
            );
            newPages[0] = {
              ...newPages[0],
              data: [newMoment, ...newPages[0].data],
              meta: {
                ...newPages[0].meta,
                count: totalCount + 1,
                hasNext: totalCount + 1 > (options?.pageSize ?? 9),
              },
            };
          } else {
            newPages[0] = {
              data: [newMoment],
              meta: {
                count: 1,
                hasNext: false,
              },
            };
          }

          return {
            ...oldData,
            pages: newPages,
          };
        },
      );

      // Also update the single moment query
      queryClient.setQueryData(['moment', newMoment.id], newMoment);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  const updateMomentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMomentRequest }) =>
      momentsService.updateMoment(id, data),
    onSuccess: (updatedMoment) => {
      // Update all moment queries for this user
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments', options?.userTgId] },
        (oldData) => {
          if (!oldData) {
            return {
              pages: [
                {
                  data: [updatedMoment],
                  meta: { count: 1, hasNext: false },
                },
              ],
              pageParams: [0],
            };
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((moment) =>
                moment.id === updatedMoment.id ? updatedMoment : moment,
              ),
            })),
          };
        },
      );

      // Also update the single moment query
      queryClient.setQueryData(['moment', updatedMoment.id], updatedMoment);
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  const deleteMomentMutation = useMutation({
    mutationFn: (momentId: string) => momentsService.deleteMoment(momentId),
    onSuccess: (_, momentId) => {
      // Update all moment queries
      queryClient.setQueriesData<InfiniteData<MomentsResponse>>(
        { queryKey: ['moments', options?.userTgId] },
        (oldData) => {
          if (!oldData) return { pages: [], pageParams: [] };

          const newPages = oldData.pages.map((page) => {
            const filteredData = page.data.filter(
              (moment: Moment) => moment.id !== momentId,
            );
            return {
              ...page,
              data: filteredData,
              meta: {
                ...page.meta,
                count: page.meta.count - 1,
              },
            };
          });

          const nonEmptyPages = newPages.filter((page) => page.data.length > 0);

          if (nonEmptyPages.length === 0) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          return {
            ...oldData,
            pages: nonEmptyPages,
          };
        },
      );

      // Remove the single moment query
      queryClient.removeQueries({ queryKey: ['moment', momentId] });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  // Query for fetching single moment
  const getMomentQuery = useQuery({
    queryKey: ['moment', options?.momentId],
    queryFn: () => momentsService.getMoment(options?.momentId as string),
    enabled: !!options?.momentId,
  });

  // Return combined object with all functions and data
  return {
    // Query data
    query: {
      data: momentsQuery.data,
      isPending: momentsQuery.isPending,
      isError: momentsQuery.isError,
      error: momentsQuery.error,
      fetchNextPage: momentsQuery.fetchNextPage,
      hasNextPage: momentsQuery.hasNextPage,
      isFetchingNextPage: momentsQuery.isFetchingNextPage,
    },
    // Single moment query
    moment: {
      data: getMomentQuery.data,
      isPending: getMomentQuery.isPending,
      isError: getMomentQuery.isError,
      error: getMomentQuery.error,
    },
    // Mutations
    createMoment: {
      mutate: createMomentMutation.mutate,
      mutateAsync: createMomentMutation.mutateAsync,
      isPending: createMomentMutation.isPending,
      isError: createMomentMutation.isError,
      isSuccess: createMomentMutation.isSuccess,
    },
    updateMoment: {
      mutate: updateMomentMutation.mutate,
      mutateAsync: updateMomentMutation.mutateAsync,
      isPending: updateMomentMutation.isPending,
      isError: updateMomentMutation.isError,
      isSuccess: updateMomentMutation.isSuccess,
    },
    deleteMoment: {
      mutate: deleteMomentMutation.mutate,
      mutateAsync: deleteMomentMutation.mutateAsync,
      isPending: deleteMomentMutation.isPending,
      isError: deleteMomentMutation.isError,
      isSuccess: deleteMomentMutation.isSuccess,
    },
  };
}
