import { FollowUser } from '@/api';
import { ImageByKey } from '@/components/ui/ImageByKey/ImageByKey';
import { getUsername } from '@/utils/getUsername';
import { useRouter } from '@/i18n/navigation';
import { ReactElement } from 'react';

interface ListProps {
  title: string;
  items: FollowUser[];
  action?: (userTgId: string) => ReactElement;
}

export function List({ title, items, action }: ListProps) {
  return (
    <div>
      <span className='text-h25 mb-[14px] inline-block px-[16px]'>{title}</span>
      <div className='flex flex-col'>
        {items.map((item) => (
          <Item key={item.telegramId} user={item} action={action} />
        ))}
      </div>
    </div>
  );
}

function Item({
  user,
  action,
}: {
  user: FollowUser;
  action?: (userTgId: string) => ReactElement;
}) {
  const router = useRouter();
  const username = getUsername(user.username, user.name, user.surname);

  if (!user) return null;
  return (
    <div className='flex h-[52px] justify-between gap-2.5 px-[16px]'>
      <button
        onClick={() => router.push(`/profile/${user.telegramId}`)}
        className='flex h-full w-full items-center gap-2.5'
      >
        <ImageByKey
          imgKey={user?.profile?.avatar?.key}
          imgUrl={user?.profile?.avatar?.url}
          className='h-[32px] w-[32px] rounded-[12px] object-cover'
        />
        <span className='text-h50'>{username}</span>
      </button>
      {action && action(String(user?.telegramId))}
    </div>
  );
}
