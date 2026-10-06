import { useRouter } from '@/i18n/navigation';
import { backButton } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export function useBackButton({
  onClick,
  withoutHide,
  isEnabled = true,
}: { onClick?: () => void; withoutHide?: boolean; isEnabled?: boolean } = {}) {
  const router = useRouter();
  useEffect(() => {
    if (isEnabled) {
      backButton.show();
    }
    const removeListener = backButton.onClick(() => {
      if (!onClick) {
        router.back();
      } else {
        onClick();
      }

      if (!withoutHide) {
        backButton.hide();
      }
      removeListener();
    });

    return () => {
      removeListener();
    };
  }, []);
}
