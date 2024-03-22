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
import { discreteSetKeys } from "#root/exercises/utils/keys/discreteSetKeys";
import { blues, oranges, randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { random } from "#root/utils/random";

type Identifiers = {
  yValue: number;
  fSplinePoints: number[][];
  gSplinePoints: number[][];
};

const getTwoFunctionsEquationQuestion: QuestionGenerator<Identifiers> = () => {
  const yValue = randint(-5, 5);
  let xSolutions: number[] = [];
  const nb = randint(2, 4);

  for (let i = 0; i < nb; i++) {
    xSolutions.push(randint(-9, 10, xSolutions));
  }
  xSolutions.sort((a, b) => a - b);
  const answer = new EquationSolutionNode(
    new DiscreteSetNode(xSolutions.map((sol) => new NumberNode(sol))),
  ).toTex();
  const fSplinePoints: [number, number][] = [];
  const gSplinePoints: [number, number][] = [];

  let prevYWasAbove: boolean = coinFlip();

  fSplinePoints.push([
    xSolutions[0] - (1 + Math.random() * 3),
    yValue + (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);
  gSplinePoints.push([
    xSolutions[0] - (1 + Math.random() * 3),
    yValue - (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);
  prevYWasAbove = !prevYWasAbove;

  for (let i = 0; i < xSolutions.length; i++) {
    fSplinePoints.push([xSolutions[i], yValue]);
    gSplinePoints.push([xSolutions[i], yValue]);

    if (i < xSolutions.length - 1) {
      const mid = (xSolutions[i] + xSolutions[i + 1]) / 2;
      const distance = xSolutions[i + 1] - xSolutions[i];
      const x = mid + ((Math.random() * 2) / 5) * (distance / 2);
      fSplinePoints.push([
        x,
        yValue + (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
      ]);
      gSplinePoints.push([
        x,
        yValue - (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
      ]);
      prevYWasAbove = !prevYWasAbove;
    }
  }

  fSplinePoints.push([
    xSolutions[xSolutions.length - 1] + (1 + Math.random() * 3),
    yValue + (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);

  gSplinePoints.push([
    xSolutions[xSolutions.length - 1] + (1 + Math.random() * 3),
    yValue - (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);

  const xMin = Math.min(
    ...[...fSplinePoints, ...gSplinePoints].map((point) => point[0]),
  );
  const yMin = Math.min(
    ...[...fSplinePoints, ...gSplinePoints].map((point) => point[1]),
  );
  const xMax = Math.max(
    ...[...fSplinePoints, ...gSplinePoints].map((point) => point[0]),
  );
  const yMax = Math.max(
    ...[...fSplinePoints, ...gSplinePoints].map((point) => point[1]),
  );

  const fColor = random(blues);
  const gColor = random(oranges);
  const commands = [
    `S = Spline(${fSplinePoints
      .map((point) => `(${point[0]},${point[1]})`)
      .join(",")})`,
    "SetFixed(S, true)",
    `SetColor(S, "${fColor}")`,
    `SetCaption(S, "$f$")`,
    `ShowLabel(S, true)`,
    `T = Spline(${gSplinePoints
      .map((point) => `(${point[0]},${point[1]})`)
      .join(",")})`,
    "SetFixed(T, true)",
    `SetColor(T, "${gColor}")`,
    `SetCaption(T, "$g$")`,
    `ShowLabel(T, true)`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer graphiquement les solutions de l'équation $f(x) = g(x)$ où $f$ et $g$ sont les fonctions représentées ci-dessous.`,
    keys: discreteSetKeys,
    answerFormat: "tex",
    identifiers: { yValue, fSplinePoints, gSplinePoints },
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMax, xMin, yMax, yMin }),
    options: ggb.getOptions(),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `S=\\varnothing`);
  while (propositions.length < n) {
    const nbs: number[] = [];
    const nbSol = randint(2, 4);
    for (let i = 0; i < nbSol; i++) {
      nbs.push(randint(-9, 10, nbs));
    }
    nbs.sort((a, b) => a - b);
    const sol = new EquationSolutionNode(
      new DiscreteSetNode(nbs.map((nb) => new NumberNode(nb))),
    );
    tryToAddWrongProp(propositions, sol.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, fSplinePoints, yValue },
) => {
  const xSolutions = fSplinePoints
    .filter((p) => p[1] === yValue)
    .map((p) => p[0]);
  const answerTree = new EquationSolutionNode(
    new DiscreteSetNode(xSolutions.map((sol) => new NumberNode(sol))),
  );
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};
export const twoFunctionsEquation: Exercise<Identifiers> = {
  id: "twoFunctionsEquation",
  label: "Résoudre graphiquement une équation du type $f(x)=g(x)$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getTwoFunctionsEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
