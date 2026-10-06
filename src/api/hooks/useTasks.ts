import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/api';

export const useTasks = (taskId?: string) => {
  const queryClient = useQueryClient();

  const getTasks = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksService.getTasks(),
  });

  const getTaskById = (taskId: string) =>
    useQuery({
      queryKey: ['tasks', taskId],
      queryFn: () => tasksService.getTaskById(taskId),
      enabled: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const verifyTask = useMutation({
    mutationFn: async (taskId: string) => {
      return await tasksService.verifyTask(taskId);
    },
  });

  const receiveReward = useMutation({
    mutationFn: (taskId: string) => tasksService.receiveReward(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userFunds'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });

  return {
    getTasks,
    getTaskById,
    verifyTask,
    receiveReward,
  };
};
