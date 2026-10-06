import { useTranslations } from 'next-intl';
import { ListItemType } from '@/components/common/Navigation/types';
import LandscapeIcon from '@/../public/assets/icons/landscape.svg';
import CameraIcon from '@/../public/assets/icons/camera.svg';
import { isAndroidPlatform } from '@/providers/TMA/utils';

export const useMomentListItems = () => {
  const t = useTranslations('MomentBottomSheet');

  const list = [
    {
      id: ListItemType.FromGallery,
      title: t('items.FromGallery.title'),
      icon: LandscapeIcon,
    },
  ];

  if (!isAndroidPlatform()) {
    list.push({
      id: ListItemType.Camera,
      title: t('items.Camera.title'),
      icon: CameraIcon,
    });
  }

  return {
    title: t('title'),
    list,
  };
};
