import { useState, useEffect, useRef } from 'react';
import { planets, PlanetData } from './data/planets';

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);
  const [scale, setScale] = useState(1);

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const updateScale = () => {
      const minDim = Math.min(window.innerWidth * 0.95, window.innerHeight - 180);
      setScale(Math.min(1, minDim / 920));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
  };

  return (
    <div className="w-full h-screen bg-gray-950 overflow-hidden relative flex flex-col">
      {/* Stars background */}
      <StarsBackground />

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          🌌 Solar System Explorer
        </h1>
        <p className="text-gray-400 text-sm mt-1">Click on any planet to learn more</p>
      </div>

      {/* Solar System View */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center"
      >
        <div
          className="relative"
          style={{
            width: '900px',
            height: '900px',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Sun */}
          <div
            className="absolute rounded-full z-10 cursor-pointer"
            style={{
              width: '50px',
              height: '50px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff5a0 0%, #ffa500 50%, #ff6600 100%)',
              boxShadow: '0 0 40px 15px rgba(255, 165, 0, 0.5), 0 0 80px 30px rgba(255, 100, 0, 0.3)',
            }}
          />

          {/* Orbit paths and planets */}
          {planets.map((planet, index) => (
            <div key={planet.id}>
              {/* Orbit path */}
              <div
                className="absolute rounded-full border border-gray-700/40"
                style={{
                  width: `${planet.orbitRadius * 2}px`,
                  height: `${planet.orbitRadius * 2}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />

              {/* Planet */}
              <div
                className="absolute cursor-pointer transition-transform duration-150"
                style={{
                  width: `${planet.size * 2}px`,
                  height: `${planet.size * 2}px`,
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) translate(${Math.cos(angles[index]) * planet.orbitRadius}px, ${Math.sin(angles[index]) * planet.orbitRadius}px)`,
                  zIndex: 15,
                }}
                onClick={() => handlePlanetClick(planet)}
                onMouseEnter={() => setHoveredPlanet(planet.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <div
                  className={`w-full h-full rounded-full transition-all duration-200 ${
                    hoveredPlanet === planet.id ? 'scale-150' : ''
                  } ${selectedPlanet?.id === planet.id ? 'scale-150 ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                  style={{
                    background: getPlanetGradient(planet),
                    boxShadow: hoveredPlanet === planet.id
                      ? `0 0 15px 5px ${planet.color}80`
                      : `0 0 8px 2px ${planet.color}40`,
                  }}
                />
                {/* Saturn's ring */}
                {planet.id === 'saturn' && (
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-200/50 pointer-events-none"
                    style={{
                      width: `${planet.size * 3.2}px`,
                      height: `${planet.size * 1.2}px`,
                      transform: 'translate(-50%, -50%) rotateX(75deg)',
                    }}
                  />
                )}
                {/* Planet name label */}
                {(hoveredPlanet === planet.id || selectedPlanet?.id === planet.id) && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-medium whitespace-nowrap bg-black/60 px-2 py-0.5 rounded">
                    {planet.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <PlanetInfoPanel
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-2xl px-6 py-4 flex items-center gap-6">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Speed Control */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">Speed:</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-28 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-white text-sm font-mono w-12">{speed.toFixed(1)}x</span>
        </div>

        {/* Speed presets */}
        <div className="flex gap-1">
          {[0.5, 1, 2, 5].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                speed === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getPlanetGradient(planet: PlanetData): string {
  switch (planet.id) {
    case 'mercury':
      return 'radial-gradient(circle at 35% 35%, #d4d4d4, #8a8a8a, #5a5a5a)';
    case 'venus':
      return 'radial-gradient(circle at 35% 35%, #f5deb3, #daa520, #b8860b)';
    case 'earth':
      return 'radial-gradient(circle at 35% 35%, #87ceeb, #4fa3e0, #2e6b9e)';
    case 'mars':
      return 'radial-gradient(circle at 35% 35%, #f08060, #c0503a, #8b3020)';
    case 'jupiter':
      return 'radial-gradient(circle at 35% 35%, #f0d0a0, #c8a060, #a07830)';
    case 'saturn':
      return 'radial-gradient(circle at 35% 35%, #f5e6b8, #e8d080, #c8a850)';
    case 'uranus':
      return 'radial-gradient(circle at 35% 35%, #b0e8f0, #7ec8e3, #4a98b0)';
    case 'neptune':
      return 'radial-gradient(circle at 35% 35%, #6080f0, #4060e0, #2040a0)';
    default:
      return planet.color;
  }
}

function StarsBackground() {
  const stars = useRef(
    Array.from({ length: 200 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  );

  return (
    <div className="absolute inset-0 z-0">
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
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function PlanetInfoPanel({ planet, onClose }: { planet: PlanetData; onClose: () => void }) {
  return (
    <div className="absolute top-20 right-4 z-30 w-72 md:w-80 bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-2xl p-5 shadow-2xl animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>

      {/* Planet header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex-shrink-0"
          style={{
            background: getPlanetGradient(planet),
            boxShadow: `0 0 15px 3px ${planet.color}60`,
          }}
        />
        <div>
          <h2 className="text-xl font-bold text-white">{planet.name}</h2>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded-full">{planet.type}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <InfoRow icon="📏" label="Diameter" value={planet.realDiameter} />
        <InfoRow icon="☀️" label="Distance from Sun" value={planet.realDistance} />
        <InfoRow icon="🔄" label="Orbital Period" value={`${planet.orbitalPeriod.toLocaleString()} days`} />
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
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}
