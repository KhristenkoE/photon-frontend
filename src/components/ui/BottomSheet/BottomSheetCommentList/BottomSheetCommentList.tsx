import {
  BottomSheetListItemProps,
  ListItemStatus,
} from '@/components/ui/BottomSheet';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import TrashCanIcon from '@/../public/assets/icons/trash-can.svg';
import DeleteTrashCanIcon from '@/../public/assets/icons/delete-trash.svg';
import { Avatar } from '@/components/pages/Feed/components/Post/Avatar';
import { useBottomSheetStore } from '@/store';
import { useRouter } from '@/i18n/navigation';

export const BottomSheetCommentList = ({
  elementId,
  subtitle,
  onClick,
  src,
  url,
  title,
  extraSubtitle,
  isMe,
  isMyPost,
  commentId,
  onDelete,
  onHide,
  status,
  selectedCommentId,
  setSelectedCommentId,
  telegramId,
}: BottomSheetListItemProps) => {
  const router = useRouter();
  const { close, setIsOpenComment } = useBottomSheetStore();
  const t = useTranslations('Navigation');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const isDeleted = status === ListItemStatus.DELETED;

  const [showActions, setShowActions] = useState(false);

  const handlePointerDown = () => {
    timeoutRef.current = setTimeout(() => {
      setSelectedCommentId?.(commentId!);
      setShowActions(true);
    }, 600);
  };

  const handlePointerUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleHide = () => {
    setShowActions(false);
    onHide?.(commentId);
  };

  const handleDelete = () => {
    setShowActions(false);
    onDelete?.(commentId);
  };

  const handleClick = () => {
    setIsOpenComment(true);
    close();
    router.push(`/profile/${telegramId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  return status &&
    [ListItemStatus.DELETED, ListItemStatus.HIDDEN].includes(status) ? (
    <div className='flex items-center gap-3 pt-[12px] pr-[16px] pb-[12px] pl-[16px] text-start'>
      {isDeleted && <TrashCanIcon />}
      <div
        className={`text-m10 font-cygre text-(${isDeleted ? '--third-text-color' : '--third-text-color'})`}
      >
        {isDeleted ? t('deleteCommentSuccess') : t('hideCommentSuccess')}
      </div>
    </div>
  ) : (
    <div
      id={elementId}
      onClick={onClick}
      className='relative flex gap-3 pt-[12px] pr-[16px] pb-[12px] pl-[16px] text-start select-none'
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        className='h-[32px] min-w-[32px] overflow-hidden rounded-xl'
        onClick={handleClick}
      >
        <Avatar imgKey={src!} imgUrl={url!} />
      </div>
      <div>
        <div className='flex gap-1 text-start' onClick={handleClick}>
          <div className={'text-h60'}>{title}</div>
          {extraSubtitle ? (
            <span className='text-h60 text-[#a4a4a8]'> {extraSubtitle}</span>
          ) : null}
        </div>
        <div className='text-s20'>
          {subtitle ? (
            <span
              className='text-m10 font-cygre break-words'
              style={{ overflowWrap: 'anywhere' }}
            >
              {subtitle}
            </span>
          ) : null}
        </div>
      </div>

      {selectedCommentId === commentId && showActions && (
        <div
          ref={actionsRef}
          className='absolute top-full left-0 z-10 mt-1 w-full rounded-[16px] bg-white shadow-(--box-shadow-1)'
        >
          {isMyPost && (
            <button
              onClick={handleHide}
              className='flex w-full items-center gap-[8px] pt-[20px] pr-[16px] pb-[20px] pl-[16px]'
            >
              <p className='text-m10 text-(--third-text-color)'>
                {t('hideComment')}
              </p>
            </button>
          )}
          {isMe && (
            <button
              onClick={handleDelete}
              className='flex w-full items-center gap-[8px] pt-[20px] pr-[16px] pb-[20px] pl-[16px]'
            >
              <DeleteTrashCanIcon />
              <p className='text-m10 text-(--other-error-color)'>
                {t('deleteComment')}
              </p>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
