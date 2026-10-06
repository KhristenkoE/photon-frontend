import { useState, useRef, useEffect, useCallback } from 'react';

interface ExpandableDescriptionProps {
  text: string;
  className?: string;
  // Define line height based on your text-sm and leading-[21px]
  lineHeight?: number;
  collapsedLines?: number;
  // Max height as a factor of viewport height (e.g., 0.5 for 50%)
  maxExpandFactor?: number;
  // Updated callback to include height
  onExpandChange?: (expanded: boolean) => void;
  animationTransition?: {
    duration: number;
    ease: number[] | string;
  };
}

export const ExpandableDescription = ({
  text,
  className = '',
  lineHeight = 21, // Corresponds to leading-[21px]
  collapsedLines = 2,
  maxExpandFactor = 0.5, // 50% of viewport height
  onExpandChange,
}: ExpandableDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(300);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const collapsedHeight = lineHeight * collapsedLines;

  // Calculate max height
  useEffect(() => {
    setMaxHeight(window?.innerHeight * maxExpandFactor);
  }, [maxExpandFactor]);

  // Measure content and determine clamping
  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setContentHeight(scrollHeight);
      setIsClamped(scrollHeight > collapsedHeight);
      setIsExpanded(false);
    }
  }, [text, collapsedHeight]);

  const handleExpand = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandChange) {
      onExpandChange(expanded);
    }
  };

  // Outside click handler (unchanged)
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      handleExpand(false);
    }
  }, []);

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('pointerdown', handleClickOutside);
    } else {
      document.removeEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isExpanded, handleClickOutside]);

  const needsScroll = isExpanded && contentHeight > maxHeight;
  const preventSwipe = (e: React.TouchEvent) => e.stopPropagation();

  // Set up touch handling (keep this part)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isExpanded || !needsScroll) return;

    // These are passive: false to ensure preventDefault works
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
    };

    // Add capture phase listeners with passive: false
    scrollContainer.addEventListener('touchstart', handleTouchStart, {
      passive: false,
      capture: true,
    });
    scrollContainer.addEventListener('touchmove', handleTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart, {
        capture: true,
      });
      scrollContainer.removeEventListener('touchmove', handleTouchMove, {
        capture: true,
      });
    };
  }, [isExpanded, needsScroll]);

  return (
    <div ref={containerRef} className={className}>
      {/* Collapsed state */}
      <div
        style={{
          height: collapsedHeight,
          overflow: 'hidden',
          display: isExpanded ? 'none' : 'block',
          cursor: isClamped ? 'pointer' : 'default',
        }}
        onClick={() => isClamped && handleExpand(true)}
      >
        <p
          ref={contentRef}
          className='line-clamp-2 text-sm whitespace-pre-line'
          style={{
            lineHeight: `${lineHeight}px`,
            padding: '2px 4px',
          }}
        >
          {text}
        </p>
      </div>

      {/* Expanded state - only rendered when needed */}
      {isExpanded && (
        <div
          ref={scrollContainerRef}
          className='swiper-no-swiping overflow-y-auto'
          style={{
            maxHeight: maxHeight,
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
            touchAction: 'pan-y',
            animation: '0.3s ease-out fadeIn',
          }}
          onTouchStart={preventSwipe}
          onTouchMove={preventSwipe}
          onClick={() => handleExpand(false)}
        >
          <p
            className='text-sm whitespace-pre-line'
            style={{ lineHeight: `${lineHeight}px`, padding: '2px 4px' }}
          >
            {text}
          </p>
        </div>
      )}

      {/* Add a simple CSS animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
