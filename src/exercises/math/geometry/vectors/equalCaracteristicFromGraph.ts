import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randfloat } from "#root/math/utils/random/randfloat";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  caracAsked: string;
  uPoints: number[][];
  vPoints: number[][];
};

/**
 *
 * Soient deux cercles C1 et C2 de rayon 3 et de centres (-4,0) et (4,0)
 * on construit u dans C1 et v dans C2
 */
const getEqualCaracteristicFromGraphQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let points: number[][][] = [];
  // const caracAsked = random(["sens", "direction", "norme"]);
  let instruction = "";
  const caracAsked = random<
    "sens" | "norme" | "direction" | "egaux" | "opposes"
  >(["opposes"]);
  // ["sens", "norme", "direction", "egaux", "opposes"]
  const isTrue = coinFlip();
  let uPoints: number[][] = [];
  let vPoints: number[][] = [];

  //On construit u dans C1
  const theta = Math.random() * 2 * Math.PI;
  uPoints.push([3 * Math.cos(theta) - 4, 3 * Math.sin(theta)]);
  uPoints.push([
    3 * Math.cos(theta + Math.PI) - 4,
    3 * Math.sin(theta + Math.PI),
  ]);
  let thetaPrime: number;
  let sameDirection: boolean;
  let sameNorm: boolean;
  let sameSens: boolean;
  let rho: number;
  switch (caracAsked) {
    case "direction":
      instruction = "avoir la même direction";
      thetaPrime = isTrue
        ? theta
        : theta + randfloat(1 / 4, 1 / 3) * Math.PI * 2;
      sameNorm = coinFlip();
      rho = sameNorm ? 3 : randfloat(1, 2.5);
      vPoints.push([
        rho * Math.cos(thetaPrime) + 4,
        rho * Math.sin(thetaPrime),
      ]);
      vPoints.push([
        rho * Math.cos(thetaPrime + Math.PI) + 4,
        rho * Math.sin(thetaPrime + Math.PI),
      ]);

      if (coinFlip()) uPoints = [uPoints[1], uPoints[0]];
      if (coinFlip()) [uPoints, vPoints] = [vPoints, uPoints];
      break;
    case "norme":
      instruction = "avoir la même norme";

      sameDirection = coinFlip();
      thetaPrime = sameDirection ? theta : Math.random() * 2 * Math.PI;
      if (isTrue) {
        vPoints.push([3 * Math.cos(thetaPrime) + 4, 3 * Math.sin(thetaPrime)]);
        vPoints.push([
          3 * Math.cos(thetaPrime + Math.PI) + 4,
          3 * Math.sin(thetaPrime + Math.PI),
        ]);
      } else {
        vPoints.push([Math.cos(thetaPrime) + 4, Math.sin(thetaPrime)]);
        vPoints.push([
          Math.cos(thetaPrime + Math.PI) + 4,
          Math.sin(thetaPrime + Math.PI),
        ]);
      }

      if (coinFlip()) uPoints = [uPoints[1], uPoints[0]];
      if (coinFlip()) [uPoints, vPoints] = [vPoints, uPoints];
      break;
    case "sens":
      instruction = "avoir le même sens";

      sameDirection = coinFlip();
      sameNorm = coinFlip();
      thetaPrime =
        isTrue || sameDirection
          ? theta
          : theta + randfloat(1 / 4, 1 / 3) * Math.PI * 2;

      rho = sameNorm ? 3 : randfloat(1, 2.5);

      vPoints.push([
        rho * Math.cos(thetaPrime) + 4,
        rho * Math.sin(thetaPrime),
      ]);
      vPoints.push([
        rho * Math.cos(thetaPrime + Math.PI) + 4,
        rho * Math.sin(thetaPrime + Math.PI),
      ]);
      if (!isTrue) vPoints = [vPoints[1], vPoints[0]];
      if (coinFlip()) [uPoints, vPoints] = [vPoints, uPoints];
      break;
    case "egaux":
      instruction = "être égaux";

      sameDirection = isTrue || coinFlip();
      sameNorm = isTrue || coinFlip();
      sameSens = isTrue || (sameDirection && sameNorm ? false : coinFlip());
      thetaPrime = sameDirection
        ? theta
        : theta + randfloat(1 / 4, 1 / 3) * Math.PI * 2;

      rho = sameNorm ? 3 : randfloat(1, 2);

      vPoints.push([
        rho * Math.cos(thetaPrime) + 4,
        rho * Math.sin(thetaPrime),
      ]);
      vPoints.push([
        rho * Math.cos(thetaPrime + Math.PI) + 4,
        rho * Math.sin(thetaPrime + Math.PI),
      ]);
      if (!sameSens) vPoints = [vPoints[1], vPoints[0]];
      if (coinFlip()) [uPoints, vPoints] = [vPoints, uPoints];
      break;
    case "opposes":
      instruction = "être opposés";
      sameDirection = isTrue || coinFlip();
      sameNorm = isTrue || coinFlip();
      sameSens = !isTrue || (sameDirection && sameNorm ? false : coinFlip());
      thetaPrime = sameDirection
        ? theta
        : theta + randfloat(1 / 4, 1 / 3) * Math.PI * 2;

      rho = sameNorm ? 3 : randfloat(1, 2.5);

      vPoints.push([
        rho * Math.cos(thetaPrime) + 4,
        rho * Math.sin(thetaPrime),
      ]);
      vPoints.push([
        rho * Math.cos(thetaPrime + Math.PI) + 4,
        rho * Math.sin(thetaPrime + Math.PI),
      ]);
      if (!sameSens) vPoints = [vPoints[1], vPoints[0]];
      if (coinFlip()) [uPoints, vPoints] = [vPoints, uPoints];
      break;
  }
  const commands = [
    `u = Vector((${uPoints[0][0]},${uPoints[0][1]}), (${uPoints[1][0]},${uPoints[1][1]}))`,
    `v = Vector((${vPoints[0][0]},${vPoints[0][1]}), (${vPoints[1][0]},${vPoints[1][1]}))`,
    'SetCaption(u, "$\\overrightarrow u$")',
    'SetCaption(v, "$\\overrightarrow v$")',

    "ShowLabel(u, true)",
    "ShowLabel(v,true)",
  ];
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    hideAxes: true,
  });

  const answer = isTrue ? "Oui" : "Non";
  const question: Question<Identifiers> = {
    answer,
    instruction: `Les vecteurs $\\overrightarrow{u}$ et $\\overrightarrow{v}$ suivants semblent-ils ${instruction} ?`,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-8, 8, -4, 4],
    answerFormat: "tex",
    identifiers: { caracAsked, uPoints, vPoints },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const equalCaracteristicFromGraph: Exercise<Identifiers> = {
  id: "equalCaracteristicFromGraph",
  label: "Direction, sens, norme, égalité, opposés",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getEqualCaracteristicFromGraphQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCM",
  hasGeogebra: true,
  subject: "Mathématiques",
};
