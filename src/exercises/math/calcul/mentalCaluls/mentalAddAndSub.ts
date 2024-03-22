import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  numbers: number[];
};

const getMentalAddAndSub: QuestionGenerator<Identifiers> = () => {
  let numbers: number[] = [];
  const nbrOperations = coinFlip() ? 2 : 3;

  numbers[0] = coinFlip() ? randint(1, 10) : randint(10, 100) / 10;
  numbers[1] = coinFlip()
    ? randint(-100, 100) / 10
    : randint(-1000, 1000) / 100;

  let sum = numbers[0] + numbers[1];

  if (nbrOperations === 3) {
    numbers[2] = coinFlip()
      ? randint(-100, 100) / 10
      : randint(-1000, 1000) / 100;
    sum += numbers[2];
    sum = round(sum * 10, 0);
    numbers[2] = round(sum / 10 - numbers[0] - numbers[1], 2);
    sum = numbers[0] + numbers[1] + numbers[2];
  }

  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
  let statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
  for (let i = 2; i < nbrOperations; i++)
    statementTree = new AddNode(statementTree, allNumbersNodes[i]);
  statementTree.shuffle();
  const statement = statementTree.toTex();
  const answer = (round(sum, 2) + "").replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Calculer : $${statement}$`,
    startStatement: statement,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { numbers },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, numbers }) => {
  const propositions: Proposition[] = [];
  const sum = numbers.reduce((acc, curr) => acc + curr);

  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const incorrectSum = round(
      sum + (coinFlip() ? 1 : -1) * Math.random() * 10,
      2,
    );
    tryToAddWrongProp(propositions, incorrectSum.toString().replace(".", ","));
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { numbers }) => {
  const sum = numbers.reduce((acc, curr) => acc + curr);

  const answerTree = new NumberNode(round(sum, 2));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const mentalAddAndSub: Exercise<Identifiers> = {
  id: "mentalAddAndSub",
  connector: "=",
  label: "Effectuer mentalement des additions et des soustractions simples",
  levels: [
    "6ème",
    "5ème",
    "4ème",
    "3ème",
    "2nde",
    "1reESM",
    "CAP",
    "2ndPro",
    "1rePro",
  ],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalAddAndSub, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
