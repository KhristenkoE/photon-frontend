import { ImageByKey } from '@/components/ui';

export function Avatar({ imgKey, imgUrl }: { imgKey: string; imgUrl: string }) {
  return (
    <div className='h-[32px] w-[32px] overflow-hidden rounded-xl'>
      <ImageByKey
        className='h-[32px] w-[32px] object-cover'
        width={32}
        height={32}
        imgKey={imgKey}
        imgUrl={imgUrl}
        alt='authorImg'
      />
    </div>
  );
}
