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
import { blueMain } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  askConvex: boolean;
  quadcoeffs: number[];
  inflexionPoint: number;
};

function generatePolynomialWithIntegerInflexionPoint(
  degree: number,
  inflexionPointX: number,
): Polynomial {
  let a, b, c, discriminant;

  do {
    a = randint(-5, 5, [0]);
    c = randint(-5, 5, [0]);
    b = -3 * a * inflexionPointX;
    discriminant = b * b - 4 * a * c;
  } while (discriminant < 0);

  const d = degree === 3 ? randint(-5, 5, [0]) : 0;

  const coeffs =
    degree === 3
      ? [d * 0.1, c * 0.1, b * 0.1, a * 0.1]
      : [c * 0.1, b * 0.1, a * 0.1];
  return new Polynomial(coeffs);
}

function generateEvenInflexionPoint() {
  let inflexionPointX;
  do {
    inflexionPointX = randint(-50, 51);
  } while (inflexionPointX % 10 !== 0);
  return inflexionPointX;
}

const getConvexityQuadrinomialsGeoQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const inflexionPointX = generateEvenInflexionPoint() * 0.1;
  const quadrinomial = generatePolynomialWithIntegerInflexionPoint(
    3,
    inflexionPointX,
  );
  const quadcoeffs = quadrinomial.coefficients;

  const trinomial = quadrinomial.derivate();
  const criticalPoints = trinomial.getRoots();

  const yValues = criticalPoints.map((x) => quadrinomial.calculate(x));

  const xMin = Math.min(...criticalPoints) - 5;
  const xMax = Math.max(...criticalPoints) + 5;
  const yMin = Math.min(...yValues, 0) - 5;
  const yMax = Math.max(...yValues, 0) + 5;

  const askConvex = coinFlip();
  let interval;
  if (askConvex) {
    interval =
      quadcoeffs[3] > 0
        ? new IntervalNode(
            inflexionPointX.toTree(),
            PlusInfinityNode,
            ClosureType.OO,
          ).toTex()
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPointX.toTree(),
            ClosureType.OO,
          ).toTex();
  } else {
    interval =
      quadcoeffs[3] <= 0
        ? new IntervalNode(
            inflexionPointX.toTree(),
            PlusInfinityNode,
            ClosureType.OO,
          ).toTex()
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPointX.toTree(),
            ClosureType.OO,
          ).toTex();
  }

  const questionType = askConvex ? "convexe" : "concave";
  const instruction = `Ci-dessous est tracée la courbe représentative $\\mathcal C_f$ d'une fonction $f$. Sur quel intervalle $f$ est-elle ${questionType} ?`;

  const commands = [
    `f(x) = ${quadrinomial.toString()}`,
    `SetColor(f, "${blueMain}")`,
    `SetCaption(f, "$\\mathcal C_f$")`,
    `ShowLabel(f, true)`,
  ];

  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
    isAxesRatioFixed: false,
  });

  const question: Question<Identifiers> = {
    answer: interval,
    instruction,
    commands: ggb.commands,
    coords: [xMin, xMax, yMin, yMax],
    options: ggb.getOptions(),
    keys: ["rbracket", "lbracket", "semicolon", "infty", "reals"],
    answerFormat: "tex",
    identifiers: { askConvex, quadcoeffs, inflexionPoint: inflexionPointX },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, quadcoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  const quadrinomial = new Polynomial(quadcoeffs);
  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const inflexionPoint = new FractionNode(
    new MultiplyNode(seconddcoeffs[0].toTree(), new NumberNode(-1)),
    seconddcoeffs[1].toTree(),
  ).simplify();

  const wrongInterval1 = new IntervalNode(
    inflexionPoint,
    PlusInfinityNode,
    ClosureType.OO,
  ).toTex();

  const wrongInterval2 = new IntervalNode(
    MinusInfinityNode,
    inflexionPoint,
    ClosureType.OO,
  ).toTex();

  const wrongInterval3 = new IntervalNode(
    MinusInfinityNode,
    PlusInfinityNode,
    ClosureType.OO,
  ).toTex();

  const wrongInterval4 = new IntervalNode(
    new NumberNode(randint(-1, 2)),
    PlusInfinityNode,
    ClosureType.FO,
  ).toTex();

  tryToAddWrongProp(propositions, wrongInterval1);
  tryToAddWrongProp(propositions, wrongInterval2);
  tryToAddWrongProp(propositions, wrongInterval3);
  tryToAddWrongProp(propositions, wrongInterval4);
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { askConvex, quadcoeffs, inflexionPoint },
) => {
  let interval;
  if (askConvex) {
    interval =
      quadcoeffs[3] > 0
        ? new IntervalNode(
            inflexionPoint.toTree(),
            PlusInfinityNode,
            ClosureType.OO,
          )
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPoint.toTree(),
            ClosureType.OO,
          );
  } else {
    interval =
      quadcoeffs[3] <= 0
        ? new IntervalNode(
            inflexionPoint.toTree(),
            PlusInfinityNode,
            ClosureType.OO,
          )
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPoint.toTree(),
            ClosureType.OO,
          );
  }

  const latexs = interval.toAllValidTexs({});

  return latexs.includes(ans);
};
export const convexityQuadrinomialsGeo: Exercise<Identifiers> = {
  id: "convexityQuadrinomialsGeo",
  label: "Déterminer graphiquement la convexité d'un polynôme de degré $3$",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityQuadrinomialsGeoQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCM",
  isAnswerValid,
  subject: "Mathématiques",
};
