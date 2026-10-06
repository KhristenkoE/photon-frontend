'use client';
import { WithNavigation } from '@/hoc/WithNavigation';
import { EarnTasks, FilmBanner, Wallet } from './components';

const EarnComponent = () => {
  return (
    <div className='h-screen-height overflow-y-auto'>
      <Wallet />
      <div className='mt-6 px-4'>
        <FilmBanner />
        <EarnTasks />
        {/*<DailyRewards />*/}
      </div>
    </div>
  );
};

export const Earn = WithNavigation(EarnComponent, 'light');
