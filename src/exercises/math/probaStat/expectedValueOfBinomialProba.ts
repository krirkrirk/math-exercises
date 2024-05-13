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
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  nX: number;
  b: number;
};

const getExpectedValueOfBinomialProbaQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const b = randint(2, 11);
  const p = new Rational(1, b);
  const node = getCorrectAnswer(nX, p);

  const question: Question<Identifiers> = {
    answer: node.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètre $n=${nX}$ et $p=${p.toTex()}$. Calculez l'espérance de $X$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nX, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, nX, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(nX, b).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  while (propositions.length < n) {
    random = RationalConstructor.randomIrreductible().toTree();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { nX, b }) => {
  const p = new Rational(1, b);
  const correctAns = getCorrectAnswer(nX, p);
  return correctAns
    .toAllValidTexs({ allowFractionToDecimal: true })
    .includes(ans);
};

const generatePropositions = (n: number, b: number): string[] => {
  const p = new Rational(1, b).toTree();
  const oneMinusP = new SubstractNode(new NumberNode(1), p).simplify();
  const nNode = new NumberNode(n);
  const firstProposition = p;
  const secondProposition = new MultiplyNode(
    nNode,
    new MultiplyNode(p, oneMinusP).simplify(),
  ).simplify();
  const thirdProposition = new MultiplyNode(nNode, oneMinusP).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};

const getCorrectAnswer = (n: NumberNode | number, p: Rational) => {
  const nNode = typeof n === "number" ? new NumberNode(n) : n;
  return new MultiplyNode(nNode, p.toTree()).simplify();
};
export const expectedValueOfBinomialProba: Exercise<Identifiers> = {
  id: "expectedValueOfBinomialProba",
  label:
    "Calcul de l'espérance d'une varialbe aléatoire $X$ qui suit une loi binomiale",
  levels: ["TermTech"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getExpectedValueOfBinomialProbaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
