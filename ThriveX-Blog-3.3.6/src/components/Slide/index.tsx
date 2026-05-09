'use client';

import { ReactNode, useRef } from 'react';
import Ripple from '@/components/Ripple';
import HeroCopy from './components/HeroCopy';
import MeteorShower from './components/MeteorShower';
import ScrollDownButton from './components/ScrollDownButton';
import useSlideBackground from './hooks/useSlideBackground';

interface Props {
  src?: string;
  isRipple?: boolean;
  showMeteors?: boolean;
  children?: ReactNode;
}

export default function Slide({ src, isRipple = true, showMeteors = false, children }: Props) {
  const slideRef = useRef<HTMLDivElement>(null);
  const { isDark, style } = useSlideBackground(src);

  return (
    <div
      ref={slideRef}
      className="home-slide overflow-hidden h-screen relative bg-cover after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]"
      style={style}
    >
      <div>{children}</div>
      <HeroCopy isDark={isDark} />
      {showMeteors && <MeteorShower />}
      {isRipple && (
        <div className="absolute bottom-0 left-0 z-30 w-full pointer-events-none">
          <Ripple />
        </div>
      )}
      <ScrollDownButton slideRef={slideRef} />
    </div>
  );
}
