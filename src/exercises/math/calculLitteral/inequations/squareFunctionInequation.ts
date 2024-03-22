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
import { randint } from "#root/math/utils/random/randint";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { InequationSolutionNode } from "#root/tree/nodes/inequations/inequationSolutionNode";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  k: number;
  inequationSymbol: InegalitySymbols;
};

const getAnswer = (k: number, ineqSymbol: InegalitySymbols) => {
  const sqrt = Math.sqrt(k);
  const sqrtTree =
    Math.floor(sqrt) === sqrt ? sqrt.toTree() : new SqrtNode(k.toTree());

  const inequationSymbol = new InequationSymbol(ineqSymbol);
  const isStrict = inequationSymbol.isStrict;
  const insideInterval = new IntervalNode(
    new OppositeNode(sqrtTree),
    sqrtTree,
    isStrict ? ClosureType.OO : ClosureType.FF,
  );
  const set = inequationSymbol.isSup
    ? insideInterval.toReversedClosure().toComplement()
    : insideInterval;

  const solution = new InequationSolutionNode(set);
  return solution;
};

const getSquareFunctionInequationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const k = coinFlip() ? randint(1, 11) ** 2 : randint(1, 100);
  const inequationSymbol = InequationSymbolConstructor.random();
  const solution = getAnswer(k, inequationSymbol.symbol);
  const question: Question<Identifiers> = {
    answer: solution.toTex(),
    instruction: `Résoudre l'inéquation suivante : $x^2 ${inequationSymbol.symbol} ${k}$`,
    keys: ["S", "equal", "lbracket", "rbracket", "semicolon", "infty", "cup"],
    answerFormat: "tex",
    identifiers: { k, inequationSymbol: inequationSymbol.symbol },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, k, inequationSymbol },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, getAnswer(k ** 2, inequationSymbol).toTex());
  tryToAddWrongProp(
    propositions,
    getAnswer(k, new InequationSymbol(inequationSymbol).reversed()).toTex(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      getAnswer(randint(1, 100), inequationSymbol).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, k, inequationSymbol },
) => {
  const solution = getAnswer(k, inequationSymbol);
  const texs = solution.toAllValidTexs();
  return texs.includes(ans);
};
export const squareFunctionInequation: Exercise<Identifiers> = {
  id: "squareFunctionInequation",
  label: "Résoudre une inéquation du type $x^2 < k$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions de référence", "Inéquations"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareFunctionInequationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
