export interface PlanetData {
  id: string;
  name: string;
  color: string;
  size: number; // radius in pixels for display
  orbitRadius: number; // distance from sun in pixels
  orbitalPeriod: number; // in Earth days
  diameterKm: number; // equatorial diameter in km
  distanceMillionKm: number; // average distance from the sun, in millions of km
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
    diameterKm: 4879,
    distanceMillionKm: 57.9,
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
    diameterKm: 12104,
    distanceMillionKm: 108.2,
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
    diameterKm: 12742,
    distanceMillionKm: 149.6,
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
    diameterKm: 6779,
    distanceMillionKm: 227.9,
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
    diameterKm: 139820,
    distanceMillionKm: 778.5,
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
    diameterKm: 116460,
    distanceMillionKm: 1434,
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
    diameterKm: 50724,
    distanceMillionKm: 2871,
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
    diameterKm: 49244,
    distanceMillionKm: 4495,
    description: 'The windiest planet with speeds up to 2,100 km/h. The farthest planet from the Sun.',
    moons: 16,
    type: 'Ice Giant',
  },
];
