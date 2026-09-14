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

/** Smallest a planet is ever drawn, so Mercury stays visible when scaled down. */
const MIN_DOT_SIZE = 10;
/** Minimum tap target (WCAG 2.5.8 target size), independent of the drawn dot. */
const MIN_HIT_SIZE = 44;

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

/** Scale factor that fits the full system inside `width` x `height`, capped at 1. */
export function computeScale(width: number, height: number): number {
  if (width <= 0 || height <= 0) return 0;
  const box = Math.min(width, height) - 16; // small gutter so the outer orbit isn't flush
  return clamp(box / (DESIGN_EXTENT * 2), 0, 1);
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
