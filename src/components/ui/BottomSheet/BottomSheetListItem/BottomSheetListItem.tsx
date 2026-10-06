import { BottomSheetListItemProps } from './types';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const BottomSheetListItem = ({
  subtitle,
  onClick,
  icon: Icon,
  title,
  extraSubtitle,
  isSoon,
  color = 'text-black',
}: BottomSheetListItemProps) => {
  const t = useTranslations('Navigation');
  const currentColor = isSoon ? 'text-[var(--third-text-color)]' : color;

  return (
    <button
      onClick={onClick}
      disabled={isSoon}
      className='flex justify-between gap-3 px-4 py-[14px]'
    >
      <div
        className={cn('flex gap-3 text-start', {
          'items-start': subtitle,
          'items-center': !subtitle,
        })}
      >
        {Icon && <Icon width='24px' height='24px' className={currentColor} />}
        <div>
          <div className={`text-l20 ${currentColor}`}>{title}</div>
          <div className='text-s20'>
            {subtitle ? (
              <span
                className={`text-[#A4A4A8] ${isSoon ? 'text-[var(--third-text-color)]' : ''}`}
              >
                {subtitle}
              </span>
            ) : null}
            {extraSubtitle ? (
              <span className='text-purple-dark'> {extraSubtitle}</span>
            ) : null}
          </div>
        </div>
      </div>
      {isSoon && (
        <div className='text-l20 justify-self-end text-[var(--purple-color)] text-[var(font-cygre)]'>
          {t('soon')}
        </div>
      )}
    </button>
  );
};
