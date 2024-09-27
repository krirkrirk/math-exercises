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
  InegalitySymbols,
  InequationSymbol,
  InequationSymbolConstructor,
} from "#root/math/inequations/inequation";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import { Node } from "#root/tree/nodes/node";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  ineqType: InegalitySymbols;
};

type Props = {
  a: number;
  roots: Node[];
  ineqType: InequationSymbol;
};

const getAnswer = ({ a, roots, ineqType }: Props) => {
  const aPositive = a > 0;
  const insideInterval = new IntervalNode(
    roots[0],
    roots[1],
    ineqType.isStrict ? ClosureType.OO : ClosureType.FF,
  );
  const outsideUnion = new UnionIntervalNode([
    new IntervalNode(
      MinusInfinityNode,
      roots[0],
      ineqType.isStrict ? ClosureType.OO : ClosureType.OF,
    ),
    new IntervalNode(
      roots[1],
      PlusInfinityNode,
      ineqType.isStrict ? ClosureType.OO : ClosureType.FO,
    ),
  ]);

  const tree = ineqType.isSup
    ? aPositive
      ? outsideUnion
      : insideInterval
    : aPositive
    ? insideInterval
    : outsideUnion;
  return new InequationSolutionNode(tree);
};

const getSecondDegreeInequationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-5, 6, [0]);
  const x1 = randint(-5, 6);
  const x2 = randint(-5, 6, [x1]);
  const roots =
    x1 < x2
      ? [new NumberNode(x1), new NumberNode(x2)]
      : [new NumberNode(x2), new NumberNode(x1)];
  const c = a * x1 * x2;
  const b = -a * x2 - a * x1;
  const trinom = new Trinom(a, b, c);
  const ineqType = InequationSymbolConstructor.random();

  const answer = getAnswer({ a: trinom.a, roots, ineqType }).toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f(x) = ${trinom
      .toTree()
      .toTex()}$. Résoudre l'inéquation $f(x) ${ineqType.symbol} 0$.`,
    keys: [
      "S",
      "equal",
      "lbracket",
      "semicolon",
      "rbracket",
      "cup",
      "infty",
      "varnothing",
    ],
    answerFormat: "tex",
    identifiers: {
      a: trinom.a,
      b: trinom.b,
      c: trinom.c,
      ineqType: ineqType.symbol,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, ineqType },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const roots = new Trinom(a, b, c).getRootsNode();

  const ineq = new InequationSymbol(ineqType);
  tryToAddWrongProp(
    propositions,
    getAnswer({ a: -a, ineqType: ineq, roots }).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    getAnswer({ a, ineqType: ineq.toStrictnessToggled(), roots }).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    getAnswer({ a: -a, ineqType: ineq.toStrictnessToggled(), roots }).toTex(),
  );
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, a, b, c, ineqType },
) => {
  const trinom = new Trinom(a, b, c);
  const roots = trinom.getRootsNode();
  const ineq = new InequationSymbol(ineqType);
  const tree = getAnswer({ a, ineqType: ineq, roots });
  const texs = tree.toAllValidTexs();

  return texs.includes(ans);
};
export const secondDegreeInequation: Exercise<Identifiers> = {
  id: "secondDegreeInequation",
  connector: "\\iff",
  label: "Résoudre une inéquation du second degré",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Inéquations", "Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getSecondDegreeInequationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
