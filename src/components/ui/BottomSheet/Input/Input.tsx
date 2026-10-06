import { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  invalid?: boolean;
};
export const Input = ({ invalid, ...props }: Props) => {
  if (props.type == 'checkbox') {
    return (
      <label>
        <input {...props} className={cn('sr-only', props.className)} />
        {props.checked ? (
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x='0.5'
              y='0.5'
              width='15'
              height='15'
              rx='3.5'
              fill='#8C7BF6'
            />
            <rect
              x='0.5'
              y='0.5'
              width='15'
              height='15'
              rx='3.5'
              stroke='#8C7BF6'
            />
            <path
              d='M12 5L6.5 10.5L4 8'
              stroke='white'
              stroke-width='1.6666'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        ) : (
          <div
            className={cn('border-ot h-4 w-4 rounded-sm border', {
              'border-other-error': invalid,
              'border-[#D5D7DA]': !invalid,
            })}
          />
        )}
      </label>
    );
  }
  return <input {...props} />;
};
