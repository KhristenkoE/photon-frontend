import { create } from 'zustand';
import { Task } from '@/api';

interface EarnTasksStore {
  setTasks: (data: Task[]) => void;
  tasks: Task[];
}

export const useEarnTasksStore = create<EarnTasksStore>((set) => ({
  tasks: [],
  setTasks(data: Task[]) {
    set({ tasks: data });
  },
}));
