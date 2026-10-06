import { Theme } from '@/constants/common';
import { Navigation } from '@/components/common/Navigation/Navigation';
import { ComponentType } from 'react';
import { useNavigationStore } from '@/store';
import { cn } from '@/lib/utils';

export function WithNavigation<T extends object>(
  Component: ComponentType<T>,
  theme?: Theme,
) {
  return function WithNavigationWrapper(props: T) {
    const { isOpen } = useNavigationStore();
    return (
      <>
        <Component {...props} />
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isOpen ? '' : `translate-y-[120px]`,
          )}
        >
          <Navigation theme={theme} />
        </div>
      </>
    );
  };
}
