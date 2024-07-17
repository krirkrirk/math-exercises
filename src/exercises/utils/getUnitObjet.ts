import { DistanceUnit } from "#root/pc/distanceUnits";
import { MassUnit } from "#root/pc/massUnits";

export const getMassUnitObjet = (unit: string) => {
  switch (unit) {
    case "kg":
      return MassUnit.kg;

    case "hg":
      return MassUnit.hg;
    case "dag":
      return MassUnit.dag;
    case "g":
      return MassUnit.g;
    case "dg":
      return MassUnit.dg;
    case "cg":
      return MassUnit.cg;
    case "mg":
      return MassUnit.mg;
  }
};

export const getDistanceUnitObjet = (unit: string) => {
  switch (unit) {
    case "km":
      return DistanceUnit.km;
    case "hm":
      return DistanceUnit.hm;
    case "dam":
      return DistanceUnit.dam;
    case "m":
      return DistanceUnit.m;
    case "dm":
      return DistanceUnit.dm;
    case "cm":
      return DistanceUnit.cm;
    case "mm":
      return DistanceUnit.mm;
  }
};
