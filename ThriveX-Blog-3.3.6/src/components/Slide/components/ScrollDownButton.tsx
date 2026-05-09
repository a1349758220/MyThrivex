'use client';

import { RefObject } from 'react';

interface Props {
  slideRef: RefObject<HTMLDivElement | null>;
}

export default function ScrollDownButton({ slideRef }: Props) {
  const scrollToContent = () => {
    const slide = slideRef.current;
    if (!slide) return;

    window.scrollTo({
      top: slide.offsetTop + slide.offsetHeight - 100,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      aria-label="向下滚动"
      onClick={scrollToContent}
      className="absolute bottom-8 left-1/2 z-[80] flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center text-black dark:text-white animate-[slide-arrow-float_1.8s_ease-in-out_infinite]"
    >
      <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform hover:translate-y-1">
        <path d="M4 7L17 20L30 7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 19L17 32L30 19" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
