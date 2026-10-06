import { apiClient, Task } from '@/api';
import { VerifyResponse } from '@/api/types/tasks';

export const tasksService = {
  /**
   * Get all tasks
   * @returns {Promise<Task[]>} Promise that resolves with the list of tasks
   */
  getTasks: async (): Promise<Task[]> => {
    const res = await apiClient.get<{ data: Task[] }>('/tasks');
    return res.data;
  },

  /**
   * Get a task by its ID
   * @param {string} taskId - The ID of the task to get
   * @returns {Promise<Task>} Promise that resolves with the task details
   */
  getTaskById: async (taskId: string): Promise<Task> => {
    return apiClient.get<Task>(`/tasks/${taskId}`);
  },

  /**
   * Verifies a task by its ID
   * @param {string} taskId - The ID of the task to verify
   * @returns {Promise<VerifyResponse | {message: string, code: string, isCompleted: boolean}>} Promise that resolves when the task is verified
   */
  verifyTask: async (taskId: string) => {
    try {
      return await apiClient.post<VerifyResponse>(`/tasks/verify/${taskId}`);
    } catch (error: any) {
      if (error.status === 406 && error.details) {
        return {
          message: error.details.message as string,
          code: error.details.code as string,
          isCompleted: error.details.message === 'Task already completed',
        };
      }
      // optionally rethrow or handle other errors
      console.error('Unexpected error:', error);
    }
  },

  /**
   * Receives a reward for a completed task
   * @param {string} taskId - The ID of the task to receive reward for
   * @returns {Promise<void>} Promise that resolves when the reward is received
   */
  receiveReward: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/receive-reward/${taskId}`);
    // return response.data;
  },
};
