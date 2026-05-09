import { flushSync } from 'react-dom';

type ThemeTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
  };
};

type TransitionOrigin = {
  x: number;
  y: number;
};

const TRANSITION_DURATION = 1000;

const getOriginFromElement = (element?: Element | null): TransitionOrigin => {
  if (!element) {
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

const getEndRadius = ({ x, y }: TransitionOrigin) => {
  return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
};

const runFallbackTransition = (nextDark: boolean, updateTheme: () => void, origin: TransitionOrigin) => {
  const ripple = document.createElement('div');
  const endRadius = getEndRadius(origin);

  ripple.className = 'theme-transition-ripple';
  ripple.style.setProperty('--theme-transition-x', `${origin.x}px`);
  ripple.style.setProperty('--theme-transition-y', `${origin.y}px`);
  ripple.style.setProperty('--theme-transition-size', `${endRadius * 2}px`);
  ripple.style.setProperty('--theme-transition-color', nextDark ? '#0f0f0f' : '#f9f9f9');

  document.body.appendChild(ripple);
  window.setTimeout(() => {
    flushSync(updateTheme);
  }, 140);
  window.setTimeout(() => {
    ripple.remove();
  }, TRANSITION_DURATION);
};

export const transitionTheme = (nextDark: boolean, updateTheme: () => void, source?: Element | null) => {
  if (typeof window === 'undefined') {
    updateTheme();
    return;
  }

  const origin = getOriginFromElement(source);
  const viewTransitionDocument = document as ThemeTransitionDocument;

  if (!viewTransitionDocument.startViewTransition) {
    runFallbackTransition(nextDark, updateTheme, origin);
    return;
  }

  const transition = viewTransitionDocument.startViewTransition(() => {
    flushSync(updateTheme);
  });

  transition.ready
    .then(() => {
      const endRadius = getEndRadius(origin);

      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`],
        },
        {
          duration: TRANSITION_DURATION,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    })
    .catch(() => {});
};
