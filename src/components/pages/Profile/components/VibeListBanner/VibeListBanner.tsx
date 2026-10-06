import { useTranslations } from 'next-intl';

export function VibeListBanner() {
  const t = useTranslations('VibeListBanner');
  const g = useTranslations('GlobalMessages');

  return (
    <div className='bg-light-peach relative w-full overflow-hidden rounded-3xl'>
      <div className='flex h-full flex-col justify-between gap-5 px-4 py-5 pb-5.5'>
        <div className='z-3 flex grow flex-col gap-3'>
          <div className='max-w-[150px] gap-3'>
            <h4 className='text-h25'>{t('title')}</h4>
          </div>
          <p className='text-m10 whitespace-pre-line'>{t('description')}</p>
          <p className='text-m10 text-purple-dark whitespace-pre-line'>
            {g('inProgress')}
          </p>
        </div>

        {/*<Button className='z-3' size='large' variant='default' fullWidth={true}>*/}
        {/*  {t('buttonText')}*/}
        {/*</Button>*/}

        <div className='absolute inset-y-0 right-0 flex aspect-square h-[calc(100%-22px)] flex-col overflow-hidden'>
          <div className='relative h-full w-full'>
            <div className='from-light-peach absolute top-0 left-0 z-2 h-[30%] w-full bg-linear-to-b to-transparent'></div>
            <div className='from-light-peach via-light-peach/81 absolute bottom-0 left-0 z-2 h-[95%] w-full bg-linear-to-t to-transparent'></div>
            <img
              className='absolute inset-y-0 right-4 z-1 h-[calc(100%-22px)] w-auto mask-b-from-50% mask-b-to-100% object-cover'
              src={'/assets/images/vibe-banner-bg.png'}
              alt=''
            />
          </div>
        </div>
      </div>
    </div>
  );
}
