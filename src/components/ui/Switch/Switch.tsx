import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  onCheckedChange,
  ...props
}: Props & RadixSwitch.SwitchProps) => {
  return (
    <RadixSwitch.Root
      className={`relative h-[24px] w-[44px] rounded-full bg-[#F4F4F4] shadow-md focus:outline-none focus-visible:outline-none ${checked && 'bg-black'}`}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <RadixSwitch.Thumb
        className={`block h-[20px] w-[20px] translate-x-0.5 transform rounded-full bg-white shadow-sm transition-transform duration-100 ease-in-out ${checked && 'translate-x-5.5'}`}
      />
    </RadixSwitch.Root>
  );
};
