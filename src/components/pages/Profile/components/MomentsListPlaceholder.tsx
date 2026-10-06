import MomentsImage from '@/../public/assets/images/moments_placeholder.png';
import EmptyProfileImage from '@/../public/assets/images/empty-profile-bg.png';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { useBottomSheetStore, useUserStore } from '@/store';
import { useMomentListItems } from '@/components/common/Navigation/hooks/useMomentListItems';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export const MomentsListPlaceholder = () => {
  const { open } = useBottomSheetStore();
  const momentsList = useMomentListItems();
  const t = useTranslations('ProfilePage.momentBanner');
  const searchParams = useSearchParams();
  const userTgId = Number(searchParams.get('userTgId'));

  const myTgId = useUserStore((state) => state.user?.telegramId);

  const onClick = () => {
    open(momentsList);
  };

  if (userTgId && userTgId !== myTgId) {
    return (
      <div>
        <Image
          className='h-full w-full object-cover object-center'
          src={EmptyProfileImage}
          alt=''
        />
      </div>
    );
  }

  return (
    <article className='bg-purple-light overflow-hidden rounded-3xl py-5'>
      <div className='flex pl-4'>
        <div className='mb-5'>
          <h2 className='text-h25 mb-3'>{t('title')}</h2>
          <p className='text-m10'>{t('description')}</p>
        </div>
        <Image src={MomentsImage} alt='' />
      </div>
      <div className='px-4'>
        <Button
          onClick={onClick}
          className='w-full'
          size='large'
          variant='default'
        >
          {t('create')}
        </Button>
      </div>
    </article>
  );
};
