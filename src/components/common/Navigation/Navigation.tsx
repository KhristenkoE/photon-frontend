import { usePathname, useRouter } from '@/i18n/navigation';
import { useBottomSheetStore, useUserStore } from '@/store';
import { ListItemType } from './types';
import {
  AppBottomSheet,
  BottomSheetListItem,
  ListItemStatus,
  ListItemTheme,
} from '../../ui/BottomSheet';
import { cn } from '@/lib/utils';
import { useCreateListItems } from '@/components/common/Navigation/hooks/useCreateListItems';
import { BottomSheetCommentList } from '@/components/ui/BottomSheet/BottomSheetCommentList/BottomSheetCommentList';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  useAddComment,
  useDeleteComment,
  useHideComment,
} from '@/api/hooks/useComments';
import { hideBackButton } from '@telegram-apps/sdk-react';
import { CameraButton } from '@/components/ui/CameraButton';
import { isAndroidPlatform } from '@/providers/TMA/utils';
import { useToast } from '@/hooks/useToast';
import SendCommentButtonIcon from '../../../../public/assets/icons/send-comment-button.svg';
import xss from 'xss';
import { getAndroidVersion } from '@/utils/getAndroidVersion';

type NavItem = {
  id: string;
  path?: string;
};

const navItems: NavItem[] = [
  { id: 'feed', path: '/feed' },
  { id: 'friends', path: '/friends' },
  { id: 'plus' },
  { id: 'earn', path: '/earn' },
  { id: 'profile', path: '/profile/me' },
];

const COMMENT_TEXTAREA_ID = 'COMMENT_TEXTAREA_ID';

export function Navigation({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
  const t = useTranslations('Navigation');
  const router = useRouter();
  const { showError } = useToast();
  const { user } = useUserStore();
  const {
    open,
    history,
    isOpen,
    close,
    setCommentStatus,
    keyboardVisible,
    setKeyboardVisible,
    setCommentValue,
    postUserTelegramId,
    setData,
    commentValue,
  } = useBottomSheetStore();
  const isAndroid = isAndroidPlatform();
  const { oldAndroidVersion } = getAndroidVersion();
  const createListItems = useCreateListItems();
  const pathname = usePathname();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentBottomSheetData = history[history.length - 1];
  const isCommentsBottomSheet =
    currentBottomSheetData?.type === ListItemTheme.COMMENTS;
  const isNoComments =
    isCommentsBottomSheet && !currentBottomSheetData.list.length;

  const [deletedCommentId, setDeletedCommentId] = useState('');
  const [hiddenCommentId, setHiddenCommentId] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState('');

  const {
    mutate: deleteComment,
    isError: isErrorDeleteComment,
    isSuccess: isSuccessDeleteComment,
  } = useDeleteComment(currentBottomSheetData?.currentPostId);
  const {
    mutate: hideComment,
    isError: isErrorHideComment,
    isSuccess: isSuccessHideComment,
  } = useHideComment(currentBottomSheetData?.currentPostId);
  const {
    mutate: addComment,
    isError: isErrorAddComment,
    isSuccess: isSuccessAddComment,
  } = useAddComment(currentBottomSheetData?.currentPostId);

  const getIconPath = (item: NavItem) => {
    if (item.id === 'plus') {
      return `/assets/icons/nav/plus${theme === 'light' ? '-white' : ''}.svg`;
    }

    const state = pathname === item.path ? 'active' : 'inactive';
    return `/assets/icons/nav/${item.id}${theme === 'light' ? '-white' : ''}-${state}.svg`;
  };

  const openSheet = () => {
    open({ title: createListItems.title, list: createListItems.list });
  };

  const handleDeleteComment = useCallback((commentId?: string) => {
    if (commentId) {
      setDeletedCommentId(commentId);
      deleteComment(commentId);
    }
  }, []);

  const handleHideComment = useCallback((commentId?: string) => {
    if (commentId) {
      setHiddenCommentId(commentId);
      hideComment(commentId);
    }
  }, []);

  const handleCommentText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.currentTarget.value.slice(0, 2500));
  };

  const handleSendComment = (e: any) => {
    e.preventDefault();
    if (commentValue) {
      const trimmedComment = commentValue.trim();

      if (trimmedComment.length === 0) {
        showError({ message: t('emptyCommentError') });
        return;
      }

      if (trimmedComment.length > 2500) {
        showError({ message: t('tooLongCommentError') });
        return;
      }

      const sanitizedText = xss(commentValue);

      addComment(sanitizedText);
      setCommentValue('');
      setKeyboardVisible(false);
      const commentTextarea = document.getElementById(COMMENT_TEXTAREA_ID);
      if (commentTextarea) {
        commentTextarea.blur();
      }
    }
  };

  const handleFocus = () => {
    setKeyboardVisible(true);
  };

  const handleBlur = () => {
    setKeyboardVisible(false);
  };

  const onCameraClose = () => {
    close();
    router.push('/image');
  };

  useEffect(() => {
    if (isErrorDeleteComment) {
      showError({ message: t('deleteCommentError') });
    }
  }, [isErrorDeleteComment]);

  useEffect(() => {
    if (isErrorHideComment) {
      showError({ message: t('hideCommentError') });
    }
  }, [isErrorHideComment]);

  useEffect(() => {
    if (currentBottomSheetData && currentBottomSheetData.list.length) {
      const elementId = document.getElementById(
        currentBottomSheetData.list[currentBottomSheetData.list.length - 1]
          .elementId!,
      );
      if (elementId) {
        elementId.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  }, [currentBottomSheetData?.list.length]);

  useEffect(() => {
    if (isSuccessDeleteComment) {
      setCommentStatus(deletedCommentId);
    }
  }, [isSuccessDeleteComment]);

  useEffect(() => {
    if (isSuccessHideComment) {
      setCommentStatus(hiddenCommentId, ListItemStatus.HIDDEN);
    }
  }, [isSuccessHideComment]);

  useEffect(() => {
    const overlayElement = document.querySelector(
      '[data-rsbs-overlay="true"]',
    ) as HTMLElement;
    if (oldAndroidVersion && overlayElement) {
      if (keyboardVisible) {
        overlayElement.style.bottom = `${(window.innerHeight * 3) / 8}px`;
        overlayElement.style.height = `50%`;
      } else {
        overlayElement.style.bottom = `0`;
        overlayElement.style.height = `85%`;
      }
    }
  }, [keyboardVisible]);

  useEffect(() => {
    if (isErrorAddComment) {
      showError({ message: t('addCommentError') });
    }
  }, [isErrorAddComment]);

  useEffect(() => {
    if (isSuccessAddComment && currentBottomSheetData?.refetchCommentsFn) {
      (async () => {
        try {
          await currentBottomSheetData.refetchCommentsFn?.().then((res) => {
            setData(res.data?.data, postUserTelegramId, user?.telegramId);
          });
        } catch (error) {
          console.error('Ошибка при обновлении комментариев:', error);
        }
      })();
    }
  }, [isSuccessAddComment]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 118);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [commentValue]);

  return (
    <>
      {currentBottomSheetData ? (
        <AppBottomSheet>
          <div
            className={cn('', {
              'relative flex h-full max-h-[90%] flex-col':
                isCommentsBottomSheet,
            })}
          >
            <ul
              ref={listRef}
              className={cn('flex flex-col pb-6', {
                'flex-1 flex-col overflow-y-auto pb-20': isCommentsBottomSheet,
                'items-center justify-center': isNoComments,
              })}
              data-body-scroll-lock-ignore={isAndroid ? 'false' : 'true'}
            >
              {isCommentsBottomSheet
                ? currentBottomSheetData?.list.map((item) => (
                    <BottomSheetCommentList
                      elementId={item.elementId}
                      id={item.id}
                      key={item.id ?? item.title}
                      title={item.title}
                      src={item.src}
                      url={item.url}
                      subtitle={item.subtitle}
                      extraSubtitle={item.extraSubtitle}
                      color={item.color}
                      onDelete={(commentId) => handleDeleteComment(commentId)}
                      onHide={(commentId) => handleHideComment(commentId)}
                      status={item.status}
                      isMe={item.isMe}
                      isMyPost={item.isMyPost}
                      commentId={item.commentId}
                      selectedCommentId={selectedCommentId}
                      setSelectedCommentId={setSelectedCommentId}
                      telegramId={item.telegramId}
                    />
                  ))
                : currentBottomSheetData?.list.map((item) =>
                    item.id === ListItemType.Camera ||
                    item.id === ListItemType.FromGallery ? (
                      <CameraButton
                        cb={onCameraClose}
                        capture={
                          item.id === ListItemType.Camera
                            ? 'environment'
                            : false
                        }
                        key={item.id ?? item.title}
                        icon={item.icon}
                        title={item.title}
                      />
                    ) : (
                      <BottomSheetListItem
                        id={item.id}
                        key={item.id ?? item.title}
                        title={item.title}
                        icon={item.icon}
                        subtitle={item.subtitle}
                        extraSubtitle={item.extraSubtitle}
                        color={item.color}
                        isSoon={item.isSoon}
                        onClick={item.onClick}
                      />
                    ),
                  )}
              {isNoComments && (
                <p className='text-h40 text-cygre text-[var(--third-text-color)]'>
                  {t('noComments')}
                </p>
              )}
              {isCommentsBottomSheet ? (
                <div
                  className={cn(
                    'fixed bottom-0 flex w-full items-end justify-center pt-[12px] pr-[16px] pb-[12px] pl-[16px]',
                  )}
                >
                  <div className='flex w-full items-end justify-center gap-[10px] rounded-[16px] bg-[var(--background-color-2)] pt-[12px] pr-[16px] pb-[12px] pl-[16px]'>
                    <textarea
                      id={COMMENT_TEXTAREA_ID}
                      ref={textareaRef}
                      value={commentValue}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={handleCommentText}
                      placeholder={t('commentInputPlaceholder')}
                      className='font-cygre text-m10 max-h-[118px] w-full resize-none placeholder-(--third-text-color) focus:outline-none'
                    />
                    {commentValue && (
                      <button onMouseDown={handleSendComment}>
                        <SendCommentButtonIcon className='min-w-[40px]' />
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </ul>
          </div>
        </AppBottomSheet>
      ) : null}

      <nav
        className={cn(
          { 'fixed z-10': !isOpen },
          { hidden: keyboardVisible },
          'bottom-10 left-1/2 w-[317px] -translate-x-1/2 transform rounded-3xl bg-[rgba(0,0,0,0.3)] backdrop-blur-lg',
        )}
      >
        <div className='flex items-center justify-between px-2 py-2.5'>
          {navItems.map((item) =>
            item.id !== 'plus' ? (
              <button
                key={item.id}
                onClick={() => {
                  hideBackButton.ifAvailable();
                  router.push(item.path!);
                }}
                className={'flex h-[48px] w-[60px] items-center justify-center'}
              >
                <img src={getIconPath(item)} alt='' />
              </button>
            ) : (
              <button
                id='plus'
                key={item.id}
                onClick={openSheet}
                className={'flex h-[48px] w-[60px] items-center justify-center'}
              >
                <img src={getIconPath(item)} alt='' />
              </button>
            ),
          )}
        </div>
      </nav>
    </>
  );
}
