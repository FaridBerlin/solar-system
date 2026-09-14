const SPEED_PRESETS = [0.5, 1, 2, 5];

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  pauseOnSelect: boolean;
  onTogglePauseOnSelect: () => void;
}

export function Controls({
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange,
  pauseOnSelect,
  onTogglePauseOnSelect,
}: ControlsProps) {
  return (
    <div className="relative z-20 flex w-full shrink-0 justify-center px-2 pb-3">
      {/* flex-wrap keeps every control reachable instead of clipping them at narrow widths.
          min-w-0 on this row and on each shrinkable child stops a group from overflowing
          the bar (a centred overflowing row gets clipped at the left edge). */}
      <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-2xl border border-gray-700 bg-gray-900/80 px-3 py-3 backdrop-blur-md sm:w-auto sm:px-4">
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause orbit animation' : 'Play orbit animation'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <div className="flex min-w-0 flex-1 basis-40 items-center gap-2">
          <label htmlFor="speed-slider" className="shrink-0 text-sm text-gray-400">
            Speed
          </label>
          <input
            id="speed-slider"
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={event => onSpeedChange(parseFloat(event.target.value))}
            aria-valuetext={`${speed.toFixed(1)} times`}
            className="h-2 w-24 min-w-0 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-700 accent-blue-500 sm:w-28 sm:flex-none"
          />
          <span className="w-12 shrink-0 font-mono text-sm text-white">{speed.toFixed(1)}x</span>
        </div>

        <div className="flex max-w-full flex-wrap justify-center gap-1" role="group" aria-label="Speed presets">
          {SPEED_PRESETS.map(preset => (
            <button
              key={preset}
              type="button"
              onClick={() => onSpeedChange(preset)}
              aria-pressed={speed === preset}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                speed === preset ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {preset}x
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onTogglePauseOnSelect}
          aria-pressed={pauseOnSelect}
          aria-label="Auto-pause the orbits while a planet's info card is open"
          title="Auto-pause the orbits while a planet's info card is open"
          className={`max-w-full rounded px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
            pauseOnSelect ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Auto-pause
        </button>
      </div>
    </div>
  );
}
