import { cva, VariantProps } from 'class-variance-authority';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

const buttonVariants = cva('rounded-2xl', {
  variants: {
    variant: {
      primary: '',
      secondary: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface VibeListButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: ReactNode;
  background?: ReactNode;
}

export const VibeListButton = React.forwardRef<
  HTMLButtonElement,
  VibeListButtonProps
>(({ children, variant }) => {
  return (
    <button
      className={buttonVariants({
        variant,
      })}
    >
      <span>{children}</span>
    </button>
  );
});
