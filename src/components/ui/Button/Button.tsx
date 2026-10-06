import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base styles applied to all buttons
  'flex items-center justify-center rounded-lg transition-all duration-200 font-normal',
  {
    variants: {
      variant: {
        primary: 'bg-white text-black',
        secondary: 'bg-white/20 backdrop-blur-sm text-white',
        overlay: 'bg-white text-black',
        gray: 'bg-[#F4F4F4] text-black',
        default: 'bg-black text-white',
        purple: 'bg-purple-dark text-white',
      },
      size: {
        small: 'px-2.5 py-1 text-h50 font-semibold rounded-[10px] gap-1',
        middle: 'px-[18px] py-[13px] text-l20 rounded-[16px]! gap-1',
        large: 'px-[18px] py-[15px] text-l20 rounded-[16px]! gap-1.5',
      },
      state: {
        default: 'opacity-100',
        pressed: 'opacity-60',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'small',
      state: 'default',
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      state,
      fullWidth,
      icon,
      iconPosition = 'start',
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    // If button is disabled or loading, set the state to disabled
    const buttonState = disabled || isLoading ? 'disabled' : state;

    return (
      <button
        ref={ref}
        className={buttonVariants({
          variant,
          size,
          state: buttonState,
          fullWidth,
          className,
        })}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
        ) : (
          icon &&
          iconPosition === 'start' && (
            <span className='flex items-center justify-center'>{icon}</span>
          )
        )}
        <span>{children}</span>
        {icon && iconPosition === 'end' && !isLoading && (
          <span className='flex items-center justify-center'>{icon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
