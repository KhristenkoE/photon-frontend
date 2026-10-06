import React from 'react';

export interface IChipProps {
  message: string;
  type: 'material' | 'abstract';
}

export const Chip = ({ message }: IChipProps) => {
  return (
    <div className='text-m10 text-purple-dark inline rounded-[10px] bg-[#ebe7ffe0] px-3 py-1 leading-none font-medium backdrop-blur-xs'>
      {message}
    </div>
  );
};
