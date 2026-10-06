import { cn } from '@/lib/utils';
import CheckSelectIcon from '/public/assets/icons/check-select.svg';

interface Props {
  onClick: () => void;
  selected: boolean;
  title: string;
}

export const ProfileEditSelectItem = ({ onClick, selected, title }: Props) => {
  return (
    <button onClick={onClick} className={'flex gap-3 px-4 py-3.5 text-start'}>
      <div className='text-l20 flex h-[24px] w-full items-center justify-between'>
        <div
          className={cn({
            'text-purple-dark': selected,
            'text-black': !selected,
          })}
        >
          {title}
        </div>
        {selected && <CheckSelectIcon />}
      </div>
    </button>
  );
};
