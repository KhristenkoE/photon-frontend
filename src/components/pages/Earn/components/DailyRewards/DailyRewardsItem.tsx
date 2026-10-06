import { SparkBadge } from '@/components/ui';
import SparkBlackWhiteImage from '@/../public/assets/images/spark-black-white.png';
import SparkColoredImage from '@/../public/assets/images/spark-colored.png';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Props {
  day: number;
  isCollected?: boolean;
  reward: number;
  filled?: boolean;
  className?: string;
  isHorizontal?: boolean;
}

export const DailyRewardsItem = ({
  day,
  isCollected,
  reward,
  filled,
  isHorizontal,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border pt-2 pb-3',
        {
          'border-transparent bg-[#F4F4F4]': isCollected && !filled,
          'border-dashed border-[#E0E0E0]': !isCollected && !filled,
          'bg-purple-dark border-transparent text-white': isCollected && filled,
          'border-transparent bg-white': !isCollected && filled,
          'flex-row justify-between gap-2 px-4 py-3': isHorizontal,
        },
        className,
      )}
    >
      <Image
        className='h-9 w-[34px] object-cover'
        src={isCollected ? SparkBlackWhiteImage : SparkColoredImage}
        alt=''
      />
      <h3 className={cn('text-h50 text-#1E1E1E', !isHorizontal && 'mb-3')}>
        День {day}
      </h3>
      <SparkBadge
        className={cn(isHorizontal && 'ms-auto')}
        isCollected={isCollected}
        value={reward}
      />
    </div>
  );
};
