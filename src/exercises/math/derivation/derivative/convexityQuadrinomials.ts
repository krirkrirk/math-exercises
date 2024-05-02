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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { Interval } from "#root/math/sets/intervals/intervals";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
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
};

const getConvexityQuadrinomialsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const quadrinomial = PolynomialConstructor.randomWithOrder(3);
  const quadcoeffs = quadrinomial.coefficients;
  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const inflexionPoint = new FractionNode(
    new MultiplyNode(seconddcoeffs[0].toTree(), new NumberNode(-1)),
    seconddcoeffs[1].toTree(),
  ).simplify();

  const askConvex = coinFlip();
  let interval;
  if (askConvex) {
    interval =
      quadcoeffs[3] > 0
        ? new IntervalNode(
            inflexionPoint,
            PlusInfinityNode,
            ClosureType.OO,
          ).toTex()
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPoint,
            ClosureType.OO,
          ).toTex();
  } else {
    interval =
      quadcoeffs[3] <= 0
        ? new IntervalNode(
            inflexionPoint,
            PlusInfinityNode,
            ClosureType.OO,
          ).toTex()
        : new IntervalNode(
            MinusInfinityNode,
            inflexionPoint,
            ClosureType.OO,
          ).toTex();
  }

  const questionType = askConvex ? "convexe" : "concave";

  const question: Question<Identifiers> = {
    answer: interval,
    instruction: `Soit la fonction $f(x) = ${quadrinomial.toTex()}$. Sur quelle intervalle est-elle ${questionType} ?`,
    keys: ["rbracket", "lbracket", "semicolon", "infty", "reals"],
    answerFormat: "tex",
    identifiers: { askConvex, quadcoeffs },
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

const isAnswerValid: VEA<Identifiers> = (ans, { askConvex, quadcoeffs }) => {
  const quadrinomial = new Polynomial(quadcoeffs);
  const secondderivative = quadrinomial.derivate().derivate();
  const seconddcoeffs = secondderivative.coefficients;

  const inflexionPoint = new FractionNode(
    new MultiplyNode(seconddcoeffs[0].toTree(), new NumberNode(-1)),
    seconddcoeffs[1].toTree(),
  ).simplify();

  let interval;
  if (askConvex) {
    interval =
      quadcoeffs[3] > 0
        ? new IntervalNode(inflexionPoint, PlusInfinityNode, ClosureType.OO)
        : new IntervalNode(MinusInfinityNode, inflexionPoint, ClosureType.OO);
  } else {
    interval =
      quadcoeffs[3] <= 0
        ? new IntervalNode(inflexionPoint, PlusInfinityNode, ClosureType.OO)
        : new IntervalNode(MinusInfinityNode, inflexionPoint, ClosureType.OO);
  }

  const latexs = interval.toAllValidTexs({ allowFractionToDecimal: true });

  return latexs.includes(ans);
};
export const convexityQuadrinomials: Exercise<Identifiers> = {
  id: "convexityQuadrinomials",
  label: "Convexité des fonctions polynomiales de degré 3",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Dérivation"],
  generator: (nb: number) =>
    getDistinctQuestions(getConvexityQuadrinomialsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "QCM",
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
