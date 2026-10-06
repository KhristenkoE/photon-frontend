import { ReactNode } from 'react';
import { SparkBadge } from '@/components/ui';
import { useTasks } from '@/api';
import { useEarnTaskBottomSheetStore } from '@/store/useEarnTaskBottomSheetStore';

interface Props {
  task: {
    id: string;
    title: string;
    description: string;
    reward: number;
    icon: ReactNode;
  };
}

export const EarnTasksItem = ({
  task: { icon, reward, title, id, description },
}: Props) => {
  const { open } = useEarnTaskBottomSheetStore();

  const { getTaskById } = useTasks();
  const { refetch } = getTaskById(id);

  const onClick = async () => {
    const result = await refetch();
    if (result.data) open(result.data);
  };

  return (
    <div
      onClick={onClick}
      className='flex items-center gap-3 rounded-2xl px-4 py-2.5 drop-shadow-2xl'
      style={{
        boxShadow: '0 4px 15.3px  rgba(0, 0, 0, 0.1)',
      }}
    >
      <div>{icon}</div>
      <div>
        <h3 className='text-h50 text-black'>{title}</h3>
        <p className='text-[#A4A4A8]'>{description}</p>
      </div>
      <div className='ms-auto'>
        <SparkBadge value={reward} />
      </div>
    </div>
  );
};
