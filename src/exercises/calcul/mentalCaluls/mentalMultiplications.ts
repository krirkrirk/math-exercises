import {
  MathExercise,
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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  numbers: number[];
};

const getMentalMultiplications: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 10, [-1, 0, 1]);
  const b = coinFlip()
    ? randint(-99, 100, [-10, 0, 10]) / 10
    : coinFlip()
    ? randint(2, 10) * 10 + randint(-1, 2, [0])
    : randint(2, 10) + randint(-1, 2, [0]) / 10;

  const c = randint(2, 9, [3, 6, 7]);
  const d = randint(2, 11, [c]) / c;
  const f = coinFlip() ? randint(2, 10) / 10 : randint(2, 100) / 100;

  let numbers: number[] = [a, b, c, d, f];
  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));

  let statementTree;
  let answer: number;

  if (coinFlip()) {
    statementTree = new MultiplyNode(allNumbersNodes[0], allNumbersNodes[1]);
    answer = numbers[0] * numbers[1];
  } else {
    statementTree = new MultiplyNode(
      allNumbersNodes[2],
      new MultiplyNode(allNumbersNodes[3], allNumbersNodes[4]),
    );
    answer = numbers[2] * numbers[3] * numbers[4];
  }

  statementTree.shuffle();
  const statementTex = statementTree.toTex();
  const answerTex = (round(answer, 2) + "").replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `Calculer : $${statementTex}$`,
    startStatement: statementTex,
    answer: answerTex,
    keys: [],
    answerFormat: "tex",
    identifiers: { numbers },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const result = Number(answer.replace(",", "."));
  while (propositions.length < n) {
    let incorrectAnswer = round(
      result + (coinFlip() ? 1 : -1) * Math.random() * 10,
      2,
    );
    tryToAddWrongProp(
      propositions,
      incorrectAnswer.toString().replace(".", ","),
    );
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = new NumberNode(Number(answer.replace(",", ".")));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const mentalMultiplications: MathExercise<Identifiers> = {
  id: "mentalMultiplications",
  connector: "=",
  label: "Effectuer mentalement des multiplications simples",
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
  generator: (nb: number) => getDistinctQuestions(getMentalMultiplications, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
