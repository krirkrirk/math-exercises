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
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  nX: number;
  a: number;
  b: number;
};

const nbOneNode = new NumberNode(1);

const getVarianceOfBinomialProbaQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const b = randint(2, 11);
  const a = randint(1, b);
  const p = new Rational(a, b);

  const correctAns = getCorrectAnswer(nX, p);

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètres $n=${nX}$ et $p=${p
      .toTree()
      .simplify()
      .toTex()}$. Calculez la variance de $X$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nX, a, b },
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
  const nNode = new NumberNode(n);
  const firstProposition = new MultiplyNode(nNode, pTree).simplify();
  const secondProposition = new MultiplyNode(
    nNode,
    new PowerNode(pTree, new NumberNode(2)).simplify(),
  ).simplify();
  return [firstProposition.toTex(), secondProposition.toTex()];
};

const getCorrectAnswer = (n: number, p: Rational) => {
  const pTree = p.toTree().simplify();
  const oneMinusP = new SubstractNode(nbOneNode, pTree);
  return new MultiplyNode(
    new NumberNode(n),
    new MultiplyNode(pTree, oneMinusP).simplify(),
  ).simplify();
};
export const varianceOfBinomialProba: Exercise<Identifiers> = {
  id: "varianceOfBinomialProba",
  label: "Calcul de la variance d'une loi binomiale",
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
