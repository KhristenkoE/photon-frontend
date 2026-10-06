'use client';

import { WithNavigation } from '@/hoc/WithNavigation';

import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { useBackButton } from '@/hooks/useBackButton';
function FriendsComponent() {
  useBackButton();

  return (
    <div className='h-screen-height overflow-y-auto bg-[#FEFEFE] pb-[130px]'>
      <div className='mb-[24px]'>
        <Header />
      </div>
      <Tabs />
    </div>
  );
}

export const Friends = WithNavigation(FriendsComponent, 'light');
