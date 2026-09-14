import { PlanetData } from '../data/planets';

/**
 * The planet data uses a fixed "design space" (orbit radii 70-440px, planet radii
 * 6-24px). Everything on screen is derived from that space times a scale factor, so
 * the whole system always fits the available box, down to phone-sized viewports.
 */
export const DESIGN_MIN_RADIUS = 70;
export const DESIGN_MAX_RADIUS = 440;
/** Half the design canvas: outermost orbit + planet radius + room for the name label. */
export const DESIGN_EXTENT = 470;
/** Outermost orbit + that planet's radius, i.e. how far a planet centre can sit from the sun. */
const DESIGN_OUTER_ORBIT = 455;

/** Smallest a planet is ever drawn, so Mercury stays visible when scaled down. */
const MIN_DOT_SIZE = 10;
/** Minimum tap target (WCAG 2.5.8 target size), independent of the drawn dot. */
const MIN_HIT_SIZE = 44;
/** Room reserved outside the outermost orbit for its hit area and name label. */
const EDGE_MARGIN = MIN_HIT_SIZE / 2 + 8;
/** The map is never scaled below this, so it can never collapse into nothing. */
const MIN_SCALE = 0.1;

export interface PlanetLayout {
  /** Orbit radius in CSS pixels. */
  orbitRadius: number;
  /** Diameter of the drawn planet in CSS pixels. */
  dotSize: number;
  /** Diameter of the invisible circular hit area in CSS pixels. */
  hitSize: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Scale factor that fits the full system inside `width` x `height`, capped at 1.
 * Returns 0 only before the stage has been measured. Once measured it never returns
 * less than MIN_SCALE: a squeezed stage scrolls rather than swallowing the map.
 */
export function computeScale(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 0;
  // Reserve EDGE_MARGIN so the outermost planet's 44px hit area stays inside the box.
  const usableRadius = Math.min(width, height) / 2 - EDGE_MARGIN;
  return clamp(usableRadius / DESIGN_OUTER_ORBIT, MIN_SCALE, 1);
}

export function computeLayout(planetList: PlanetData[], scale: number): PlanetLayout[] {
  // On small screens the true relative distances squeeze the inner planets into a few
  // pixels of each other, so blend towards evenly spaced orbits as the scale shrinks.
  const spread = clamp((0.6 - scale) / 0.35, 0, 1);
  const step = (DESIGN_MAX_RADIUS - DESIGN_MIN_RADIUS) / (planetList.length - 1);

  return planetList.map((planet, index) => {
    const evenRadius = DESIGN_MIN_RADIUS + step * index;
    const designRadius = planet.orbitRadius + (evenRadius - planet.orbitRadius) * spread;
    const dotSize = Math.max(MIN_DOT_SIZE, planet.size * 2 * scale);
    return {
      orbitRadius: designRadius * scale,
      dotSize,
      hitSize: Math.max(MIN_HIT_SIZE, dotSize + 20),
    };
  });
}
