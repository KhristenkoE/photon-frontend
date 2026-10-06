'use client';

import React, { useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import CancelIcon from '@/../public/assets/icons/cancel.svg';
import { ProfileEditSelectItem } from './ProfileEditSelectItem';

interface Props {
  label: string;
  options: { title: string; value: number }[];
  value: number;
  onChange: (value: number) => void;
}

export const ProfileEditSelect = ({
  label,
  value,
  options,
  onChange,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedTitle = options.find((item) => item.value === value)?.title;

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className='text-l20 text-purple-color flex items-center justify-between gap-3 py-3.5 pr-3.5 pl-4'
      >
        <p>{label}</p>
        <span className='text-purple-dark max-w-[100px] overflow-hidden overflow-ellipsis whitespace-nowrap'>
          {selectedTitle}
        </span>
      </div>

      <BottomSheet
        className='app-bottom-sheet mx-1.5'
        open={isOpen}
        onDismiss={() => setIsOpen(false)}
      >
        <div className='mt-0.5 h-[50px]'>
          <h2 className='text-h40 pt-1.5 text-center font-semibold'>{label}</h2>
          <button
            onClick={() => setIsOpen(false)}
            className='absolute top-[22px] right-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#8A8A8E]'
          >
            <CancelIcon width='24px' height='24px' />
          </button>
        </div>
        <ul className='flex flex-col pb-6'>
          {options.map((item) => (
            <ProfileEditSelectItem
              key={item.value}
              title={item.title}
              selected={value === item.value}
              onClick={() => {
                onChange(item.value);
                setIsOpen(false);
              }}
            />
          ))}
        </ul>
      </BottomSheet>
    </>
  );
};
