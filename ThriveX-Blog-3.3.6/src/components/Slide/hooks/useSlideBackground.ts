'use client';

import { useMemo } from 'react';
import { getRandom } from '@/utils';
import { useConfigStore } from '@/stores';

export default function useSlideBackground(src?: string) {
  const isDark = useConfigStore((state) => state.isDark);
  const theme = useConfigStore((state) => state.theme);
  const covers = theme.covers ?? [];

  const bgImage = useMemo(() => {
    if (src) return src;
    if (isDark && theme.swiper_image_dark) return theme.swiper_image_dark;
    if (!isDark && theme.swiper_image_light) return theme.swiper_image_light;
    return covers[getRandom(0, covers.length - 1)];
  }, [src, isDark, theme.swiper_image_dark, theme.swiper_image_light, covers]);

  return {
    isDark,
    style: {
      backgroundImage: `url(${bgImage})`,
      backgroundPosition: 'center -150px',
      backgroundRepeat: 'no-repeat',
    },
  };
}
