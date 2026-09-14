import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { planets, PlanetData } from './data/planets';
import { Controls } from './components/Controls';
import { PlanetInfoPanel } from './components/PlanetInfoPanel';
import { SolarSystem } from './components/SolarSystem';
import { StarsBackground } from './components/StarsBackground';
import { useElementSize } from './hooks/useElementSize';
import { computeLayout, computeScale } from './lib/layout';
import { DistanceUnit } from './lib/format';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());
  const [speed, setSpeed] = useState(1);
  const [unit, setUnit] = useState<DistanceUnit>('km');
  const [pauseOnSelect, setPauseOnSelect] = useState(true);
  const [angles, setAngles] = useState<number[]>(() => planets.map(() => Math.random() * Math.PI * 2));

  const [stageRef, stageSize] = useElementSize<HTMLDivElement>();
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const planetRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  /** Whether closing the info card should resume an animation we auto-paused. */
  const resumeAfterCloseRef = useRef(false);

  const selectedPlanet = useMemo(
    () => planets.find(planet => planet.id === selectedId) ?? null,
    [selectedId]
  );

  const scale = useMemo(
    () => computeScale(stageSize.width, stageSize.height),
    [stageSize.width, stageSize.height]
  );
  const layouts = useMemo(() => computeLayout(planets, scale), [scale]);

  // Keep refs in sync with state so the animation loop can stay mounted once.
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min(timestamp - lastTime, 100); // Cap delta to avoid jumps
      lastTime = timestamp;

      if (isPlayingRef.current) {
        const currentSpeed = speedRef.current;
        setAngles(prevAngles =>
          prevAngles.map((angle, i) => {
            // Earth completes one orbit in ~8 seconds at speed 1
            const earthOrbitMs = 8000;
            const planetOrbitMs = (planets[i].orbitalPeriod / 365) * earthOrbitMs;
            const angularSpeed = (2 * Math.PI) / planetOrbitMs;
            return angle + angularSpeed * delta * currentSpeed;
          })
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []); // Only run once - uses refs for current values

  const registerPlanetRef = useCallback((id: string, element: HTMLButtonElement | null) => {
    planetRefs.current[id] = element;
  }, []);

  const closePanel = useCallback(() => {
    setSelectedId(current => {
      if (current) {
        // Hand focus back to the planet that opened the card.
        const trigger = planetRefs.current[current];
        requestAnimationFrame(() => trigger?.focus());
      }
      return null;
    });
    if (resumeAfterCloseRef.current) {
      resumeAfterCloseRef.current = false;
      setIsPlaying(true);
    }
  }, []);

  const handleSelect = useCallback(
    (planet: PlanetData) => {
      if (selectedId === planet.id) {
        closePanel();
        return;
      }
      if (pauseOnSelect && isPlaying) {
        resumeAfterCloseRef.current = true;
        setIsPlaying(false);
      }
      setSelectedId(planet.id);
    },
    [selectedId, pauseOnSelect, isPlaying, closePanel]
  );

  const handleTogglePlay = useCallback(() => {
    // An explicit play/pause overrides the auto-pause bookkeeping.
    resumeAfterCloseRef.current = false;
    setIsPlaying(current => !current);
  }, []);

  const handleTogglePauseOnSelect = useCallback(() => {
    setPauseOnSelect(current => {
      const next = !current;
      if (next) {
        if (selectedId && isPlaying) {
          resumeAfterCloseRef.current = true;
          setIsPlaying(false);
        }
      } else if (resumeAfterCloseRef.current) {
        resumeAfterCloseRef.current = false;
        setIsPlaying(true);
      }
      return next;
    });
  }, [selectedId, isPlaying]);

  // Escape closes the info card from anywhere on the page.
  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [selectedId, closePanel]);

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-x-hidden overflow-y-auto bg-gray-950">
      <StarsBackground />

      {/* Title */}
      <header className="relative z-20 shrink-0 px-3 pt-3 text-center sm:pt-4">
        <h1 className="text-xl font-bold tracking-wide text-white sm:text-2xl md:text-3xl">
          🌌 Solar System Explorer
        </h1>
        <p className="mt-1 text-xs text-gray-400 [@media(max-height:420px)]:hidden sm:text-sm">
          Select a planet (click, or Tab and press Enter) to learn more
        </p>
      </header>

      {/* Solar System View */}
      <div
        ref={stageRef}
        className="relative flex min-h-[280px] flex-1 shrink-0 items-center justify-center overflow-hidden"
      >
        {scale > 0 && (
          <SolarSystem
            planets={planets}
            layouts={layouts}
            angles={angles}
            scale={scale}
            selectedId={selectedId}
            onSelect={handleSelect}
            registerPlanetRef={registerPlanetRef}
          />
        )}

        {selectedPlanet && (
          <PlanetInfoPanel
            planet={selectedPlanet}
            unit={unit}
            onUnitChange={setUnit}
            onClose={closePanel}
          />
        )}
      </div>

      <Controls
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        speed={speed}
        onSpeedChange={setSpeed}
        pauseOnSelect={pauseOnSelect}
        onTogglePauseOnSelect={handleTogglePauseOnSelect}
      />
    </div>
  );
}
