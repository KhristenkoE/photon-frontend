import { apiClient } from '@/api';
import { Wallet } from '@/api/types/wallet';

export const walletService = {
  getWallet: async () => {
    const res = await apiClient.get<{ data: Wallet }>('/users/wallet');
    return res.data;
  },
  createWallet: async (address: string) => {
    return await apiClient.post<Wallet>('/users/wallet', { address });
  },
  deleteWallet: async () => {
    await apiClient.delete('/users/wallet');
  },
};
