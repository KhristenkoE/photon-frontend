import Star2Icon from '@/../public/assets/icons/star2.svg';
import Image from 'next/image';
import FilmImage from '@/../public/assets/images/film.png';
import { Button } from '@/components/ui/Button/Button';
import TonIcon from '@/../public/assets/icons/ton.svg';
import { ConnectWalletButton } from '@/components/pages/Earn/components';
import { useUserFunds } from '@/api/hooks/useUserFunds';
import { useTranslations } from 'next-intl';
import { TON_CONNECT_MANIFEST_URL } from '@/providers/TonConnect';

export const Wallet = () => {
  const { getUserFunds } = useUserFunds();
  const t = useTranslations('EarnPage.wallet');
  const { data: funds, isLoading } = getUserFunds;

  const tonAmount =
    funds?.find((fund) => fund.currency.toLowerCase() === 'ton')?.amount || 0;
  const sparkAmount =
    funds?.find((fund) => fund.currency.toLowerCase() === 'spark')?.amount || 0;

  return (
    <>
      <div
        style={{ paddingTop: 'var(--safe-content-area-inset-top)' }}
        className='bg-purple-light rounded-b-3xl px-4 pt-2 pb-4'
      >
        <div className='relative z-10 flex flex-col rounded-2xl bg-white p-3'>
          <span className='text-h70 text-[#A4A4A8] uppercase'>spark</span>
          <div className='flex items-center gap-1'>
            <span className='text-h25 text-black'>
              {isLoading ? '...' : sparkAmount}
            </span>
            <Star2Icon className='mt-0.5 h-[18px] w-[18px]' />
          </div>
        </div>
        <p className='bg-purple-dark -mt-4 flex items-center justify-center gap-1 rounded-b-2xl pt-6 pb-2'>
          <Image width={24} height={24} src={FilmImage} alt='' />
          <span className='text-h70 text-white opacity-60'>{t('noFilms')}</span>
        </p>

        <div className='mt-2 grid grid-cols-2 gap-2'>
          <Button className='justify-start' type='button' variant='primary'>
            <div className='flex items-center gap-1'>
              <span className='text-h70 text-[#A4A4A8]'>TON</span>
              <span className='text-h70 text-black'>
                {isLoading ? '...' : tonAmount}
              </span>
              <TonIcon className='h-3 w-3' />
            </div>
          </Button>
          {TON_CONNECT_MANIFEST_URL ? (
            <ConnectWalletButton />
          ) : (
            <Button disabled variant='primary' title='Wallet integration is disabled in this archive'>
              {t('info')}
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
