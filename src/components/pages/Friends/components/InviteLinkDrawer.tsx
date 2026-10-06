import { Bounce, toast } from 'react-toastify';
import { Button } from '@/components/ui/Button';
import {
  hapticFeedback,
  retrieveLaunchParams,
  shareURL,
} from '@telegram-apps/sdk-react';
import { useTranslations } from 'next-intl';
import { getAppShareUrl } from '@/lib/getAppShareUrl';

export const InviteLinkDrawer = () => {
  const { tgWebAppData } = retrieveLaunchParams();
  const pt = useTranslations('ProfilePage');
  const t = useTranslations('Friends');

  const shareLink = getAppShareUrl(tgWebAppData?.user?.id);

  const handleCopy = async () => {
    if (!shareLink) return;
    try {
      hapticFeedback.impactOccurred.ifAvailable('medium');
      await navigator.clipboard.writeText(
        `${shareLink} \n${pt('shareProfileText')}`,
      );
      toast.success(t('copyLinkSuccess'), {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        draggable: true,
        draggablePercent: 20,
        closeButton: false,
        theme: 'colored',
        transition: Bounce,
      });
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className='flex flex-col items-center px-4 pb-[24px]'>
      <p className='text-l10 mb-[24px] max-w-[350px] text-center'>
        {t('inviteLinkDrawerText')}
      </p>
      <div
        onClick={handleCopy}
        className='text-m10 mb-4 flex h-[83px] w-full items-center justify-center rounded-[16px] bg-[#F4F4F4] px-[16px] text-center break-all text-[#A4A4A8] select-none'
      >
        {shareLink.replace('https://', '')}
      </div>
      <Button
        variant='default'
        size='large'
        fullWidth
        disabled={!shareLink}
        onClick={() => {
          if (!shareLink) return;
          shareURL(shareLink, pt('shareProfileText'));
        }}
        className='mb-[10px]'
      >
        {t('inviteLinkDrawerButton')}
      </Button>
      <Button variant='gray' size='large' fullWidth disabled={!shareLink} onClick={handleCopy}>
        {t('inviteLinkDrawerCopyButton')}
      </Button>
    </div>
  );
};
