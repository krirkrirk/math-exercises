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
import { Matrix } from "#root/math/matrices/matrix";
import { Integer } from "#root/math/numbers/integer/integer";
import { NombreConstructor, NumberType } from "#root/math/numbers/nombre";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { EmptySet } from "#root/tree/nodes/sets/discreteSetNode";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import {
  UnionIntervalNode,
  UnionIntervalNodeBuilder,
} from "#root/tree/nodes/sets/unionIntervalNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { intervalKeys } from "../../utils/keys/intervalKeys";

type Identifiers = {
  a: string;
  b: string;
  c: string;
  d: string;
};

const getMatrixInversibilityDomainQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const elements: AlgebraicNode[][] = [[], []];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      elements[i][j] = NombreConstructor.random({
        types: [NumberType.Integer, NumberType.Rational],
        excludes: i === 0 && j === 0 ? [new Integer(0)] : undefined,
      }).toTree();
    }
  }
  const matrix = new Matrix([
    [new MultiplyNode(elements[0][0], new VariableNode("x")), elements[0][1]],
    elements[1],
  ]);
  // si d=0 & (b|c)=0 alors det = 0 sur R donc non inversible sur R
  // sinon si d=0, inversible sur R
  // sinon x = bc /ad et inversible sur R\x
  const isDZero = elements[1][1].evaluate({}) === 0;
  const isBorCZero =
    elements[0][1].evaluate({}) === 0 || elements[1][0].evaluate({}) === 0;

  const x = isDZero
    ? undefined
    : new FractionNode(
        new MultiplyNode(elements[0][1], elements[1][0]),
        new MultiplyNode(elements[0][0], elements[1][1]),
      ).simplify();

  const answer =
    isDZero && isBorCZero
      ? EmptySet.toTex()
      : isDZero
      ? "\\mathbb{R}"
      : new UnionIntervalNode([
          new IntervalNode(MinusInfinityNode, x!, ClosureType.OO),
          new IntervalNode(x!, PlusInfinityNode, ClosureType.OO),
        ]).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $M = ${matrix.toTex()}$, où $x\\in \\mathbb{R}$. Sur quel ensemble la matrice $M$ est-elle inversible ?
    `,
    keys: [...intervalKeys, "reals", "varnothing"],
    answerFormat: "tex",
    identifiers: {
      a: elements[0][0].toTex(),
      b: elements[0][1].toTex(),
      c: elements[1][0].toTex(),
      d: elements[1][1].toTex(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const aTree = parseAlgebraic(a);
  const bTree = parseAlgebraic(b);
  const cTree = parseAlgebraic(c);
  const dTree = parseAlgebraic(d);
  const det = new SubstractNode(
    new MultiplyNode(aTree, dTree),
    new MultiplyNode(bTree, cTree),
  ).simplify();

  tryToAddWrongProp(
    propositions,
    UnionIntervalNodeBuilder.realMinus(det).toTex(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      UnionIntervalNodeBuilder.realMinus(randint(-10, 10).toTree()).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const matrixInversibilityDomain: Exercise<Identifiers> = {
  id: "matrixInversibilityDomain",
  label: "Déterminer le domaine d'inversibilité d'une matrice",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Matrices"],
  generator: (nb: number) =>
    getDistinctQuestions(getMatrixInversibilityDomainQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  pdfOptions: { shouldSpreadPropositions: true },
};
