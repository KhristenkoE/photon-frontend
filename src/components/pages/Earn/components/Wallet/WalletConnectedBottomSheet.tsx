import TonWalletImage from '@/../public/assets/images/ton-wallet.png';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { AppCustomBottomSheet } from '@/components/ui/BottomSheet';
import { PropsWithChildren } from 'react';
import { useTranslations } from 'next-intl';

type Props = PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>;
export const WalletConnectedBottomSheet = ({ setIsOpen, isOpen }: Props) => {
  const t = useTranslations('EarnPage.wallet');
  return (
    <AppCustomBottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='ray-bg flex flex-col items-center justify-center px-4 pb-8 text-center'>
        <Image
          className='mb-[30px] h-[241px] w-[241px] object-contain'
          src={TonWalletImage}
          alt=''
        />
        <h2 className='text-h20 mb-1 text-black'>
          {t('walletSuccessfullyConnected')}
        </h2>
        <p className='text-l10 mb-8 text-black'>
          {t('walletConnectedDescription')}
        </p>
        <Button fullWidth size='large' variant='purple'>
          {t('getReward')}
        </Button>
      </div>
    </AppCustomBottomSheet>
  );
};
