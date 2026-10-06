import { Button } from '@/components/ui';
import Plus2Icon from '../../../../../../public/assets/icons/plus2.svg';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { WalletConnectedBottomSheet } from './WalletConnectedBottomSheet';
import { WalletInfoBottomSheet } from '@/components/pages/Earn/components';
import { useToast } from '@/hooks/useToast';
import { useWallet } from '@/api/hooks/useWallet';
import { Check } from 'lucide-react';
import { shortenString } from '@/utils/shortenString';
import { useTranslations } from 'next-intl';

export const ConnectWalletButton = () => {
  const t = useTranslations('EarnPage.wallet');
  const { showError } = useToast();
  const [tonConnectUI] = useTonConnectUI();
  const tonAddress = useTonAddress(true);
  const { createWallet } = useWallet();
  const { mutate: createWalletMutation } = createWallet;
  const [bottomSheets, setBottomSheets] = useState({
    connected: false,
    info: false,
  });
  const awaitingConnection = useRef(false);

  const handleConnectWallet = useCallback(async () => {
    try {
      if (tonConnectUI.connected) {
        setIsOpenInfoSheet(true);
      } else {
        awaitingConnection.current = true;
        await tonConnectUI.openModal();
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showError({ message: 'Failed to connect wallet' });
      awaitingConnection.current = false;
    }
  }, [tonConnectUI, showError]);

  useEffect(() => {
    if (awaitingConnection.current && tonAddress) {
      createWalletMutation(tonAddress, {
        onSuccess: () => {
          setIsOpenConnectedSheet(true);
        },
        onSettled: () => {
          awaitingConnection.current = false;
        },
      });
    }
  }, [tonAddress, createWalletMutation]);

  const setIsOpenConnectedSheet = (isOpen: boolean) => {
    setBottomSheets((prev) => ({ ...prev, connected: isOpen }));
  };

  const setIsOpenInfoSheet = (isOpen: boolean) => {
    setBottomSheets((prev) => ({ ...prev, info: isOpen }));
  };

  return (
    <>
      <WalletConnectedBottomSheet
        isOpen={false}
        setIsOpen={setIsOpenConnectedSheet}
      />
      <WalletInfoBottomSheet
        isOpen={bottomSheets.info}
        setIsOpen={setIsOpenInfoSheet}
      />
      <Button type='button' variant='primary' onClick={handleConnectWallet}>
        <div className='flex items-center justify-center gap-1'>
          <span className='text-h70 text-[#A4A4A8]'>
            {tonConnectUI.connected ? (
              <div className='flex items-center gap-1'>
                <span>
                  {t('info')} {shortenString(tonAddress)}
                </span>
                <div className='flex h-3 w-3 items-center justify-center rounded-full bg-[#28D375] text-white'>
                  <Check className='h-2 w-2' />
                </div>
              </div>
            ) : (
              t('connect')
            )}
          </span>
          <Plus2Icon className='h-6 w-6' />
        </div>
      </Button>
    </>
  );
};
