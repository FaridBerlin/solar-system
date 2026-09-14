import { PlanetData } from '../data/planets';
import { DESIGN_EXTENT, PlanetLayout } from '../lib/layout';
import { Planet } from './Planet';

interface SolarSystemProps {
  planets: PlanetData[];
  layouts: PlanetLayout[];
  angles: number[];
  scale: number;
  selectedId: string | null;
  onSelect: (planet: PlanetData) => void;
  registerPlanetRef: (id: string, element: HTMLButtonElement | null) => void;
}

export function SolarSystem({
  planets,
  layouts,
  angles,
  scale,
  selectedId,
  onSelect,
  registerPlanetRef,
}: SolarSystemProps) {
  const boxSize = DESIGN_EXTENT * 2 * scale;
  const sunSize = Math.max(24, 50 * scale);

  return (
    <div
      className="relative"
      style={{ width: `${boxSize}px`, height: `${boxSize}px` }}
      role="group"
      aria-label="Solar system orbit map"
    >
      {/* Orbit rings */}
      {planets.map((planet, index) => {
        const isSelected = selectedId === planet.id;
        return (
          <div
            key={`orbit-${planet.id}`}
            aria-hidden="true"
            className="absolute rounded-full border transition-colors duration-200"
            style={{
              width: `${layouts[index].orbitRadius * 2}px`,
              height: `${layouts[index].orbitRadius * 2}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: isSelected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(75, 85, 99, 0.4)',
              boxShadow: isSelected ? `0 0 12px 0 ${planet.color}55` : undefined,
            }}
          />
        );
      })}

      {/* Sun */}
      <div
        aria-hidden="true"
        className="absolute z-10 rounded-full"
        style={{
          width: `${sunSize}px`,
          height: `${sunSize}px`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, #fff5a0 0%, #ffa500 50%, #ff6600 100%)',
          boxShadow: `0 0 ${sunSize * 0.8}px ${sunSize * 0.3}px rgba(255, 165, 0, 0.5), 0 0 ${sunSize * 1.6}px ${sunSize * 0.6}px rgba(255, 100, 0, 0.3)`,
        }}
      />

      {/* Planets */}
      {planets.map((planet, index) => (
        <Planet
          key={planet.id}
          planet={planet}
          layout={layouts[index]}
          angle={angles[index]}
          isSelected={selectedId === planet.id}
          onSelect={onSelect}
          registerRef={registerPlanetRef}
        />
      ))}
    </div>
  );
}
