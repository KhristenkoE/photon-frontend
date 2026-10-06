'use client';

import { useEffect, useRef, useState } from 'react';

type LazyImageProps = {
  src: string;
  alt?: string;
  className?: string;
  placeholderColor?: string;
};

export const LazyImage = ({
  src,
  alt,
  className,
  placeholderColor = '#1a1a1a',
}: LazyImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-[var(--feed-media-z-index)] h-full w-full mask-b-from-50% mask-b-to-100% ${className}`}
      style={{
        backgroundColor: loaded ? 'transparent' : placeholderColor,
        transition: 'background-color 0.5s ease-in-out',
      }}
    >
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className='h-full w-full object-cover'
          onLoad={() => setLoaded(true)}
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
          }}
        />
      )}
    </div>
  );
};
