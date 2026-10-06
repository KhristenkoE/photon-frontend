import { useTranslations } from 'next-intl';
import { ListItemType } from '@/components/common/Navigation/types';
import StarsIcon from '@/../public/assets/icons/stars.svg';
import WavesIcon from '@/../public/assets/icons/waves.svg';
// import ThumbsUpIcon from '@/../public/assets/icons/thumbs-up.svg';
import MagicStickIcon from '@/../public/assets/icons/magic-stick.svg';
import { useMomentListItems } from './useMomentListItems';
import { useBottomSheetStore } from '@/store';

export const useCreateListItems = () => {
  const { open } = useBottomSheetStore();
  const t = useTranslations('CreateBottomSheet');
  const momentListItems = useMomentListItems();

  const handleClick = () => {
    open({ title: momentListItems.title, list: momentListItems.list });
  };
  return {
    title: t('title'),
    list: [
      {
        id: ListItemType.Moment,
        onClick: handleClick,
        title: t('items.Moment.title'),
        subtitle: t('items.Moment.subtitle'),
        icon: StarsIcon,
      },
      {
        id: ListItemType.VibeList,
        title: t('items.VibeList.title'),
        subtitle: t('items.VibeList.subtitle'),
        icon: WavesIcon,
        isSoon: true,
      },
      // {
      //   id: ListItemType.Battle,
      //   title: t('items.Battle.title'),
      //   subtitle: t('items.Battle.subtitle'),
      //   icon: ThumbsUpIcon,
      // },
      {
        id: ListItemType.Wishlist,
        title: t('items.Wishlist.title'),
        subtitle: t('items.Wishlist.subtitle'),
        icon: MagicStickIcon,
        isSoon: true,
      },
    ],
  };
};
