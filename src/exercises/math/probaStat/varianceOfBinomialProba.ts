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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  nX: number;
  p: number;
};

const getVarianceOfBinomialProbaQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const p = new NumberNode(randfloat(0.1, 1, 2));

  const correctAns = new NumberNode(+(nX * p.value * (1 - p.value)).toFixed(2));

  const question: Question<Identifiers> = {
    answer: correctAns.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètre $n=${nX}$ et $p=${p.toTex()}$. Calculez la variance de $X$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nX, p: p.value },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, nX, p }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(nX, p).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const correctAns = +(n * p * (1 - p)).toFixed(2);
  let random;
  while (propositions.length < n) {
    random = new NumberNode(
      randfloat(correctAns - Math.min(1, correctAns), correctAns + 1, 2),
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (n: number, p: number): string[] => {
  const firstProposition = new NumberNode(+(n * p).toFixed(2));
  const secondProposition = new NumberNode(+(n * p * p).toFixed(2));
  return [firstProposition.toTex(), secondProposition.toTex()];
};
export const varianceOfBinomialProba: Exercise<Identifiers> = {
  id: "varianceOfBinomialProba",
  label:
    "Calcul de la variance d'une variable aléatoire $X$ qui suit une loi binomiale",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getVarianceOfBinomialProbaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
