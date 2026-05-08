'use client';

import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/stores';
import './index.scss';

interface Star {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface StarrySkyProps {
  /** 星星颜色，默认根据主题自动切换，可自行覆盖 */
  color?: string;
  /** 星星光晕颜色，默认根据主题自动切换，可自行覆盖 */
  glowColor?: string;
  /** 星星数量，默认 100 */
  count?: number;
}

const StarrySky = ({ color, glowColor, count = 100 }: StarrySkyProps) => {
  const isDark = useConfigStore((state) => state.isDark);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // 根据主题确定颜色
  const starColor = color ?? (isDark ? '#ffffff' : '#070707');
  const starGlowColor = glowColor ?? (isDark ? 'rgba(255, 230, 150, 0.5)' : 'rgba(160, 200, 255, 0.5)');
  const speedMultiplier = isDark ? 3 : 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        speedY: (Math.random() - 0.5) * 0.3 * speedMultiplier,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        /* 星星漂移移动 */
        star.x += star.speedX;
        star.y += star.speedY;

        /* 星星闪烁 */
        star.twinklePhase += star.twinkleSpeed;
        star.opacity = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(star.twinklePhase));

        /* 边界循环（从一端消失，另一端出现） */
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        /* 绘制星星（带外发光光晕） */
        ctx.shadowBlur = 10;
        ctx.shadowColor = starGlowColor;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        ctx.globalAlpha = star.opacity;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [starColor, starGlowColor, count, speedMultiplier]);

  return (
    <div className="StarrySky">
      <canvas ref={canvasRef} className="StarrySky__canvas" />
    </div>
  );
};

export default StarrySky;

