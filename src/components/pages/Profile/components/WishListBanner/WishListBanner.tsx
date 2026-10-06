import { useTranslations } from 'next-intl';

export function WishListBanner() {
  const t = useTranslations('WishListBanner');
  const g = useTranslations('GlobalMessages');

  return (
    <div className='relative w-full overflow-hidden rounded-3xl bg-[#f3f1ff]'>
      <div className='flex h-full flex-col justify-between gap-5 px-4 py-5 pb-5.5'>
        <div className='z-3 flex grow flex-col gap-3'>
          <div className='gap-3'>
            <h4 className='text-h25 whitespace-pre-line'>{t('title')}</h4>
          </div>
          <p className='text-m10 whitespace-pre-line'>{t('description')}</p>
          <p className='text-m10 text-purple-dark whitespace-pre-line'>
            {g('inProgress')}
          </p>
        </div>

        <div className='absolute inset-y-0 right-0 flex aspect-square h-[calc(100%-22px)] flex-col overflow-hidden'>
          <div className='relative h-full w-full'>
            <img
              className='absolute inset-y-0 right-4 z-1 h-[calc(100%-22px)] w-auto mask-b-from-50% mask-b-to-100% object-cover'
              src={'/assets/images/wishlist_banner_bg.png'}
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  );
}
