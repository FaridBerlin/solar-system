import { useEffect, useRef } from 'react';
import { PlanetData } from '../data/planets';
import { DistanceUnit, formatDiameter, formatDistance, formatOrbitalPeriod } from '../lib/format';
import { getPlanetGradient } from '../lib/planetStyle';

interface PlanetInfoPanelProps {
  planet: PlanetData;
  unit: DistanceUnit;
  onUnitChange: (unit: DistanceUnit) => void;
  onClose: () => void;
}

export function PlanetInfoPanel({ planet, unit, onUnitChange, onClose }: PlanetInfoPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus into the card when it opens (and when it switches planets) so
  // keyboard and screen-reader users land on the content they just requested.
  useEffect(() => {
    headingRef.current?.focus();
  }, [planet.id]);

  return (
    <div
      role="dialog"
      aria-labelledby="planet-info-title"
      className="animate-fade-in absolute inset-x-2 bottom-2 z-30 max-h-[60%] overflow-y-auto overscroll-contain rounded-2xl border border-gray-700 bg-gray-900/95 p-5 shadow-2xl backdrop-blur-lg sm:inset-x-auto sm:top-4 sm:right-4 sm:bottom-auto sm:w-80 sm:max-h-[calc(100%-2rem)]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${planet.name} details`}
        className="absolute top-3 right-3 rounded text-gray-400 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      {/* Planet header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          aria-hidden="true"
          className="w-12 h-12 rounded-full flex-shrink-0"
          style={{
            background: getPlanetGradient(planet),
            boxShadow: `0 0 15px 3px ${planet.color}60`,
          }}
        />
        <div>
          <h2
            id="planet-info-title"
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-bold text-white focus:outline-none"
          >
            {planet.name}
          </h2>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">{planet.type}</span>
        </div>
      </div>

      {/* Unit toggle */}
      <div className="mb-3 flex items-center justify-end gap-1" role="group" aria-label="Distance units">
        {(['km', 'mi'] as DistanceUnit[]).map(option => (
          <button
            key={option}
            type="button"
            onClick={() => onUnitChange(option)}
            aria-pressed={unit === option}
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
              unit === option ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {option === 'km' ? 'km' : 'miles'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <InfoRow icon="📏" label="Diameter" value={formatDiameter(planet.diameterKm, unit)} />
        <InfoRow icon="☀️" label="Distance from Sun" value={formatDistance(planet.distanceMillionKm, unit)} />
        <InfoRow icon="🔄" label="Orbital Period" value={formatOrbitalPeriod(planet.orbitalPeriod)} />
        <InfoRow icon="🌙" label="Moons" value={planet.moons.toString()} />
      </div>

      {/* Description */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-gray-300 text-sm leading-relaxed">{planet.description}</p>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg" aria-hidden="true">{icon}</span>
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}
