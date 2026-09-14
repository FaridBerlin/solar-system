import { PlanetData } from '../data/planets';

export function getPlanetGradient(planet: PlanetData): string {
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
