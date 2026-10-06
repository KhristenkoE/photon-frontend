import { PropsWithChildren, useEffect } from 'react';
import { useEarnTasksStore } from '@/store/earnTasksStore';
import { useTasks } from '@/api';

export const GlobalDataProvider = ({ children }: PropsWithChildren) => {
  const { getTasks } = useTasks();
  const { data } = getTasks;
  const { setTasks } = useEarnTasksStore();

  useEffect(() => {
    if (data) setTasks(data);
  }, [data]);
  return children;
};
