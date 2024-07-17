import { Measure } from "#root/pc/measure/measure";

export class Planet {
  name: string;
  scientificName: string;
  galaxy: string;
  system: string;
  radius: { measure: Measure; unit: string };
  mass: { measure: Measure; unit: string };
  surfaceArea: { measure: Measure; unit: string };
  gravity: { measure: Measure; unit: string };
  distanceFromSun: { measure: Measure; unit: string };

  constructor(
    name: string,
    scientificName: string,
    galaxy: string,
    system: string,
    radius: { value: number; exponent: number; unit: string },
    mass: { value: number; exponent: number; unit: string },
    surfaceArea: { value: number; exponent: number; unit: string },
    gravity: { value: number; exponent: number; unit: string },
    distanceFromSun: { value: number; exponent: number; unit: string },
  ) {
    this.name = name;
    this.scientificName = scientificName;
    this.galaxy = galaxy;
    this.system = system;
    this.radius = {
      measure: new Measure(radius.value, radius.exponent),
      unit: radius.unit,
    };
    this.mass = {
      measure: new Measure(mass.value, mass.exponent),
      unit: mass.unit,
    };
    this.surfaceArea = {
      measure: new Measure(surfaceArea.value, surfaceArea.exponent),
      unit: surfaceArea.unit,
    };
    this.gravity = {
      measure: new Measure(gravity.value, gravity.exponent),
      unit: gravity.unit,
    };
    this.distanceFromSun = {
      measure: new Measure(distanceFromSun.value, distanceFromSun.exponent),
      unit: distanceFromSun.unit,
    };
  }
}

export const planets: Planet[] = [
  new Planet(
    "Mercure",
    "Mercury",
    "Voie Lactée",
    "Système Solaire",
    { value: 2.4397, exponent: 3, unit: "km" },
    { value: 3.3011, exponent: 23, unit: "kg" },
    { value: 7.48, exponent: 7, unit: "km²" },
    { value: 3.7, exponent: 0, unit: "m/s²" },
    { value: 5.79, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Vénus",
    "Venus",
    "Voie Lactée",
    "Système Solaire",
    { value: 6.0518, exponent: 3, unit: "km" },
    { value: 48.675, exponent: 23, unit: "kg" },
    { value: 46.0, exponent: 7, unit: "km²" },
    { value: 8.87, exponent: 0, unit: "m/s²" },
    { value: 10.82, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Terre",
    "Earth",
    "Voie Lactée",
    "Système Solaire",
    { value: 6.371, exponent: 3, unit: "km" },
    { value: 5.972, exponent: 24, unit: "kg" },
    { value: 51.0, exponent: 7, unit: "km²" },
    { value: 9.81, exponent: 0, unit: "m/s²" },
    { value: 14.96, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Mars",
    "Mars",
    "Voie Lactée",
    "Système Solaire",
    { value: 3.3895, exponent: 3, unit: "km" },
    { value: 0.64171, exponent: 24, unit: "kg" },
    { value: 14.48, exponent: 6, unit: "km²" },
    { value: 3.71, exponent: 0, unit: "m/s²" },
    { value: 22.79, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Jupiter",
    "Jupiter",
    "Voie Lactée",
    "Système Solaire",
    { value: 69.911, exponent: 3, unit: "km" },
    { value: 18986, exponent: 23, unit: "kg" },
    { value: 614.19, exponent: 6, unit: "km²" },
    { value: 24.79, exponent: 0, unit: "m/s²" },
    { value: 77.84, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Saturne",
    "Saturn",
    "Voie Lactée",
    "Système Solaire",
    { value: 58.232, exponent: 3, unit: "km" },
    { value: 5683, exponent: 23, unit: "kg" },
    { value: 427.0, exponent: 6, unit: "km²" },
    { value: 10.44, exponent: 0, unit: "m/s²" },
    { value: 143.35, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Uranus",
    "Uranus",
    "Voie Lactée",
    "Système Solaire",
    { value: 25.362, exponent: 3, unit: "km" },
    { value: 868.13, exponent: 23, unit: "kg" },
    { value: 808.3, exponent: 6, unit: "km²" },
    { value: 8.69, exponent: 0, unit: "m/s²" },
    { value: 287.25, exponent: 7, unit: "km" },
  ),
  new Planet(
    "Neptune",
    "Neptune",
    "Voie Lactée",
    "Système Solaire",
    { value: 24.622, exponent: 3, unit: "km" },
    { value: 1024.13, exponent: 23, unit: "kg" },
    { value: 761.8, exponent: 6, unit: "km²" },
    { value: 11.15, exponent: 0, unit: "m/s²" },
    { value: 449.51, exponent: 7, unit: "km" },
  ),
];
