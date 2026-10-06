import HeartTaskIcon from '@/../public/assets/icons/heart-task.svg';
import TgTaskIcon from '@/../public/assets/icons/tg-task.svg';
import IgTaskIcon from '@/../public/assets/icons/ig-task.svg';
import TtTaskIcon from '@/../public/assets/icons/tt-task.svg';
import UtubeTaskIcon from '@/../public/assets/icons/utube-task.svg';
import XTaskIcon from '@/../public/assets/icons/x-task.svg';
import PublishTaskIcon from '@/../public/assets/icons/publish-task.svg';
import AdTaskIcon from '@/../public/assets/icons/ad-task.svg';
import FriendTaskCompletedIcon from '@/../public/assets/icons/friends-task-completed.svg';
import { useEarnTasksStore } from '@/store/earnTasksStore';
import { TaskCategory } from '@/api/constants';
import { Task } from '@/api';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { usePluralize } from '@/utils/pluralize';

interface TaskItem {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: ReactNode;
}

export const useEarnTasks = () => {
  const { tasks } = useEarnTasksStore();
  const t = useTranslations('EarnPage.tasks');
  const { withPlural } = usePluralize();
  const taskMap = tasks.reduce<Record<TaskCategory, Task>>(
    (acc, task) => {
      acc[task.category] = task;
      return acc;
    },
    {} as Record<TaskCategory, Task>,
  );

  if (Object.keys(taskMap).length === 0) return { main: [], subscriptions: [] };

  const mainTasks: (TaskItem | null)[] = [
    taskMap[TaskCategory.PublishPhotos]?.id
      ? {
          id: taskMap[TaskCategory.PublishPhotos].id,
          title: withPlural({
            count: taskMap[TaskCategory.PublishPhotos].quantity,
            category: TaskCategory.PublishPhotos,
            withTo: true,
          }),
          description: t('descriptions.publish'),
          reward: taskMap[TaskCategory.PublishPhotos].reward,
          icon: <PublishTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeToUsers]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeToUsers].id,
          title: withPlural({
            count: taskMap[TaskCategory.SubscribeToUsers].quantity,
            category: TaskCategory.SubscribeToUsers,
            withTo: true,
          }),
          description: t('descriptions.subscribe_to_users'),
          reward: taskMap[TaskCategory.SubscribeToUsers].reward,
          icon: <FriendTaskCompletedIcon />,
        }
      : null,
    taskMap[TaskCategory.Likes]?.id
      ? {
          id: taskMap[TaskCategory.Likes].id,
          title: withPlural({
            count: taskMap[TaskCategory.Likes].quantity,
            category: TaskCategory.Likes,
            withTo: true,
          }),
          description: t('descriptions.likes'),
          reward: taskMap[TaskCategory.Likes].reward,
          icon: <HeartTaskIcon />,
        }
      : null,
    /*taskMap[TaskCategory.Comments]?.id
      ? {
          id: taskMap[TaskCategory.Comments].id,
          title: withPlural({
            count: taskMap[TaskCategory.Comments].quantity,
            category: TaskCategory.Comments,
            withTo: true,
          }),
          description: t('descriptions.comments'),
          reward: taskMap[TaskCategory.Comments].reward,
          icon: <MessageTaskIcon />,
        }
      : null,*/
    taskMap[TaskCategory.AdView]?.id
      ? {
          id: taskMap[TaskCategory.AdView].id,
          title: withPlural({
            count: taskMap[TaskCategory.AdView].quantity,
            category: TaskCategory.AdView,
            withTo: true,
          }),
          description: t('descriptions.ad_view'),
          reward: taskMap[TaskCategory.AdView].reward,
          icon: <AdTaskIcon />,
        }
      : null,
  ];

  const subscriptionTasks: (TaskItem | null)[] = [
    taskMap[TaskCategory.SubscribeChannel]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeChannel].id,
          title: t('titles.telegramNews'),
          description: t('descriptions.telegramNews'),
          reward: taskMap[TaskCategory.SubscribeChannel].reward,
          icon: <TgTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeChat]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeChat].id,
          title: t('titles.telegramChat'),
          description: t('descriptions.telegramChat'),
          reward: taskMap[TaskCategory.SubscribeChat].reward,
          icon: <TgTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeInstagram]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeInstagram].id,
          title: t('titles.instagram'),
          description: t('descriptions.instagram'),
          reward: taskMap[TaskCategory.SubscribeInstagram].reward,
          icon: <IgTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeTikTok]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeTikTok].id,
          title: t('titles.tiktok'),
          description: t('descriptions.tiktok'),
          reward: taskMap[TaskCategory.SubscribeTikTok].reward,
          icon: <TtTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeYoutube]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeYoutube].id,
          title: t('titles.youtube'),
          description: t('descriptions.youtube'),
          reward: taskMap[TaskCategory.SubscribeYoutube].reward,
          icon: <UtubeTaskIcon />,
        }
      : null,
    taskMap[TaskCategory.SubscribeX]?.id
      ? {
          id: taskMap[TaskCategory.SubscribeX].id,
          title: t('titles.x'),
          description: t('descriptions.x'),
          reward: taskMap[TaskCategory.SubscribeX].reward,
          icon: <XTaskIcon />,
        }
      : null,
  ];

  const main = mainTasks.filter((task): task is TaskItem => task !== null);
  const subscriptions = subscriptionTasks.filter(
    (task): task is TaskItem => task !== null,
  );

  return {
    main,
    subscriptions,
  };
};
