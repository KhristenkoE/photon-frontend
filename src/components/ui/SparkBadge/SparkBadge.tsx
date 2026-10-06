import Star2Icon from '../../../../public/assets/icons/star2.svg';
import Star3Icon from '../../../../public/assets/icons/star3.svg';
import { cn } from '@/lib/utils';

interface Props {
  value: number;
  isCollected?: boolean;
  className?: string;
}

export const SparkBadge = ({ value, className, isCollected }: Props) => {
  return (
    <div
      className={cn(
        'flex min-w-[34px] items-center justify-center gap-1 rounded-3xl px-1.5 py-1',
        isCollected ? 'bg-[#89DE8E] text-white' : 'bg-[#F3F1FF]',
        className,
      )}
    >
      <span>{value}</span>
      {isCollected ? (
        <Star3Icon className='h-3 w-3' />
      ) : (
        <Star2Icon className='h-3 w-3' />
      )}
    </div>
  );
};
