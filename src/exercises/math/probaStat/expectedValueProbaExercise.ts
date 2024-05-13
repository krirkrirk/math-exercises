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

const getExpectedValueProbaExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const nX = randint(1, 9);
  const p = new NumberNode(randfloat(0.1, 0.9, 2));
  const node = new NumberNode(+(nX * p.value).toFixed(2));

  const question: Question<Identifiers> = {
    answer: node.toTex(),
    instruction: `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètre $n=${nX}$ et $p=${p.toTex()}$. Calculez l'espérance de $X$`,
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
  const correctAns = (nX * p).toFixed(2);
  let random: number;
  let node;
  while (propositions.length < n) {
    random = randfloat(
      +correctAns - Math.min(1, +correctAns),
      +correctAns + 1,
      2,
    );
    node = new NumberNode(random);
    tryToAddWrongProp(propositions, node.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (n: number, p: number): string[] => {
  const firstProposition = new NumberNode(p);
  const secondProposition = new NumberNode(+(n * p * (1 - p)).toFixed(2));
  const thirdProposition = new NumberNode(+(n * (1 - p)).toFixed(2));
  return [
    firstProposition.toTex(),
    secondProposition.toTex(),
    thirdProposition.toTex(),
  ];
};
export const expectedValueProbaExercise: Exercise<Identifiers> = {
  id: "expectedValueProbaExercise",
  label:
    "Calcul de l'espérance d'une varialbe aleatoire $X$ qui suit une loi binomiale",
  levels: ["TermTech"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getExpectedValueProbaExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
