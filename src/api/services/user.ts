import { apiClient, UserFund } from '@/api';

export const userService = {
  /**
   * Retrieves user's funds information
   * @returns {Promise<UserFund[]>} Promise containing user funds data
   */
  async getUserFunds(): Promise<UserFund[]> {
    const res = await apiClient.get<{ data: UserFund[] }>('/users/funds');
    return res.data;
  },
};
