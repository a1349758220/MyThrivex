'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import { getRandom } from '@/utils';

type Meteor = {
  id: number;
  style: CSSProperties & Record<`--${string}`, string>;
};

const METEOR_COLORS = ['#ffffff', '#bfe4ff', '#f7d7ff', '#ffd6c9', '#d8fff4'];
const BOTTOM_HIDE_OFFSET = 170;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

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
      '--end-distance': `calc(${distance.toFixed(2)}vh - 100px)`,
      '--delay': `${randomBetween(0, 5).toFixed(2)}s`,
      '--length': `${randomBetween(100, 150).toFixed(2)}px`,
      '--height': `${randomBetween(1.5, 2).toFixed(2)}px`,
      '--color': METEOR_COLORS[getRandom(0, METEOR_COLORS.length - 1)],
    },
  };
};

interface MeteorItemProps {
  meteor: Meteor;
  onRefresh: (id: number) => void;
}

function MeteorItem({ meteor, onRefresh }: MeteorItemProps) {
  const meteorRef = useRef<HTMLSpanElement>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setIsFadingOut(false);

    const meteorElement = meteorRef.current;
    const slideElement = meteorElement?.closest('.home-slide');
    if (!meteorElement || !(slideElement instanceof HTMLElement)) return;

    let animationFrameId = 0;
    let hasStartedFadeOut = false;

    const fadeOutNearBottom = () => {
      if (hasStartedFadeOut) return;

      const meteorRect = meteorElement.getBoundingClientRect();
      const slideRect = slideElement.getBoundingClientRect();

      if (meteorRect.bottom >= slideRect.bottom - BOTTOM_HIDE_OFFSET) {
        hasStartedFadeOut = true;
        setIsFadingOut(true);
        return;
      }

      animationFrameId = requestAnimationFrame(fadeOutNearBottom);
    };

    animationFrameId = requestAnimationFrame(fadeOutNearBottom);

    return () => cancelAnimationFrame(animationFrameId);
  }, [meteor.id]);

  return (
    <span
      ref={meteorRef}
      className={`home-meteor-shell ${isFadingOut ? 'home-meteor-shell--fade-out' : ''}`}
      style={meteor.style}
      onAnimationIteration={() => {
        onRefresh(meteor.id);
      }}
    >
      <span className="home-meteor" />
    </span>
  );
}

export default function MeteorShower() {
  const meteorIdRef = useRef(0);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useEffect(() => {
    setMeteors(Array.from({ length: 1 }, () => createMeteor(meteorIdRef.current++)));
  }, []);

  if (!meteors.length) return null;

  return (
    <div className="home-meteor-layer" aria-hidden="true">
      {meteors.map((meteor) => (
        <MeteorItem
          key={meteor.id}
          meteor={meteor}
          onRefresh={(id) => {
            setMeteors((prev) => prev.map((item) => (item.id === id ? createMeteor(meteorIdRef.current++) : item)));
          }}
        />
      ))}
    </div>
  );
}
