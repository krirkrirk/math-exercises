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
import { combinations } from "#root/math/utils/combinatorics/combinaison";
import { randint } from "#root/math/utils/random/randint";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  nX: number;
  b: number;
  k: number;
};
const nbOneNode = new NumberNode(1);

const getCalculateProbaOfBinomialDistributionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const k = randint(1, 9);
  const b = randint(2, 11);
  const p = new Rational(1, b);

  const correctAns = getCorrectAnswer(nX, p, k);

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètre $n=${nX}$ et $p=${p.toTex()}$. Calculez $P(X=${k})$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nX, b, k },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nX, b, k },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const p = new Rational(1, b);
  generatePropositions(nX, p, k).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  while (propositions.length < n) {
    random = RationalConstructor.randomIrreductible();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { nX, b, k }) => {
  const p = new Rational(1, b);

  const correctAns = getCorrectAnswer(nX, p, k);

  return correctAns.toAllValidTexs().includes(ans);
};

const generatePropositions = (n: number, p: Rational, k: number): string[] => {
  const kChooseN = combinations(k, n);
  const pNode = p.toTree();
  const oneMinusP = new SubstractNode(nbOneNode, pNode).simplify();
  const firstProposition = new MultiplyNode(
    new PowerNode(pNode, new NumberNode(k)).simplify(),
    new PowerNode(oneMinusP, new NumberNode(n - k)).simplify(),
  ).simplify();

  const secondProposition = new MultiplyNode(
    new PowerNode(pNode, new NumberNode(n)).simplify(),
    new PowerNode(oneMinusP, new NumberNode(k)).simplify(),
  ).simplify();

  const thirdProposition = new MultiplyNode(
    new NumberNode(kChooseN),
    new PowerNode(pNode, new NumberNode(k)).simplify(),
  ).simplify();
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};

const getCorrectAnswer = (n: number, p: Rational, k: number) => {
  const kChooseN = combinations(k, n);
  const pNode = p.toTree();
  const oneMinusP = new SubstractNode(nbOneNode, pNode).simplify();
  return new MultiplyNode(
    new NumberNode(kChooseN),
    new MultiplyNode(
      new PowerNode(pNode, new NumberNode(k)).simplify(),
      new PowerNode(oneMinusP, new NumberNode(n - k)).simplify(),
    ).simplify(),
  ).simplify();
};
export const calculateProbaOfBinomialDistribution: Exercise<Identifiers> = {
  id: "calculateProbaOfBinomialDistribution",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateProbaOfBinomialDistributionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
