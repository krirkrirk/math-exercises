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
import {
  InegalitySymbols,
  InequationSymbol,
  InequationSymbolConstructor,
} from "#root/math/inequations/inequation";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";
import { random } from "#root/utils/random";

type Identifiers = {
  yValue: number;
  fSplinePoints: number[][];
  gSplinePoints: number[][];
  ineqSymbol: InegalitySymbols;
  intervals: { a: number; b: number; closure: ClosureType }[];
};
const getTwoFunctionsInequationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const ineq = InequationSymbolConstructor.random();
  const yValue = randint(-5, 5);
  let xSolutions: number[] = [];
  const nb = randint(2, 4);

  for (let i = 0; i < nb; i++) {
    xSolutions.push(randint(-9, 10, xSolutions));
  }
  xSolutions.sort((a, b) => a - b);

  const fSplinePoints: [number, number][] = [];
  const gSplinePoints: [number, number][] = [];

  let prevYWasAbove: boolean = coinFlip();
  const intervals: { a: number; b: number; closure: ClosureType }[] = [];

  const xStart = xSolutions[0] - randint(1, 4);
  fSplinePoints.push([
    xStart,
    yValue + (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);
  gSplinePoints.push([
    xStart,
    yValue - (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);
  if ((ineq.isSup && !prevYWasAbove) || (!ineq.isSup && prevYWasAbove))
    intervals.push({
      a: xStart,
      b: xSolutions[0],
      closure: ineq.isStrict ? ClosureType.FO : ClosureType.FF,
    });

  prevYWasAbove = !prevYWasAbove;

  for (let i = 0; i < xSolutions.length; i++) {
    fSplinePoints.push([xSolutions[i], yValue]);
    gSplinePoints.push([xSolutions[i], yValue]);

    if (i < xSolutions.length - 1) {
      const mid = (xSolutions[i] + xSolutions[i + 1]) / 2;
      const distance = xSolutions[i + 1] - xSolutions[i];
      const x = mid + ((Math.random() * 2) / 5) * (distance / 2);
      if ((!prevYWasAbove && ineq.isSup) || (prevYWasAbove && !ineq.isSup)) {
        intervals.push({
          a: xSolutions[i],
          b: xSolutions[i + 1],
          closure: ineq.isStrict ? ClosureType.OO : ClosureType.FF,
        });
      }
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

  const xEnd = xSolutions[xSolutions.length - 1] + randint(1, 4);
  fSplinePoints.push([
    xEnd,
    yValue + (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);

  gSplinePoints.push([
    xEnd,
    yValue - (prevYWasAbove ? randint(-2, 0) : randint(1, 3)),
  ]);
  if ((ineq.isSup && !prevYWasAbove) || (!ineq.isSup && prevYWasAbove))
    intervals.push({
      a: xSolutions[xSolutions.length - 1],
      b: xEnd,
      closure: ineq.isStrict ? ClosureType.OF : ClosureType.FF,
    });

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
  const intervalsNodes = intervals.map(
    (i) =>
      new IntervalNode(new NumberNode(i.a), new NumberNode(i.b), i.closure),
  );
  const answer =
    intervalsNodes.length === 1
      ? `S=\\ ${intervalsNodes[0].toTex()}`
      : `S=\\ ${new UnionIntervalNode(intervalsNodes).toTex()}`;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Déterminer graphiquement les solutions de l'inéquation $f(x) ${ineq.symbol} g(x)$ où $f$ et $g$ sont les fonctions représentées ci-dessous.`,
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
    identifiers: {
      yValue,
      fSplinePoints,
      gSplinePoints,
      ineqSymbol: ineq.symbol,
      intervals,
    },
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMax, xMin, yMax, yMin }),
    options: ggb.getOptions(),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, intervals, fSplinePoints, ineqSymbol },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  if (coinFlip()) tryToAddWrongProp(propositions, `S=\\varnothing`);
  if (intervals.length === 1) {
    const interval = new IntervalNode(
      intervals[0].a.toTree(),
      intervals[0].b.toTree(),
      intervals[0].closure,
    );
    tryToAddWrongProp(
      propositions,
      `S=\\ ${interval.toRandomDifferentClosure().toTex()}`,
    );
  } else {
    const rightIntervals = intervals.map(
      (i) => new IntervalNode(i.a.toTree(), i.b.toTree(), i.closure),
    );
    const fakeIntervals = intervals.map(
      (i) => new IntervalNode(i.a.toTree(), i.b.toTree(), i.closure),
    );

    tryToAddWrongProp(
      propositions,
      `S=\\ ${rightIntervals[coinFlip() ? 0 : 1].toTex()}`,
    );
    tryToAddWrongProp(
      propositions,
      `S=\\ ${new UnionIntervalNode(
        fakeIntervals.map((i) => i.toRandomDifferentClosure()),
      ).toTex()}`,
    );
  }
  while (propositions.length < n) {
    const isStrict = ineqSymbol === "<" || ineqSymbol === ">";
    const x1 = randint(-10, -5);
    const x2 = randint(x1 + 1, x1 + 5);
    const x3 = randint(x2 + 3, x2 + 6);
    const x4 = randint(x3 + 1, x3 + 3);
    tryToAddWrongProp(
      propositions,
      `S=\\ ${new UnionIntervalNode([
        new IntervalNode(
          x1.toTree(),
          x2.toTree(),
          isStrict ? ClosureType.FO : ClosureType.FF,
        ),
        new IntervalNode(
          x3.toTree(),
          x4.toTree(),
          isStrict ? ClosureType.OF : ClosureType.FF,
        ),
      ]).toTex()}`,
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, fSplinePoints, yValue, intervals },
) => {
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
export const twoFunctionsInequation: Exercise<Identifiers> = {
  id: "twoFunctionsInequation",
  label: "Résoudre graphiquement une inéquation du type $f(x)<g(x)$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions"],
  generator: (nb: number) =>
    getDistinctQuestions(getTwoFunctionsInequationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
