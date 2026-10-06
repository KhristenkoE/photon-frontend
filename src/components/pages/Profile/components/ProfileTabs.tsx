'use client';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import LandscapeIcon from '@/../public/assets/icons/landscape.svg';
import WaveIcon from '@/../public/assets/icons/waves.svg';
import MagicStickIcon from '@/../public/assets/icons/magic-stick.svg';
import { MomentsList } from './MomentsList';
import { useTranslations } from 'next-intl';
import { VibeListBanner } from '@/components/pages/Profile/components/VibeListBanner/VibeListBanner';
import { WishListBanner } from '@/components/pages/Profile/components/WishListBanner/WishListBanner';

export const ProfileTabs = () => {
  const t = useTranslations('ProfilePage');
  return (
    <nav className='h-full'>
      <Tabs>
        <TabList className='text-m10 mb-6 flex gap-1 rounded-xl bg-[#F2F2F2] p-1'>
          <Tab
            selectedClassName='bg-black outline-none text-white'
            className='flex h-10 w-full items-center justify-center gap-[3px] rounded-xl text-nowrap'
          >
            <LandscapeIcon className='h-4 w-4' />
            {t('moments')}
          </Tab>
          <Tab
            selectedClassName='bg-black outline-none text-white'
            className='flex h-10 w-full items-center justify-center gap-[3px] rounded-xl text-nowrap'
          >
            <WaveIcon className='h-4 w-4' />
            Vibelist
          </Tab>
          <Tab
            selectedClassName='bg-black outline-none text-white'
            className='flex h-10 w-full items-center justify-center gap-[3px] rounded-xl text-nowrap'
          >
            <MagicStickIcon className='h-4 w-4' />
            {t('wishlist')}
          </Tab>
        </TabList>

        <main className='h-full'>
          <TabPanel>
            <MomentsList />
          </TabPanel>
          <TabPanel>
            <VibeListBanner />
            {/*<VibeListCard imageUrl={'/assets/images/vibelistitem.png'} />*/}
            {/*<VibeListButton background={'#E3DFFA'} children={'Поделиться вайблистом'} />*/}
          </TabPanel>
          <TabPanel>
            <WishListBanner />
          </TabPanel>
        </main>
      </Tabs>
    </nav>
  );
};
