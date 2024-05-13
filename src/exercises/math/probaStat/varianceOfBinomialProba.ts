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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  nX: number;
  b: number;
};

const nbOneNode = new NumberNode(1);

const getVarianceOfBinomialProbaQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const nNode = new NumberNode(nX);
  const b = randint(2, 11);
  const p = new Rational(1, b).toTree();
  const oneMinusP = new SubstractNode(nbOneNode, p).simplify();
  const correctAns = new MultiplyNode(
    nNode,
    new MultiplyNode(nNode, oneMinusP).simplify(),
  ).simplify();

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètre $n=${nX}$ et $p=${p.toTex()}$. Calculez la variance de $X$`,
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
    random = RationalConstructor.randomIrreductible(1).toTree();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, nX, b }) => {
  const p = new Rational(1, b).toTree();
  const nNode = new NumberNode(nX);
  const oneMinusP = new SubstractNode(nbOneNode, p).simplify();
  const correctAns = new MultiplyNode(
    nNode,
    new MultiplyNode(nNode, oneMinusP).simplify(),
  ).simplify();
  return correctAns
    .toAllValidTexs({ allowFractionToDecimal: true })
    .includes(ans);
};

const generatePropositions = (n: number, b: number): string[] => {
  const p = new Rational(1, b).toTree();
  const nNode = new NumberNode(n);
  const firstProposition = new MultiplyNode(nNode, p).simplify();
  const secondProposition = new MultiplyNode(
    nNode,
    new PowerNode(p, new NumberNode(2)).simplify(),
  ).simplify();
  return [firstProposition.toTex(), secondProposition.toTex()];
};
export const varianceOfBinomialProba: Exercise<Identifiers> = {
  id: "varianceOfBinomialProba",
  label:
    "Calcul de la variance d'une variable aléatoire $X$ qui suit une loi binomiale",
  levels: ["TermTech"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getVarianceOfBinomialProbaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
