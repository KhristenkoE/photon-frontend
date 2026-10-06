import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { cn } from '@/lib/utils';
import CancelIcon from '@/../public/assets/icons/cancel.svg';

import 'react-spring-bottom-sheet/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';

// Add global styles for the bottom sheet
import './drawer.css';

interface DrawerContextType {
  isOpen: boolean;
  content: ReactNode;
  title?: string;
  openDrawer: (content?: ReactNode, title?: string) => void;
  closeDrawer: () => void;
  setContent: (content: ReactNode) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string>('');
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    }
  }, [isOpen]);

  const openDrawer = (newContent?: ReactNode, newTitle?: string) => {
    if (newContent) {
      setContent(newContent);
    }
    if (newTitle) {
      setTitle(newTitle);
    }
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const handleSetContent = (newContent: ReactNode) => {
    setContent(newContent);
  };

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        content,
        title,
        openDrawer,
        closeDrawer,
        setContent: handleSetContent,
      }}
    >
      {children}
      {shouldRender && (
        <BottomSheet
          className={cn(isOpen && 'open', 'app-bottom-sheet')}
          open={isOpen}
          onDismiss={closeDrawer}
          onTransitionEnd={handleAnimationEnd}
        >
          <div className='min-h-[50px]'>
            <h2 className='text-h40 absolute z-[var(--feed-ui-z-index)] flex w-full justify-center bg-[var(--background-color)] pt-[6px] pb-[20px] text-center font-semibold'>
              {title}
            </h2>
            <button
              onMouseDown={closeDrawer}
              className='absolute top-[22px] right-4 z-[var(--feed-ui-z-index)] flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F4F4] text-[#8A8A8E]'
            >
              <CancelIcon width='24px' height='24px' />
            </button>
          </div>
          {content}
        </BottomSheet>
      )}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};
