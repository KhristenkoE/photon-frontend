'use client';

import { ReactNode } from 'react';
import { AppCustomBottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui';
import {
  DailyRewardsItem,
  EarnTaskBottomSheet,
} from '@/components/pages/Earn/components';
import { useDailyRewards } from '@/components/pages/Earn/hooks';
import { cn } from '@/lib/utils';
import { useEarnTaskBottomSheetStore } from '@/store/useEarnTaskBottomSheetStore';

export function RewardProvider({ children }: { children: ReactNode }) {
  const { isDailyOpen, toggleDaily } = useEarnTaskBottomSheetStore();
  const rewards = useDailyRewards();

  return (
    <>
      <EarnTaskBottomSheet />
      <AppCustomBottomSheet isOpen={isDailyOpen} setIsOpen={toggleDaily}>
        <div className='ray-bg flex flex-col items-center justify-center px-4 pb-8 text-center'>
          <ul className='mt-10 mb-4 grid w-full grid-cols-3 gap-1.5 px-[30px]'>
            {rewards.map((item, index) => (
              <li
                key={item.day}
                className={cn(
                  'h-[115px]',
                  index === rewards.length - 1 ? 'col-span-3 h-[60px]' : '',
                )}
              >
                <DailyRewardsItem
                  filled
                  reward={item.reward}
                  day={item.day}
                  isCollected={item.day < 3}
                  isHorizontal={index === rewards.length - 1}
                />
              </li>
            ))}
          </ul>
          <h2 className='text-h20 mb-1 text-black'>Получена награда</h2>
          <p className='text-l10 mb-8 text-black'>
            Заходи ежедневно без перерывов, чтобы получить новые награды
          </p>
          <Button fullWidth size='large' variant='purple'>
            Забрать награду — 1 ✦
          </Button>
        </div>
      </AppCustomBottomSheet>
      {children}
    </>
  );
}
