import React from 'react';
import { Chip } from '@/components/ui/Chip/Chip';

export function VibeListCard({
  imageUrl,
}: {
  imageUrl: string;
}): React.ReactElement {
  return (
    <div className='relative h-79 w-auto overflow-hidden rounded-2xl'>
      <div className={'absolute z-3 flex h-full flex-col justify-between p-3'}>
        <div className={''}>
          <Chip message={'Food'} type={'material'} />
        </div>
        <p className={'text-m10 leading-none text-white'}>
          Pancakes - like in childhood
        </p>
      </div>
      <img
        className='absolute inset-0 z-1 h-full w-full object-cover'
        src={imageUrl}
        alt=''
      />
    </div>
  );
}
