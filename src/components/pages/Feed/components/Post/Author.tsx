import { Avatar } from './Avatar';
import { Username } from './Username';
import { SubscribeButton } from './SubscribeButton';
import { UserType } from '@/api/types/posts';
import { useRouter } from 'next/navigation';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { useUserStore } from '@/store';
import { useFollowToUser, useUnfollowFromUser } from '@/api/hooks/usePosts';
import { useCallback } from 'react';
import { getUsername } from '@/utils/getUsername';

interface AuthorProps {
  isFollowing: boolean;
  user: UserType;
}

export function Author({ isFollowing, user: postUser }: AuthorProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const { mutate: follow } = useFollowToUser();
  const { mutate: unfollow } = useUnfollowFromUser();
  const launchParams = retrieveLaunchParams();
  // TODO: improve
  const lang =
    launchParams.tgWebAppData?.user?.language_code === 'ru' ? 'ru' : 'en';
  const isMyPost = Number(postUser.telegramId) === user?.telegramId;
  const username = getUsername(
    postUser.username,
    postUser.name,
    postUser.surname,
  );

  const handleClick = () => {
    router.push(`/${lang}/profile/${postUser.telegramId}`);
  };

  const handleFollow = useCallback((isFollow: boolean) => {
    if (user?.id) {
      if (isFollow) {
        follow(postUser?.telegramId);
      } else {
        unfollow(postUser?.telegramId);
      }
    }
  }, []);

  return (
    <div className='flex items-center gap-3'>
      <button
        onClick={handleClick}
        className={`flex items-center gap-3 ${isMyPost ? 'ph-no-capture' : ''}`}
      >
        <Avatar imgKey={postUser.imgKey} imgUrl={postUser.imgUrl} />
        <Username username={username} />
      </button>
      {!isFollowing && !isMyPost ? (
        <SubscribeButton handleFollow={() => handleFollow(true)} />
      ) : isFollowing && !isMyPost ? (
        <SubscribeButton
          handleFollow={() => handleFollow(false)}
          isFollow={false}
        />
      ) : null}
    </div>
  );
}
