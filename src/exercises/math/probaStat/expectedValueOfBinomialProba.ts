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
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/alignTex";

type Identifiers = {
  nX: number;
  a: number;
  b: number;
};

const getExpectedValueOfBinomialProbaQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const b = randint(2, 11);
  const a = randint(1, b);
  const p = new Rational(a, b);
  const node = getCorrectAnswer(nX, p);
  const answer = node.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètres $n=${nX}$ et $p=${p
      .toTree()
      .simplify()
      .toTex()}$. Calculez l'espérance de $X$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nX, a, b },
    hint: `L'espérance d'une variable aléatoire $X$ qui suit une loi binomiale de paramètres $n$ et $p$ est donnée par $E(X) = np$.`,
    correction: `L'espérance d'une variable aléatoire $X$ qui suit une loi binomiale de paramètres $n$ et $p$ est donnée par $E(X) = np$.
    
Ici, on a donc :

${alignTex([
  ["E(X)", "=", new MultiplyNode(nX.toTree(), p.toTree()).toTex()],
  ["", "=", answer],
])}`,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nX, a, b },
) => {
  const propositions: Proposition[] = [];
  const p = new Rational(a, b);
  addValidProp(propositions, answer);
  generatePropositions(nX, p).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  while (propositions.length < n) {
    random = RationalConstructor.randomIrreductible(10).toTree();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { nX, a, b }) => {
  const p = new Rational(a, b);
  const correctAns = getCorrectAnswer(nX, p);
  return correctAns
    .toAllValidTexs({ allowFractionToDecimal: true })
    .includes(ans);
};

const generatePropositions = (n: number, p: Rational): string[] => {
  const pTree = p.toTree().simplify();
  const oneMinusP = new SubstractNode(new NumberNode(1), pTree).simplify();
  const nNode = new NumberNode(n);
  const firstProposition = pTree;
  const secondProposition = new MultiplyNode(
    nNode,
    new MultiplyNode(pTree, oneMinusP).simplify(),
  ).simplify();
  const thirdProposition = new MultiplyNode(nNode, oneMinusP).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};

const getCorrectAnswer = (n: number, p: Rational) => {
  const nNode = new NumberNode(n);
  return new MultiplyNode(nNode, p.toTree().simplify()).simplify();
};
export const expectedValueOfBinomialProba: Exercise<Identifiers> = {
  id: "expectedValueOfBinomialProba",
  label: "Calcul de l'espérance d'une loi binomiale",
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
  hasHintAndCorrection: true,
};
