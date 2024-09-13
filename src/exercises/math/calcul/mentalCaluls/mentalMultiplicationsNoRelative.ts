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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  numbers: number[];
};

const getMentalMultiplicationsNoRelative: QuestionGenerator<
  Identifiers
> = () => {
  const numbers: number[] = [];
  const nbOfOperations = randint(2, 4);

  let statementTree;
  let answer: number;

  if (nbOfOperations === 2) {
    const a = randint(2, 10);
    const b = coinFlip()
      ? randint(1, 100, [10]) / 10
      : coinFlip()
      ? randint(2, 10) * 10 + randint(-1, 2, [0]) / 10
      : randint(2, 10) + randint(-1, 2, [0]) / 10;
    numbers.push(a);
    numbers.push(b);
    const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));

    statementTree = new MultiplyNode(allNumbersNodes[0], allNumbersNodes[1]);
    answer = numbers[0] * numbers[1];
  } else {
    //nbOfOperations = 3
    const c = randint(2, 9, [3, 6, 7]);
    const d = randint(2, 11, [c]) / c;
    const f = coinFlip() ? randint(2, 10) / 10 : randint(2, 100) / 100;
    numbers.push(c);
    numbers.push(d);
    numbers.push(f);
    const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));

    statementTree = new MultiplyNode(
      allNumbersNodes[0],
      new MultiplyNode(allNumbersNodes[1], allNumbersNodes[2]),
    );
    answer = numbers[0] * numbers[1] * numbers[2];
  }

  statementTree.shuffle();
  const statementTex = statementTree.toTex();
  const answerTex = round(answer, 2).frenchify();
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
  const result = answer.unfrenchify();
  while (propositions.length < n) {
    let incorrectAnswer = round(result + Math.random() * 10, 2);
    tryToAddWrongProp(
      propositions,
      incorrectAnswer.toString().replace(".", ","),
    );
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = answer.unfrenchify().toTree();
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const mentalMultiplicationsNoRelative: Exercise<Identifiers> = {
  id: "mentalMultiplicationsNoRelative",
  connector: "=",
  label: "Multiplications avec des décimaux (sans relatifs)",
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
  generator: (nb: number) =>
    getDistinctQuestions(getMentalMultiplicationsNoRelative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
