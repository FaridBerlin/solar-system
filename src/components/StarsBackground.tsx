import { memo, useRef } from 'react';

function StarsBackgroundImpl() {
  const stars = useRef(
    Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 2,
    }))
  );

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Memoised: the stars are static, and App re-renders on every animation frame. */
export const StarsBackground = memo(StarsBackgroundImpl);
