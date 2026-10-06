'use client';

import { useAddPostLike, useDeletePostLike } from '@/api/hooks/usePosts';
import {
  BottomSheetStateHistory,
  useBottomSheetStore,
  useUserStore,
} from '@/store';
import { usePostsStore } from '@/store/postsStore/postsStore';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BottomSheetListItemProps,
  ListItemTheme,
} from '@/components/ui/BottomSheet';
import { useGetComments } from '@/api/hooks/useComments';
import { CommentType } from '@/api/types/comments';
import { getTimeAgo } from '@/utils/dateFormating';
import { useToast } from '@/hooks/useToast';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { PaginatedResponse } from '@/api';
import { useRouter } from '@/i18n/navigation';

enum ActionTypes {
  LIKE = 'like',
  COMMENT = 'comment',
  SHARE = 'share',
}

const getPostActions = ({
  isLiked,
  commentCount,
  // repostCount,
  likeCount,
}: {
  isLiked: boolean;
  commentCount: number;
  repostCount: number;
  likeCount: number;
}) => [
  {
    icon: isLiked
      ? '/assets/icons/heart-filled.svg'
      : '/assets/icons/heart.svg',
    type: ActionTypes.LIKE,
    count: likeCount,
  },
  {
    icon: '/assets/icons/comment.svg',
    type: ActionTypes.COMMENT,
    count: commentCount,
  },
  // {
  //   icon: '/assets/icons/share.svg',
  //   type: ActionTypes.SHARE,
  //   count: repostCount,
  // },
];

interface ActionsProps {
  isLiked?: boolean;
  commentCount: number;
  repostCount: number;
  likeCount: number;
  postId: string;
  postUserTelegramId?: string | number;
}

export const getMappedCommentsData = (
  comments?: CommentType[],
  postUserTelegramId?: string | number,
  currentUserTgId?: number,
): (BottomSheetListItemProps & { id?: number | string })[] => {
  return (
    comments?.map((comment) => ({
      id: comment.id,
      title: `@${comment.user.username}`,
      extraSubtitle: getTimeAgo(comment.createdAt),
      subtitle: comment.text,
      src: comment.userProfile.avatar.key,
      url: comment.userProfile.avatar.url,
      commentId: comment.id,
      isMe: comment.meta.isMe,
      isMyPost: currentUserTgId == postUserTelegramId,
      elementId: `BottomSheetCommentItem-${comment.id}`,
      telegramId: comment.user.telegramId,
    })) || []
  );
};

const handleCommentBottomSheetData = ({
  data,
  postUserTelegramId,
  user,
  postId,
  open,
  title,
  refetchComments,
  setCurrentPostId,
}: {
  data?: CommentType[];
  postUserTelegramId?: string | number;
  user?: number;
  postId: string;
  title: string;
  open: (data: BottomSheetStateHistory) => void;
  refetchComments: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<PaginatedResponse<CommentType>, Error>>;
  setCurrentPostId: (postUserTelegramId?: string | number | undefined) => void;
}) => {
  const mappedCommentsData = getMappedCommentsData(
    data,
    postUserTelegramId,
    user,
  );
  setCurrentPostId(postUserTelegramId);
  open({
    title,
    type: ListItemTheme.COMMENTS,
    currentPostId: postId,
    refetchCommentsFn: refetchComments,
    list: mappedCommentsData,
  });
};

export function Actions(props: ActionsProps) {
  const {
    isLiked = false,
    commentCount,
    repostCount,
    likeCount,
    postId,
    postUserTelegramId,
  } = props;
  const { showError } = useToast();
  const t = useTranslations('FeedPost');
  const { user } = useUserStore();
  const { setPostLike } = usePostsStore();
  const router = useRouter();
  console.log('router, ', router);
  const { open, setCurrentPostId, isOpenComment, setIsOpenComment } =
    useBottomSheetStore();
  const {
    mutate: addLike,
    isPending: isPendingAddLike,
    isError: isErrorAddLike,
    error: errorAddLike,
  } = useAddPostLike(postId, user?.id);
  const {
    mutate: deleteLike,
    isPending: isPendingDeleteLike,
    isError: isErrorDeleteLike,
    error: errorDeleteLike,
  } = useDeletePostLike(postId, user?.id);
  const { refetch: refetchComments, data } = useGetComments(postId);

  const togglePlayback = async (actionType: ActionTypes, isLiked?: boolean) => {
    switch (actionType) {
      case ActionTypes.LIKE:
        if (isLiked) {
          deleteLike();
          setPostLike(postId, false);
        } else {
          addLike();
          setPostLike(postId, true);
        }
        break;
      case ActionTypes.COMMENT:
        await refetchComments().then((res) =>
          handleCommentBottomSheetData({
            data: res.data?.data,
            postUserTelegramId,
            user: user?.telegramId,
            postId,
            refetchComments,
            setCurrentPostId,
            open,
            title: t('comments'),
          }),
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isErrorAddLike) {
      showError({ message: t('likeError') });
      console.log('likeError, ', errorAddLike.message);
      setPostLike(postId, false);
    }
  }, [isErrorAddLike]);

  useEffect(() => {
    if (isErrorDeleteLike) {
      showError({ message: t('likeError') });
      console.log('likeError, ', errorDeleteLike.message);
      setPostLike(postId, true);
    }
  }, [isErrorDeleteLike]);

  useEffect(() => {
    if (isOpenComment && data?.data && data?.data.length) {
      handleCommentBottomSheetData({
        data: data?.data,
        postUserTelegramId,
        user: user?.telegramId,
        postId,
        refetchComments,
        setCurrentPostId,
        open,
        title: t('comments'),
      });
      setIsOpenComment(false);
    }
  }, []);

  return (
    <div className='flex flex-col gap-4 pb-[128px]'>
      {getPostActions({ isLiked, commentCount, repostCount, likeCount }).map(
        (action) => (
          <button
            key={action.type}
            disabled={isPendingAddLike || isPendingDeleteLike}
            onClick={() => togglePlayback(action.type, isLiked)}
            className='flex min-h-[44px] flex-col items-center gap-1.5 drop-shadow-2xl'
          >
            <img src={action.icon} alt={action.type} />
            <span className='text-h70'>{action.count || ''}</span>
          </button>
        ),
      )}
    </div>
  );
}
