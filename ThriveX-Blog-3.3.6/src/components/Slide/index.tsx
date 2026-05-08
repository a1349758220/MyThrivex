'use client';

import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Ripple from '@/components/Ripple';
import { getRandom } from '@/utils';
import { useConfigStore } from '@/stores';

interface Props {
  src?: string; // 图片列表
  isRipple?: boolean; // 是否显示波浪
  showMeteors?: boolean;
  children?: ReactNode;
}

type Meteor = {
  id: number;
  style: CSSProperties & Record<`--${string}`, string>;
};

const METEOR_COLORS = ['#ffffff', '#bfe4ff', '#f7d7ff', '#ffd6c9', '#d8fff4'];

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

// Builds one meteor's CSS variables: position, direction, size, color, and delay.
const createMeteor = (id: number): Meteor => {
  const isLeftToRight = Math.random() > 0.5;
  const distance = randomBetween(150, 190);

  return {
    id,
    style: {
      '--x': `${randomBetween(isLeftToRight ? -28 : 58, isLeftToRight ? 38 : 128).toFixed(2)}%`,
      '--y': `${randomBetween(-90, 60).toFixed(2)}px`,
      '--angle': `${randomBetween(isLeftToRight ? 35 : 105, isLeftToRight ? 75 : 145).toFixed(2)}deg`,
      '--distance': `${distance.toFixed(2)}vh`,
      // End a little before the full path so it does not disappear at the slide edge.
      '--end-distance': `calc(${distance.toFixed(2)}vh - 100px)`,
      '--delay': `${randomBetween(0, 5).toFixed(2)}s`,
      '--length': `${randomBetween(100, 150).toFixed(2)}px`,
      '--height': `${randomBetween(1.5, 2).toFixed(2)}px`,
      '--color': METEOR_COLORS[getRandom(0, METEOR_COLORS.length - 1)],
    },
  };
};

function MeteorShower() {
  const meteorIdRef = useRef(0);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    // Keep one meteor active; the 10s animation plus delay provides the cooldown.
    setMeteors(Array.from({ length: 1 }, () => createMeteor(meteorIdRef.current++)));
  }, []);

  if (!meteors.length) return null;

  return (
    <div className="home-meteor-layer" aria-hidden="true">
      {meteors.map((style) => (
        <span
          key={style.id}
          className="home-meteor"
          style={style.style}
          onAnimationIteration={() => {
            // Remount after each loop to avoid stale CSS variables on the DOM node.
            setMeteors((prev) => prev.map((item) => (item.id === style.id ? createMeteor(meteorIdRef.current++) : item)));
          }}
        />
      ))}
    </div>
  );
}

export default ({ src, isRipple = true, showMeteors = false, children }: Props) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const isDark = useConfigStore((state) => state.isDark);
  const theme = useConfigStore((state) => state.theme);
  const covers = theme.covers ?? [];

  // 根据主题切换背景图：暗色模式用 swiper_image_dark，亮色模式用 swiper_image_light
  const bgImage = useMemo(() => {
    if (src) return src;
    if (isDark && theme.swiper_image_dark) return theme.swiper_image_dark;
    if (!isDark && theme.swiper_image_light) return theme.swiper_image_light;
    return covers[getRandom(0, covers.length - 1)];
  }, [src, isDark, theme.swiper_image_dark, theme.swiper_image_light, covers]);

  const sty = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center -150px',
    backgroundRepeat: 'no-repeat',
  };

  const scrollToContent = () => {
    const slide = slideRef.current;
    if (!slide) return;

    window.scrollTo({
      top: slide.offsetTop + slide.offsetHeight - 100,
      behavior: 'smooth',
    });
  };

  return (
    <>
      <div ref={slideRef} className="overflow-hidden h-screen relative bg-cover after:content-[''] after:w-full after:h-[20%] after:absolute after:bottom-0 after:left-0 after:bg-[linear-gradient(to_top,#fff,transparent)] dark:after:bg-[linear-gradient(to_top,#2c333e,transparent)]" style={sty}>
        {/* <div className="absolute top-0 left-0 bg-[rgba(0,0,0,0.2)] w-full h-full"></div> */}
        <div>{children}</div>
        {/* Render after children so meteors sit above the star canvas and clip inside this slide. */}
        {showMeteors && <MeteorShower />}
        <button
          type="button"
          aria-label="向下滚动"
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 cursor-pointer items-center justify-center text-black dark:text-white animate-[slide-arrow-float_1.8s_ease-in-out_infinite]"
        >
          <svg width="34" height="38" viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform hover:translate-y-1">
            <path d="M4 7L17 20L30 7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 19L17 32L30 19" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {isRipple && <Ripple />}
    </>
  );
};
