import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const ProfileMainInfoLoader = () => {
  return (
    <>
      <div className='absolute h-full w-full rounded-b-3xl bg-[#e4e4e6]' />
      <div className='z-10 flex-col px-4 pb-6'>
        <Skeleton className='text-h10' containerClassName=' block w-[175px]' />
        <Skeleton
          className='text-m10 mt-4'
          containerClassName=' block w-[315px]'
        />
        <Skeleton
          className='text-m10 mt-1.5'
          containerClassName=' block w-[140px]'
        />
        <Skeleton
          className='text-h10 mt-6'
          containerClassName=' block w-[120px]'
        />
      </div>
    </>
  );
};
