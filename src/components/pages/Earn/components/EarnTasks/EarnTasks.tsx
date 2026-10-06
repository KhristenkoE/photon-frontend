import Star2Icon from '../../../../../../public/assets/icons/star2.svg';
import { useEarnTasks } from '@/components/pages/Earn/hooks';
import { EarnTasksItem } from '@/components/pages/Earn/components';
import { useTranslations } from 'next-intl';

export const EarnTasks = () => {
  const { subscriptions, main } = useEarnTasks();
  const t = useTranslations('EarnPage');

  return (
    <section className='mt-7 pb-32'>
      <div className='mb-6 flex items-center gap-1'>
        <h2 className='text-h25 text-black'>{t('earnSpark')}</h2>
        <Star2Icon className='mt-0.5 h-[18px] w-[18px]' />
      </div>

      <ul className='flex flex-col gap-3'>
        {main.map((item) => (
          <EarnTasksItem task={item} key={item.title} />
        ))}
      </ul>

      <h2 className='text-h50 my-3 pt-2 text-[#A4A4A8]'>
        {t('socialSubscriptions')}
      </h2>

      <ul className='flex flex-col gap-3'>
        {subscriptions.map((item) => (
          <EarnTasksItem task={item} key={item.title} />
        ))}
      </ul>
    </section>
  );
};
