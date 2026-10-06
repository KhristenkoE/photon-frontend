import {
  Tab,
  TabList,
  TabPanel,
  Tabs as ReactTabs,
  ReactTabsFunctionComponent,
  TabProps,
} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { List } from './List';
import {
  useReferrals,
  useFollowers,
  useFollowing,
} from '@/api/hooks/useFriends';
import { useUserStore } from '@/store';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InviteLinkDrawer } from './InviteLinkDrawer';
import { useDrawer } from '@/providers/Drawer';
import { useFollow } from '@/api/hooks/useFollow';
import { cn } from '@/lib/utils';
import { useFriendsStore } from '@/store/friends/friendsStore';
import { useEffect } from 'react';

const CustomTab: ReactTabsFunctionComponent<TabProps> = ({
  children,
  ...otherProps
}) => (
  <Tab
    selectedClassName='bg-black outline-none text-white'
    className='flex h-10 w-full items-center justify-center rounded-xl text-nowrap'
    {...otherProps}
  >
    {children}
  </Tab>
);

CustomTab.tabsRole = 'Tab';

function EmptyState({
  title,
  description,
  action,
  type,
}: {
  title: string;
  description?: string;
  action?: string;
  type: string;
}) {
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const t = useTranslations('Friends');
  const onClick = () => {
    if (type === 'referrals') {
      openDrawer(<InviteLinkDrawer />, t('inviteLinkDrawerTitle'));
    } else if (type === 'followers') {
      document.getElementById('plus')?.click();
    } else if (type === 'follows') {
      router.push('/feed');
    }
  };

  return (
    <div className='mx-auto flex h-40 max-w-[275px] flex-col items-center justify-start pt-[25px] text-center text-gray-400'>
      <span
        dangerouslySetInnerHTML={{ __html: title }}
        className='text-h25 mb-[12px] inline-block text-center'
      />
      {description && (
        <p
          dangerouslySetInnerHTML={{ __html: description }}
          className='text-m10 text-center'
        />
      )}
      {action && (
        <Button
          className={cn('mt-[20px]', { 'mt-[32px]': description })}
          onClick={onClick}
          variant='default'
          size={'middle'}
        >
          {action}
        </Button>
      )}
    </div>
  );
}

export function Tabs() {
  const t = useTranslations('Friends');
  const { user } = useUserStore();
  const userTgId = user?.telegramId?.toString() || '';
  const { data: referralsData, isLoading: isLoadingReferrals } =
    useReferrals(userTgId);
  const { data: followersData, isLoading: isLoadingFollowers } =
    useFollowers(userTgId);
  const { data: followingData, isLoading: isLoadingFollowing } =
    useFollowing(userTgId);
  const { unfollow } = useFollow({ userId: userTgId });
  const { activeTab, setActiveTab } = useFriendsStore();

  if (!userTgId) return null;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
      // Create new search params without the tab
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('tab');
      // Replace the current URL without the tab parameter
      router.replace(
        `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`,
      );
    }
  }, [tab, setActiveTab, router, pathname, searchParams]);

  const onUnsubscribe = (userTgId: string) => {
    unfollow.mutate(userTgId);
  };

  const tabConfigs = [
    {
      type: 'referrals',
      label: t('referrals'),
      title: t('referralsTabTitle', { count: referralsData?.data.length || 0 }),
      loading: isLoadingReferrals,
      data: referralsData?.data || [],
      empty: {
        title: t('referralsTabEmptyTitle'),
        action: t('referralsTabEmptyAction'),
      },
    },
    {
      type: 'followers',
      label: t('followers'),
      title: t('followersTabTitle', { count: followersData?.data.length || 0 }),
      loading: isLoadingFollowers,
      data: followersData?.data || [],
      empty: {
        title: t('followersTabEmptyTitle'),
        description: t('followersTabEmptyDescription'),
        action: t('followersTabEmptyAction'),
      },
    },
    {
      type: 'follows',
      label: t('follows'),
      title: t('followsTabTitle', { count: followingData?.data.length || 0 }),
      loading: isLoadingFollowing,
      data: followingData?.data || [],
      empty: {
        title: t('followsTabEmptyTitle'),
        description: t('followsTabEmptyDescription'),
        action: t('followsTabEmptyAction'),
      },
      action: (userTgId: string) => (
        <button
          className='text-h50 py-[6px] text-[#A4A4A8]'
          onClick={() => onUnsubscribe(userTgId)}
        >
          {t('followsTabUnsubscribe')}
        </button>
      ),
    },
  ];

  const onSelect = (index: number) => {
    setActiveTab(tabConfigs[index].type);
  };

  return (
    <ReactTabs
      selectedIndex={tabConfigs.findIndex((tab) => tab.type === activeTab)}
      onSelect={onSelect}
    >
      <div className='px-[16px]'>
        <TabList className='text-m10 mb-6 flex gap-1 rounded-xl bg-[#F2F2F2] p-1'>
          {tabConfigs.map((tab, idx) => (
            <CustomTab key={idx}>{tab.label}</CustomTab>
          ))}
        </TabList>
      </div>
      <div className='h-full'>
        {tabConfigs.map((tab, idx) => (
          <TabPanel key={idx}>
            {tab.loading ? (
              <div className='flex h-40 items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-gray-400' />
              </div>
            ) : tab.data.length === 0 ? (
              <EmptyState type={tab.type} {...tab.empty} />
            ) : (
              <List title={tab.title} items={tab.data} action={tab.action} />
            )}
          </TabPanel>
        ))}
      </div>
    </ReactTabs>
  );
}
