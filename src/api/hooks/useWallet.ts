import { useMutation } from '@tanstack/react-query';
import { walletService } from '@/api/services/wallet';
import { useToast } from '@/hooks/useToast';

export const useWallet = () => {
  const { showSuccess, showError } = useToast();

  const createWalletMutation = useMutation({
    mutationFn: (address: string) => walletService.createWallet(address),
    onSuccess: () => {
      showSuccess({
        message: 'Wallet connected successfully',
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  const deleteWalletMutation = useMutation({
    mutationFn: () => walletService.deleteWallet(),
    onSuccess: () => {
      showSuccess({
        message: 'Wallet disconnected successfully',
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        showError({
          message: error.message,
        });
      }
    },
  });

  return {
    createWallet: createWalletMutation,
    deleteWallet: deleteWalletMutation,
  };
};
