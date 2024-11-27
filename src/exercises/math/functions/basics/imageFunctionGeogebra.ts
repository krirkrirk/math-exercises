import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  RebuildIdentifiers,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { numberVEA } from "#root/exercises/vea/numberVEA";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Lagrange } from "#root/geogebra/lagrange";
import { Spline } from "#root/geogebra/spline";
import { Point } from "#root/math/geometry/point";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  /**old */
  // rand: boolean;
  // poly1: number[];
  // poly2: number[];
  isSpline: boolean;
  // xValue: number;
  splinePoints: number[][];
  x: number;
  y: number;
};

const getImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const x = randint(-8, 9);
  const y = randint(-8, 9);

  const isSpline = coinFlip();
  const spline = new (isSpline ? Spline : Lagrange)(
    new IntervalNode((-10).toTree(), (10).toTree(), ClosureType.FF),
    [
      new Point("A", x.toTree(), y.toTree()),
      //distractor point with ordonnée = x
      new Point(
        "B",
        (y + randint(-3, 4, [0, x - y, 10 - y, -10 - y])).toTree(),
        x.toTree(),
      ),
    ],
  );
  const ggb = new GeogebraConstructor({ commands: spline.getCommands() });
  const xMin = spline.points[0][0];
  const xMax = spline.points[spline.points.length - 1][0];
  const yMin = Math.min(...spline.points.map((p) => p[1])) - 1;
  const yMax = Math.max(...spline.points.map((p) => p[1])) + 1;
  const instruction = `Quelle est l'image de $${x}$ par la fonction $f$ représentée ci dessous ?`;
  const question: Question<Identifiers> = {
    instruction,
    startStatement: `f(${x})`,
    answer: y.frenchify(),
    keys: [],
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({
        forceShowAxes: true,
        xMax,
        xMin,
        yMax,
        yMin,
      }),
    }),
    answerFormat: "tex",
    identifiers: {
      splinePoints: spline.points,
      x,
      y,
      isSpline,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, splinePoints, x, y },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  //old questions have spline POint undefined
  (splinePoints ?? [])
    .filter((p) => p[1] === x)
    .map((e) => round(e[0], 0))
    .forEach((y) => tryToAddWrongProp(propositions, y.frenchify()));
  while (propositions.length < n) {
    const wrongAnswer = Number(answer) + randint(-10, 11, [0]);

    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberVEA(ans, answer);
};
export const imageFunctionGeogebra: Exercise<Identifiers> = {
  id: "imageFunctionGeogebra",
  connector: "=",
  label: "Lecture d'une image",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunctionGeogebra, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
