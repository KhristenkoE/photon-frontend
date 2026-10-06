import { useTranslations } from 'next-intl';
import { ListItemType } from '@/components/common/Navigation/types';
import PenIcon from '@/../public/assets/icons/pen.svg';
import TrashIcon from '@/../public/assets/icons/trash.svg';
import { useBottomSheetStore, useMomentStore } from '@/store';
import { useRouter } from '@/i18n/navigation';
import { useMoments } from '@/api/hooks/useMoments';
import { useToast } from '@/hooks/useToast';
import { useSearchParams } from 'next/navigation';

export const useMomentActionItems = () => {
  const t = useTranslations('MomentActionBottomSheet');
  const searchParams = useSearchParams();
  const userTgId = searchParams.get('userTgId');
  const { push } = useRouter();
  const { close } = useBottomSheetStore();
  const { deleteMoment } = useMoments(
    userTgId ? { userTgId: Number(userTgId) } : {},
  );
  const { showSuccess } = useToast();
  const momentId = searchParams.get('id');

  const onEdit = (): void => {
    push(`/moment/edit?id=${momentId}`);
  };

  const { setLastDeletedMomentId } = useMomentStore();

  const onDelete = async (): Promise<void> => {
    if (!momentId) return;
    deleteMoment.mutate(momentId, {
      onSuccess: () => {
        setLastDeletedMomentId(momentId);
        showSuccess({
          message: t('items.Delete.completed'),
          onOpen: close,
        });
      },
    });
  };

  const list = [
    {
      id: ListItemType.EditMoment,
      title: t('items.Edit.title'),
      icon: PenIcon,
      onClick: onEdit,
    },
    {
      id: ListItemType.DeleteMoment,
      title: t('items.Delete.title'),
      icon: TrashIcon,
      color: 'text-other-error',
      onClick: onDelete,
      disabled: deleteMoment.isPending,
    },
  ];

  return {
    title: t('title'),
    list,
  };
};
