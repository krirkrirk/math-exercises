import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { shuffle } from "#root/utils/shuffle";

import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

/**
 * a±b±c±d
 */

const getAddAndSubWithoutRelatives: QuestionGenerator<Identifiers> = () => {
  let answer = -1;
  let statementTree: AddNode;
  let numbers: number[] = [];
  while (answer < 0) {
    const nbOperations = randint(2, 4);
    numbers = [];
    do {
      numbers = [];
      numbers.push(randint(1, 15));
      let sum = numbers[0];

      for (let i = 1; i < nbOperations + 1; i++) {
        numbers.push(randint(-sum, 15, [0]));
        sum += numbers[i];
      }
    } while (numbers.every((a) => a > 0));

    const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
    statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
    for (let i = 2; i < allNumbersNodes.length; i++) {
      statementTree = new AddNode(statementTree, allNumbersNodes[i]);
    }
    answer = numbers.reduce((a, b) => a + b);
  }
  const answerTex = answer.toString();
  const question: Question<Identifiers> = {
    instruction: `Calculer : $${statementTree!.toTex()}$`,
    startStatement: statementTree!.toTex(),
    answer: answerTex,
    keys: [],
    answerFormat: "tex",
    identifiers: { numbers },
  };
  return question;
};

type Identifiers = { numbers: number[] };

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const incorrectAnswer = Number(answer) + randint(-5, 6, [0]);
    tryToAddWrongProp(propositions, incorrectAnswer.toString());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = new NumberNode(Number(answer));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const addAndSubWithoutRelatives: Exercise<Identifiers> = {
  id: "addAndSubWithoutRelatives",
  connector: "=",
  label: "Additions et soustractions sans les nombres relatifs",
  levels: ["6ème", "5ème"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getAddAndSubWithoutRelatives, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
