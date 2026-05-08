'use client';

import { useEffect, useState } from 'react';

const FALLBACK_TEXT = '我们都是星尘。';

export default function HomeWelcome() {
  const [hitokoto, setHitokoto] = useState(FALLBACK_TEXT);

  useEffect(() => {
    let ignore = false;

    fetch('/api/yiyan', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: { text?: string }) => {
        if (!ignore && data.text) {
          setHitokoto(data.text);
        }
      })
      .catch(() => {
        if (!ignore) {
          setHitokoto(FALLBACK_TEXT);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // return (
  //   <div className="absolute left-1/2 top-[200px] z-20 w-[86%] max-w-5xl -translate-x-1/2 text-center text-black dark:border dark:border-white/55 dark:p-5 dark:text-white">
  //     <div className="px-5 py-8 dark:bg-black/35 dark:backdrop-blur-[2px] sm:px-10">
  //       <h1 className="text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-tight [text-shadow:3px_2px_#00000057] dark:custom_text_shadow">
  //         欢迎来到星尘草`s Blog
  //       </h1>
  //       <p className="mx-auto mt-8 max-w-3xl text-base leading-8 dark:custom_text_shadow sm:text-xl md:text-2xl">
  //         {hitokoto}
  //       </p>
  //     </div>
  //   </div>
  // );
}
