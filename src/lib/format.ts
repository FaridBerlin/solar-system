export type DistanceUnit = 'km' | 'mi';

const MILES_PER_KM = 0.621371;

function withThousands(value: number, fractionDigits = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Planet diameter, e.g. "12,742 km" / "7,918 mi". */
export function formatDiameter(km: number, unit: DistanceUnit): string {
  const value = unit === 'km' ? km : km * MILES_PER_KM;
  return `${withThousands(Math.round(value))} ${unit}`;
}

/** Distance from the sun, given in millions of km, e.g. "149.6 million km". */
export function formatDistance(millionKm: number, unit: DistanceUnit): string {
  const value = unit === 'km' ? millionKm : millionKm * MILES_PER_KM;
  // Keep one decimal for the inner planets, drop it once the numbers get large.
  return `${withThousands(value, value >= 1000 ? 0 : 1)} million ${unit}`;
}

/** Orbital period in Earth days, with a years hint for the slow outer planets. */
export function formatOrbitalPeriod(days: number): string {
  const base = `${withThousands(days)} days`;
  if (days < 365) return base;
  const years = days / 365.25;
  return `${base} (${withThousands(years, years < 10 ? 1 : 0)} years)`;
}
