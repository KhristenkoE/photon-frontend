import { Bounce, toast } from 'react-toastify';

interface ToastOptions {
  message: string;
  onClose?: () => void;
  onOpen?: () => void;
}

export function useToast() {
  const showSuccess = ({ message, onClose, onOpen }: ToastOptions) => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      draggablePercent: 20,
      closeButton: false,
      theme: 'colored',
      transition: Bounce,
      className: 'text-m10',
      onClose,
      onOpen,
    });
  };

  const showError = ({ message, onClose, onOpen }: ToastOptions) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      draggablePercent: 20,
      closeButton: false,
      theme: 'colored',
      transition: Bounce,
      className: 'text-m10',
      onClose,
      onOpen,
    });
  };

  return {
    showSuccess,
    showError,
  };
}
