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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import {
  DiscreteSetNode,
  EmptySet,
} from "#root/tree/nodes/sets/discreteSetNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  yValue: number;
  splinePoints: [number, number][];
};

const getGraphicEquationQuestion: QuestionGenerator<Identifiers> = () => {
  let xSolutions: number[] = [];
  const nb = randint(2, 4);
  // const nb = 2;
  for (let i = 0; i < nb; i++) {
    xSolutions.push(randint(-9, 10, xSolutions));
  }
  xSolutions.sort((a, b) => a - b);
  const answer = new EquationSolutionNode(
    new DiscreteSetNode(xSolutions.map((sol) => new NumberNode(sol))),
  ).toTex();
  const yValue = randint(-5, 6);
  const splinePoints: [number, number][] = [];
  let prevYWasAbove: boolean = coinFlip();
  if (coinFlip()) {
    const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
    prevYWasAbove = y > 0;
    splinePoints.push([xSolutions[0] - (1 + Math.random() * 3), yValue + y]);
  }
  for (let i = 0; i < xSolutions.length; i++) {
    splinePoints.push([xSolutions[i], yValue]);
    if (i < xSolutions.length - 1) {
      const mid = (xSolutions[i] + xSolutions[i + 1]) / 2;
      const distance = xSolutions[i + 1] - xSolutions[i];
      const x = mid + ((Math.random() * 2) / 5) * (distance / 2);
      const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
      prevYWasAbove = y > 0;
      splinePoints.push([x, yValue + y]);
    }
  }
  if (coinFlip() || splinePoints.length < 4) {
    const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
    prevYWasAbove = y > 0;
    splinePoints.push([
      xSolutions[xSolutions.length - 1] + (1 + Math.random() * 3),
      yValue + y,
    ]);
  }
  const xMin = Math.min(...splinePoints.map((point) => point[0]));
  const yMin = Math.min(...splinePoints.map((point) => point[1]));
  const xMax = Math.max(...splinePoints.map((point) => point[0]));
  const yMax = Math.max(...splinePoints.map((point) => point[1]));

  const commands = [
    `S = Spline(${splinePoints
      .map((point) => `(${point[0]},${point[1]})`)
      .join(",")})`,
    "SetFixed(S, true)",
    `SetColor(S, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor({
    commands,
  });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer graphiquement les solutions de l'équation $f(x) = ${yValue}$ où $f$ est la fonction représentée ci-dessous.`,
    keys: discreteSetKeys,
    answerFormat: "tex",
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),
    identifiers: { yValue, splinePoints },
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

const isAnswerValid: VEA<Identifiers> = (ans, { yValue, splinePoints }) => {
  const xSolutions = splinePoints
    .filter((p) => p[1] === yValue)
    .map((p) => p[0]);
  const answerTree = new EquationSolutionNode(
    new DiscreteSetNode(xSolutions.map((sol) => new NumberNode(sol))),
  );
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};
export const graphicEquation: Exercise<Identifiers> = {
  id: "graphicEquation",
  connector: "\\iff",
  label: "Résoudre graphiquement une équation",
  levels: ["2ndPro", "2nde", "1rePro", "1reESM", "1reTech"],
  isSingleStep: true,
  sections: ["Équations", "Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getGraphicEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
