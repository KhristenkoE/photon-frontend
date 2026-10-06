import FilmLargeImage from '@/../public/assets/images/film-large.png';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export const FilmBanner = () => {
  const t = useTranslations('EarnPage.filmBanner');
  return (
    <article className='bg-light-peach relative overflow-hidden rounded-3xl p-8 pr-20'>
      <Image
        className='absolute right-0 bottom-0 h-[110px] w-[110px]'
        src={FilmLargeImage}
        alt=''
      />
      <h2 className='text-h30 text-black'>{t('title')}</h2>
      <p className='text-s10 mr-10 text-black'>{t('description')}</p>
    </article>
  );
};
