import { useTranslations } from 'next-intl';
import PenIcon from '@/../public/assets/icons/pen.svg';
import { useBottomSheetStore, useUserStore } from '@/store';
import { useMomentActionItems } from '@/components/common/Navigation/hooks/useMomentActionItems';
import { useSearchParams } from 'next/navigation';

export function MomentTopNavigation() {
  const t = useTranslations('ProfilePage');
  const searchParams = useSearchParams();
  const userTgId = Number(searchParams.get('userTgId'));
  const myTgId = useUserStore((state) => state.user?.telegramId);
  const { open } = useBottomSheetStore();
  const list = useMomentActionItems();
  const openBottomSheet = () => open(list);

  return (
    <div className='top-safe-content-top absolute right-0 left-0 z-[var(--feed-ui-z-index)] text-white'>
      <div className='flex items-center justify-between px-[var(--container-x-padding)] py-6'>
        <h2 className='text-h25 text-shadow-sm'>{t('moments')}</h2>
        {userTgId === myTgId ? (
          <PenIcon
            onClick={openBottomSheet}
            className='h-8 w-8 drop-shadow-lg'
          />
        ) : null}
      </div>
    </div>
  );
}
