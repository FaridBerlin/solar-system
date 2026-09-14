export interface PlanetData {
  id: string;
  name: string;
  color: string;
  size: number; // radius in pixels for display
  orbitRadius: number; // distance from sun in pixels
  orbitalPeriod: number; // in Earth days
  realDiameter: string; // km
  realDistance: string; // million km from sun
  description: string;
  moons: number;
  type: string;
}

export const planets: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: '#b5b5b5',
    size: 6,
    orbitRadius: 70,
    orbitalPeriod: 88,
    realDiameter: '4,879 km',
    realDistance: '57.9 million km',
    description: 'The smallest planet and closest to the Sun. It has no atmosphere and extreme temperature variations.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'venus',
    name: 'Venus',
    color: '#e8cda0',
    size: 10,
    orbitRadius: 100,
    orbitalPeriod: 225,
    realDiameter: '12,104 km',
    realDistance: '108.2 million km',
    description: 'Often called Earth\'s twin due to similar size. It has a thick toxic atmosphere and is the hottest planet.',
    moons: 0,
    type: 'Terrestrial',
  },
  {
    id: 'earth',
    name: 'Earth',
    color: '#4fa3e0',
    size: 11,
    orbitRadius: 140,
    orbitalPeriod: 365,
    realDiameter: '12,742 km',
    realDistance: '149.6 million km',
    description: 'Our home planet. The only known planet to harbor life, with liquid water on its surface.',
    moons: 1,
    type: 'Terrestrial',
  },
  {
    id: 'mars',
    name: 'Mars',
    color: '#e07040',
    size: 8,
    orbitRadius: 185,
    orbitalPeriod: 687,
    realDiameter: '6,779 km',
    realDistance: '227.9 million km',
    description: 'The Red Planet, named for its reddish appearance. It has the largest volcano in the solar system.',
    moons: 2,
    type: 'Terrestrial',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: '#c8a060',
    size: 24,
    orbitRadius: 250,
    orbitalPeriod: 4333,
    realDiameter: '139,820 km',
    realDistance: '778.5 million km',
    description: 'The largest planet in our solar system. A gas giant with a famous Great Red Spot storm.',
    moons: 95,
    type: 'Gas Giant',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: '#e8d080',
    size: 20,
    orbitRadius: 320,
    orbitalPeriod: 10759,
    realDiameter: '116,460 km',
    realDistance: '1,434 million km',
    description: 'Known for its spectacular ring system made of ice and rock. A gas giant with low density.',
    moons: 146,
    type: 'Gas Giant',
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: '#7ec8e3',
    size: 16,
    orbitRadius: 385,
    orbitalPeriod: 30687,
    realDiameter: '50,724 km',
    realDistance: '2,871 million km',
    description: 'An ice giant that rotates on its side. It has a blue-green color due to methane in its atmosphere.',
    moons: 28,
    type: 'Ice Giant',
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: '#4060e0',
    size: 15,
    orbitRadius: 440,
    orbitalPeriod: 60190,
    realDiameter: '49,244 km',
    realDistance: '4,495 million km',
    description: 'The windiest planet with speeds up to 2,100 km/h. The farthest planet from the Sun.',
    moons: 16,
    type: 'Ice Giant',
  },
];
