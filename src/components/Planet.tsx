import { PlanetData } from '../data/planets';
import { PlanetLayout } from '../lib/layout';
import { getPlanetGradient } from '../lib/planetStyle';

interface PlanetProps {
  planet: PlanetData;
  layout: PlanetLayout;
  angle: number;
  isSelected: boolean;
  onSelect: (planet: PlanetData) => void;
  registerRef: (id: string, element: HTMLButtonElement | null) => void;
}

export function Planet({ planet, layout, angle, isSelected, onSelect, registerRef }: PlanetProps) {
  const { orbitRadius, dotSize, hitSize } = layout;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <button
      ref={element => registerRef(planet.id, element)}
      type="button"
      aria-label={`${planet.name}, ${planet.type} — view details`}
      aria-haspopup="dialog"
      aria-expanded={isSelected}
      onClick={() => onSelect(planet)}
      // `group` drives hover/focus styling on the children; the button itself is an
      // invisible circle at least 44px across so small planets stay easy to hit.
      className="group absolute z-20 flex items-center justify-center rounded-full bg-transparent p-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950"
      style={{
        width: `${hitSize}px`,
        height: `${hitSize}px`,
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
      }}
    >
      <span
        className={`planet-dot block rounded-full ${isSelected ? 'is-selected' : ''}`}
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          background: getPlanetGradient(planet),
          ['--planet-glow' as string]: `${planet.color}40`,
          ['--planet-glow-strong' as string]: `${planet.color}80`,
        }}
      />

      {planet.id === 'saturn' && (
        <svg
          className="pointer-events-none absolute"
          width={dotSize * 2.4}
          height={dotSize * 2.4}
          viewBox="-50 -50 100 100"
          aria-hidden="true"
        >
          <g transform="rotate(-20)">
            <ellipse cx="0" cy="0" rx="45" ry="13" fill="none" stroke="#f5e6b8" strokeOpacity="0.85" strokeWidth="6" />
            <ellipse cx="0" cy="0" rx="33" ry="9" fill="none" stroke="#e8d080" strokeOpacity="0.55" strokeWidth="4" />
          </g>
        </svg>
      )}

      <span
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white transition-opacity duration-150 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
        }`}
        style={{ bottom: `calc(50% + ${dotSize / 2 + 8}px)` }}
        aria-hidden="true"
      >
        {planet.name}
      </span>
    </button>
  );
}
