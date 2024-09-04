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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";

import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  yValue: number;
  splinePoints: [number, number][];
  isStrict: boolean;
  isAskingSup: boolean;
  intervals: { a: number; b: number; closure: ClosureType }[];
};

const getGraphicInequationQuestion: QuestionGenerator<Identifiers> = () => {
  let xSolutions: number[] = [];
  const nb = randint(2, 4);

  for (let i = 0; i < nb; i++) {
    xSolutions.push(randint(-9, 10, xSolutions));
  }
  xSolutions.sort((a, b) => a - b);
  const isAskingSup = coinFlip();
  const isStrict = coinFlip();
  const intervals: { a: number; b: number; closure: ClosureType }[] = [];
  const yValue = randint(-5, 6);
  const splinePoints: [number, number][] = [];
  let prevYWasAbove: boolean = coinFlip();
  if (!isStrict || coinFlip()) {
    //le !isStrict sert à empcher les points uniques solution
    const x = xSolutions[0] - randint(1, 3);
    const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
    if ((y > 0 && isAskingSup) || (y < 0 && !isAskingSup)) {
      intervals.push({
        a: x,
        b: xSolutions[0],
        closure: isStrict ? ClosureType.FO : ClosureType.FF,
      });
    }
    prevYWasAbove = y > 0;
    splinePoints.push([x, yValue + y]);
  }
  for (let i = 0; i < xSolutions.length; i++) {
    splinePoints.push([xSolutions[i], yValue]);
    if (i < xSolutions.length - 1) {
      const mid = (xSolutions[i] + xSolutions[i + 1]) / 2;
      const distance = xSolutions[i + 1] - xSolutions[i];
      const x = mid + ((Math.random() * 2) / 5) * (distance / 2);
      const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
      if ((y > 0 && isAskingSup) || (y < 0 && !isAskingSup)) {
        intervals.push({
          a: xSolutions[i],
          b: xSolutions[i + 1],
          closure: isStrict ? ClosureType.OO : ClosureType.FF,
        });
      }
      prevYWasAbove = y > 0;
      splinePoints.push([x, yValue + y]);
    }
  }
  if (!isStrict || coinFlip() || splinePoints.length < 4) {
    const x = xSolutions[xSolutions.length - 1] + randint(1, 3);
    const y = prevYWasAbove ? randint(-2, 0) : randint(1, 3);
    if ((y > 0 && isAskingSup) || (y < 0 && !isAskingSup)) {
      intervals.push({
        a: xSolutions[xSolutions.length - 1],
        b: x,
        closure: isStrict ? ClosureType.OF : ClosureType.FF,
      });
    }
    prevYWasAbove = y > 0;
    splinePoints.push([x, yValue + y]);
  }
  const xMin = Math.min(...splinePoints.map((point) => point[0]));
  const yMin = Math.min(...splinePoints.map((point) => point[1]));
  const xMax = Math.max(...splinePoints.map((point) => point[0]));
  const yMax = Math.max(...splinePoints.map((point) => point[1]));

  const intervalsNodes = intervals.map(
    (i) =>
      new IntervalNode(new NumberNode(i.a), new NumberNode(i.b), i.closure),
  );
  const answer =
    intervalsNodes.length === 1
      ? `S=\\ ${intervalsNodes[0].toTex()}`
      : `S=\\ ${new UnionIntervalNode(intervalsNodes).toTex()}`;

  const commands = [
    `S =Spline(${splinePoints
      .map((point) => `(${point[0]},${point[1]})`)
      .join(",")})`,
    "SetFixed(S, true)",
    `SetColor(S, "${randomColor()}")`,
  ];
  const ggb = new GeogebraConstructor({ commands });
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer graphiquement les solutions de l'inéquation $f(x)${
      isAskingSup ? (isStrict ? ">" : "\\geq") : isStrict ? "<" : "\\leq"
    }${yValue}$ où $f$ est la fonction représentée ci-dessous.`,
    keys: [
      "S",
      "equal",
      "lbracket",
      "semicolon",
      "rbracket",
      "cup",
      "lbrace",
      "rbrace",
      "varnothing",
    ],
    answerFormat: "tex",
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),

    identifiers: {
      yValue,
      splinePoints,
      isAskingSup,
      isStrict,
      intervals,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, intervals, splinePoints, yValue },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `S=\\varnothing`);
  tryToAddWrongProp(
    propositions,
    `S=\\ ${new IntervalNode(
      new NumberNode(splinePoints[0][0]),
      new NumberNode(yValue),
      ClosureType.FF,
    ).toTex()}`,
  );
  while (propositions.length < n) {
    const a = randint(-9, 3);
    const b = randint(3, 10, [a]);
    tryToAddWrongProp(
      propositions,
      `S=\\ ${new IntervalNode(
        new NumberNode(a),
        new NumberNode(b),
        ClosureType.FF,
      ).toTex()}`,
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { intervals }) => {
  const intervalsNodes = intervals.map(
    (n) =>
      new IntervalNode(new NumberNode(n.a), new NumberNode(n.b), n.closure),
  );
  const intervalsTree =
    intervalsNodes.length === 1
      ? intervalsNodes[0]
      : new UnionIntervalNode(intervalsNodes);
  const answerTree = new InequationSolutionNode(intervalsTree);
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};
export const graphicInequation: Exercise<Identifiers> = {
  id: "graphicInequation",
  connector: "\\iff",
  label: "Résoudre graphiquement une inéquation",
  levels: ["2ndPro", "2nde", "1rePro", "1reESM", "1reTech"],
  isSingleStep: true,
  sections: ["Inéquations", "Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getGraphicInequationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
