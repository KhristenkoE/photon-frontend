'use client';

import {
  isServer,
  Mutation,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { TaskCategory } from '@/api/constants';
import { tasksService } from '@/api';
import { useEarnTasksStore } from '@/store/earnTasksStore';
import { useEarnTaskBottomSheetStore } from '@/store/useEarnTaskBottomSheetStore';

const createMutationSuccessHandler = () => {
  return (
    data: unknown,
    variables: unknown,
    context: unknown,
    mutation: Mutation<unknown, unknown, unknown, unknown>,
  ) => {
    const taskCategory = mutation.options.meta?.taskCategory as TaskCategory;
    if (taskCategory) {
      const tasks = useEarnTasksStore.getState().tasks;
      const { open } = useEarnTaskBottomSheetStore.getState();

      const task = tasks.find((task) => task.category === taskCategory);

      if (
        task?.category === TaskCategory.Likes ||
        task?.category === TaskCategory.PublishPhotos ||
        task?.category === TaskCategory.SubscribeToUsers ||
        task?.category === TaskCategory.Comments
      ) {
        tasksService.verifyTask(task.id).then((res) => {
          if (res?.isCompleted) open({ ...task, isCompleted: true });
        });
      } else {
        console.error('Task not found for category:', TaskCategory.Likes);
      }
    }
  };
};

function makeQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: createMutationSuccessHandler(),
    }),
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
