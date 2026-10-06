import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export function SubscribeButton({
  handleFollow,
  isFollow = true,
}: {
  handleFollow: () => void;
  isFollow?: boolean;
}) {
  const t = useTranslations('FeedPost');

  return (
    <Button onClick={handleFollow} variant={'secondary'} size={'small'}>
      {isFollow ? t('follow') : t('subscription')}
    </Button>
  );
}
