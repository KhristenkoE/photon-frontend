import { AppCustomBottomSheet } from '@/components/ui/BottomSheet';
import Image from 'next/image';
import EarnRewardImage from '@/../public/assets/images/earn-reward.png';
import CheckIcon from '@/../public/assets/icons/check.svg';
import { Button } from '@/components/ui';
import RiveComponent from '@rive-app/react-canvas';
import { cn } from '@/lib/utils';
import { useEarnTaskBottomSheetStore } from '@/store/useEarnTaskBottomSheetStore';
import { useTasks } from '@/api';
import { TaskCategory } from '@/api/constants';
import { useEffect, useRef, useState } from 'react';
import { useCreateListItems } from '@/components/common/Navigation/hooks/useCreateListItems';
import { useBottomSheetStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { usePluralize } from '@/utils/pluralize';
import { showRewardedAd } from '@/utils/showRewardedAd';
import CountdownToMidnight from '@/components/common/Countdown/CountdownToMidnight';

const linksMap = {
  [TaskCategory.SubscribeChannel]:
    process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL || '',
  [TaskCategory.SubscribeChat]: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_URL || '',
  [TaskCategory.SubscribeInstagram]:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  [TaskCategory.SubscribeTikTok]:
    process.env.NEXT_PUBLIC_TIKTOK_URL || '',
  [TaskCategory.SubscribeYoutube]:
    process.env.NEXT_PUBLIC_YOUTUBE_URL || '',
  [TaskCategory.SubscribeX]:
    process.env.NEXT_PUBLIC_X_URL || '',
};

export const EarnTaskBottomSheet = () => {
  const { open } = useBottomSheetStore();
  const router = useRouter();
  const t = useTranslations('EarnPage.tasks');
  const createListItems = useCreateListItems();
  const { isOpen, close, history, updateHistory } =
    useEarnTaskBottomSheetStore();
  const currentTask = history[history.length - 1];
  const { receiveReward, verifyTask } = useTasks(currentTask?.id);
  const { mutate: getReward } = receiveReward;
  const { withPlural } = usePluralize();

  const { mutate: verifyTaskReward } = verifyTask;

  const waitForReturn = useRef(false);
  const hasExecutedAfterReturn = useRef(false);

  const [isMaxProgress, setIsMaxProgress] = useState(false);

  const quantity = currentTask?.quantity ?? 0;
  const progress = currentTask?.progress ?? 0;

  useEffect(() => {
    const value =
      currentTask?.isCompleted ||
      (Math.max(quantity, progress, 0) > 0 && progress >= quantity);
    setIsMaxProgress(value);
  }, [currentTask?.isCompleted, quantity, progress]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        waitForReturn.current &&
        !hasExecutedAfterReturn.current
      ) {
        hasExecutedAfterReturn.current = true;

        verifyTaskReward(currentTask.id, {
          onSuccess: (res) => {
            if (res?.isCompleted) {
              setIsMaxProgress(true);
            }
          },
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentTask]);

  if (!currentTask) return null;

  const onClose = () => {
    close();
  };

  const onReceiveAdReward = () => {
    if (currentTask.receivable) {
      verifyTaskReward(currentTask.id, {
        onSuccess: (res) => {
          if (res?.isCompleted) {
            getReward(currentTask.id, {
              onSuccess: () => {
                updateHistory((task) => ({
                  ...task,
                  receivable: false,
                }));
              },
            });
          }
        },
      });
    } else {
      showRewardedAd();
    }
  };

  const onClick = () => {
    if (isMaxProgress) {
      verifyTaskReward(currentTask.id, {
        onSuccess: (res) => {
          if (res?.isCompleted) {
            getReward(currentTask.id, {
              onSuccess: async () => {
                close();
              },
            });
          }
        },
      });
      return;
    }

    const link = linksMap[currentTask.category as keyof typeof linksMap];
    if (link) {
      waitForReturn.current = true;
      hasExecutedAfterReturn.current = false;
      window.open(link, '_blank', 'noopener,noreferrer');
      return;
    }

    switch (currentTask.category) {
      case TaskCategory.PublishPhotos:
        close();
        open({ title: createListItems.title, list: createListItems.list });
        break;
      case TaskCategory.Likes:
      case TaskCategory.SubscribeToUsers:
      case TaskCategory.Comments:
        close();
        router.push('/feed');
        break;
      case TaskCategory.AdView:
        showRewardedAd();
        break;
    }
  };

  const buttonText = t(`buttons.${currentTask.category}`);

  const taskTitle = `${t(`actions.${currentTask.category}`)} ${withPlural({
    count: quantity,
    category: currentTask.category,
  })}`;

  const getTaskSubtitle = () => {
    if (currentTask.category === TaskCategory.AdView) {
      return (
        <>
          {t('new_ads_after')} <CountdownToMidnight /> <br />{' '}
          {t('spark_per_view', { reward: currentTask.reward })}
        </>
      );
    } else {
      return t('reward_text', {
        reward: currentTask.reward,
        currency: currentTask.rewardCurrency,
      });
    }
  };

  const getCardText = () => {
    switch (currentTask.category) {
      case TaskCategory.Likes:
        return t('likes_sent');
      case TaskCategory.SubscribeToUsers:
        return t('subscriptions_made');
      case TaskCategory.BringFriends:
        return t('friends_invited');
      case TaskCategory.AdView:
        return t('viewed_today');
      default:
        return null;
    }
  };

  const getCTAButton = () => {
    if (currentTask.category === TaskCategory.AdView) {
      if (progress === quantity && !currentTask.receivable) return null;

      return (
        <>
          <Button
            onTouchStart={onReceiveAdReward}
            fullWidth
            variant='purple'
            size='large'
          >
            {currentTask.receivable
              ? t('get_reward', { reward: currentTask.reward })
              : buttonText}
          </Button>
          {currentTask.receivable && (
            <Button
              className='mt-3'
              onClick={() => {
                showRewardedAd();
              }}
              fullWidth
              variant='default'
              size='large'
            >
              {t('buttons.ad_view_more')}
            </Button>
          )}
        </>
      );
    } else {
      return (
        <Button
          onClick={onClick}
          disabled={
            !isMaxProgress &&
            currentTask.category in linksMap &&
            !linksMap[currentTask.category as keyof typeof linksMap]
          }
          fullWidth
          variant='purple'
          size='large'
        >
          {isMaxProgress
            ? t('get_reward', { reward: currentTask.reward })
            : buttonText}
        </Button>
      );
    }
  };
  return (
    <AppCustomBottomSheet isOpen={isOpen} setIsOpen={onClose}>
      {isMaxProgress && (
        <RiveComponent
          className='absolute top-0 left-0 -z-10 h-full w-full'
          src='/assets/confett_photon.riv'
        />
      )}
      <div className='flex flex-col items-center text-center'>
        <div
          className={cn(
            'flex w-full flex-col items-center',
            isMaxProgress && 'ray-bg',
          )}
          style={{
            background: isMaxProgress
              ? undefined
              : 'radial-gradient(161.49% 73% at 49.87% 27%, #F1E5DE 0%, rgba(241, 229, 222, 0.86) 52.8%, rgba(241, 229, 222, 0.41) 66.13%, rgba(241, 229, 222, 0) 82.5%)',
          }}
        >
          <Image
            className={cn(
              'mb-6 h-[216px] w-[325px] object-contain',
              !isMaxProgress && 'opacity-50',
            )}
            src={EarnRewardImage}
            alt=''
          />
          <h2 className='text-h20 text-black'>{taskTitle}</h2>
          <p className='text-l10 mb-8 text-black'>{getTaskSubtitle()}</p>
        </div>
        <div className='w-full px-4 pb-8'>
          {progress > 0 && (
            <div className='relative mb-8 w-full rounded-3xl bg-[#F4F4F4] px-5 pt-3.5 pb-[18px]'>
              <p className='text-m10 mb-1 text-[#A4A4A8]'>{getCardText()}</p>
              <p className='text-h20 text-black'>
                {progress} {t('from')} {quantity}
              </p>
              {isMaxProgress && (
                <div className='absolute top-1/2 right-5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#28d375] text-white'>
                  <CheckIcon width={12} height={8} />
                </div>
              )}
            </div>
          )}

          {getCTAButton()}

          {/* {isMaxProgress && (
            <p className='mt-3 flex items-center justify-center text-[13px] font-medium text-[#ACACAC]'>
              <RocketIcon width={14} height={14} />
              <span>
                Для следующей награды еще{' '}
                <span className='text-purple-dark'>
                  TODO: ask for next quantity
                  {quantity + 10} действий
                </span>
              </span>
            </p>
          )}*/}
        </div>
      </div>
    </AppCustomBottomSheet>
  );
};
