import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { MassUnit } from "#root/pc/units/massUnits";
import { MultiplyUnit } from "#root/pc/units/mulitplyUnits";
import { PowerUnit } from "#root/pc/units/powerUnits";
import { TimeUnit } from "#root/pc/units/timeUnits";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

export class Planet {
  name: string;
  scientificName: string;
  galaxy: string;
  system: string;
  radius: Measure;
  mass: Measure;
  surfaceArea: Measure;
  gravity: Measure;
  distanceFromSun: Measure;

  constructor(
    name: string,
    scientificName: string,
    galaxy: string,
    system: string,
    radius: Measure,
    mass: Measure,
    surfaceArea: Measure,
    gravity: Measure,
    distanceFromSun: Measure,
  ) {
    this.name = name;
    this.scientificName = scientificName;
    this.galaxy = galaxy;
    this.system = system;
    this.radius = radius;
    this.mass = mass;
    this.surfaceArea = surfaceArea;
    this.gravity = gravity;
    this.distanceFromSun = distanceFromSun;
  }
}

export const planets: Planet[] = [
  new Planet(
    "Mercure",
    "Mercury",
    "Voie Lactée",
    "Système Solaire",
    new Measure(2.4397, 3, DistanceUnit.km),
    new Measure(3.3011, 23, MassUnit.kg),
    new Measure(7.48, 7, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      3.7,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(5.79, 7, DistanceUnit.km),
  ),
  new Planet(
    "Vénus",
    "Venus",
    "Voie Lactée",
    "Système Solaire",
    new Measure(6.0518, 3, DistanceUnit.km),
    new Measure(48.675, 23, MassUnit.kg),
    new Measure(46.0, 7, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      8.87,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(10.82, 7, DistanceUnit.km),
  ),
  new Planet(
    "Terre",
    "Earth",
    "Voie Lactée",
    "Système Solaire",
    new Measure(6.371, 3, DistanceUnit.km),
    new Measure(5.972, 24, MassUnit.kg),
    new Measure(51.0, 7, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      9.81,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(14.96, 7, DistanceUnit.km),
  ),
  new Planet(
    "Mars",
    "Mars",
    "Voie Lactée",
    "Système Solaire",
    new Measure(3.3895, 3, DistanceUnit.km),
    new Measure(0.64171, 24, MassUnit.kg),
    new Measure(14.48, 6, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      3.71,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(22.79, 7, DistanceUnit.km),
  ),
  new Planet(
    "Jupiter",
    "Jupiter",
    "Voie Lactée",
    "Système Solaire",
    new Measure(69.911, 3, DistanceUnit.km),
    new Measure(18986, 23, MassUnit.kg),
    new Measure(614.19, 6, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      24.79,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(77.84, 7, DistanceUnit.km),
  ),
  new Planet(
    "Saturne",
    "Saturn",
    "Voie Lactée",
    "Système Solaire",
    new Measure(58.232, 3, DistanceUnit.km),
    new Measure(5683, 23, MassUnit.kg),
    new Measure(427.0, 6, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      10.44,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(143.35, 7, DistanceUnit.km),
  ),
  new Planet(
    "Uranus",
    "Uranus",
    "Voie Lactée",
    "Système Solaire",
    new Measure(25.362, 3, DistanceUnit.km),
    new Measure(868.13, 23, MassUnit.kg),
    new Measure(808.3, 6, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      8.69,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(287.25, 7, DistanceUnit.km),
  ),
  new Planet(
    "Neptune",
    "Neptune",
    "Voie Lactée",
    "Système Solaire",
    new Measure(24.622, 3, DistanceUnit.km),
    new Measure(1024.13, 23, MassUnit.kg),
    new Measure(761.8, 6, new MultiplyUnit(MassUnit.kg, MassUnit.kg)),
    new Measure(
      11.15,
      0,
      new DivideUnit(
        DistanceUnit.m,
        new PowerUnit(TimeUnit.s, new NumberNode(2)),
      ),
    ),
    new Measure(449.51, 7, DistanceUnit.km),
  ),
];
