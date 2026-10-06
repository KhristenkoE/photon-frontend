import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import friendsBg from '@/../public/assets/images/friends-bg.jpg';
import { useDrawer } from '@/providers/Drawer';
import { InviteLinkDrawer } from './InviteLinkDrawer';

export function Header() {
  const t = useTranslations('Friends');
  const { openDrawer } = useDrawer();

  const onClick = () => {
    openDrawer(<InviteLinkDrawer />, t('inviteLinkDrawerTitle'));
  };

  return (
    <div
      style={{
        backgroundImage: `url(${friendsBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className='bg-purple-light flex flex-col items-center justify-center rounded-br-[16px] rounded-bl-[16px] px-[16px] pt-[calc(var(--safe-content-area-inset-top)+16px)] pb-[24px] text-black'
    >
      <span className='text-h25 mb-1 text-center'>
        {t('inviteFriendsTitle')}
      </span>
      <p className='text-l20 mb-[24px] inline-block text-center'>
        {t('inviteFriendsDescription')}
      </p>
      <Button onClick={onClick} fullWidth variant='purple' size='large'>
        {t('inviteFriendsButton')}
      </Button>
    </div>
  );
}
