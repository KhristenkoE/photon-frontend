import { useEffect } from 'react';

export function useZoomPrevention() {
  useEffect(() => {
    // This handler specifically targets pinch-zoom gestures
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    // For touch devices - only prevent multi-touch gestures
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);
}
