'use client';

import { useRouter } from 'next/navigation';
import GearIcon from '/public/assets/icons/gear.svg';

export const ProfileTopMenu = () => {
  const router = useRouter();

  return (
    <div className='top-safe-content-top absolute right-0 left-0 z-10 text-white'>
      <div
        className='flex items-center justify-end px-4 py-6'
        onClick={() => router.push(window.location.pathname + '/edit')}
      >
        <GearIcon />
      </div>
    </div>
  );
};
