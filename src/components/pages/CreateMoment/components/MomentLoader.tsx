import RiveComponent from '@rive-app/react-canvas';
import { useTranslations } from 'next-intl';

interface Props {
  imageUrl: string;
  isPending?: boolean;
  uploadProgress?: number;
}

export const MomentLoader = ({
  imageUrl,
  uploadProgress,
  isPending,
}: Props) => {
  const t = useTranslations('MomentActionBottomSheet.items.Create');

  return (
    <section className='flex h-screen w-screen flex-col px-4 pb-4'>
      <img
        className='fixed top-0 left-0 -z-10 h-screen w-screen bg-black object-cover blur'
        src={imageUrl}
        alt=''
      />
      <div
        style={{
          background: `linear-gradient(179.89deg, rgba(0, 0, 0, 0) 55.03%, rgba(0, 0, 0, 0.02) 58.53%, rgba(0, 0, 0, 0.09) 64.79%, rgba(0, 0, 0, 0.22) 72.29%, #262626 90.13%),
                linear-gradient(180.02deg, rgba(0, 0, 0, 0.413) -6.67%, rgba(0, 0, 0, 0) 20.11%),
                linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))`,
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        }}
        className='fixed top-0 left-0 z-10 h-screen w-screen'
      >
        <RiveComponent src='/assets/loading.riv' />
        {typeof uploadProgress === 'number' && (
          <div className='absolute right-0 bottom-10 left-0 text-center text-white'>
            {isPending
              ? `${t('uploading')}: ${uploadProgress}%`
              : `${t('publishing')}...`}
          </div>
        )}
      </div>
    </section>
  );
};
