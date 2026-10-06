import { AppCustomBottomSheet } from '@/components/ui/BottomSheet';
import { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui';
import { ChevronLeft } from 'lucide-react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useWallet } from '@/api/hooks/useWallet';
import { shortenString } from '@/utils/shortenString';
import { useTranslations } from 'next-intl';

type Props = PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>;
export const WalletInfoBottomSheet = ({ setIsOpen, isOpen }: Props) => {
  const t = useTranslations('EarnPage.wallet');
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress(true);
  const [isSubmit, setIsSubmit] = useState(false);

  const { deleteWallet } = useWallet();
  const { mutate } = deleteWallet;

  const onSubmit = async () => {
    await tonConnectUI.disconnect();
    mutate();
    setIsSubmit(false);
    setIsOpen(false);
  };

  return (
    <AppCustomBottomSheet isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className='mt-5 h-[50px]'>
        {isSubmit && (
          <button
            onClick={() => setIsSubmit(false)}
            className='absolute left-4 flex h-8 w-8 items-center justify-center text-[#8A8A8E]'
          >
            <ChevronLeft />
          </button>
        )}
        <h2 className='text-h40 pt-1.5 text-center font-semibold'>
          {isSubmit ? t('disconnect_wallet') : t('info')}
        </h2>
      </div>
      <div className='px-4 pb-6'>
        {isSubmit ? (
          <div className='flex flex-col gap-3'>
            <Button onClick={onSubmit} fullWidth size='large' variant='default'>
              {t('disconnectYes')}
            </Button>
            <Button
              onClick={() => setIsSubmit(false)}
              fullWidth
              size='large'
              variant='gray'
            >
              {t('disconnectReturn')}
            </Button>
          </div>
        ) : (
          <>
            <ul>
              <li className='flex items-center justify-between py-[14px]'>
                <span className='text-l20 text-black'>
                  {shortenString(tonAddress)}
                </span>
                <span className='text-purple-dark text-l20'>
                  {t('connected')}
                </span>
              </li>
            </ul>

            <Button
              onClick={() => setIsSubmit(true)}
              fullWidth
              size='large'
              variant='gray'
            >
              {t('disconnect')}
            </Button>
          </>
        )}
      </div>
    </AppCustomBottomSheet>
  );
};
