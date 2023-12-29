import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
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

const getAddAndSubQuestions: QuestionGenerator<Identifiers> = () => {
  const nbOperations = randint(2, 4);
  const numbers = [];
  for (let i = 0; i < nbOperations + 1; i++) {
    numbers.push(randint(-15, 15, [0]));
  }
  const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
  let statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
  for (let i = 2; i < allNumbersNodes.length; i++) {
    statementTree = new AddNode(statementTree, allNumbersNodes[i]);
  }
  const answer = numbers.reduce((a, b) => a + b) + "";
  const statement = statementTree.toTex();
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
type Identifiers = { numbers: number[] };

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const randomOffset = randint(-9, 10, [0]);
    const wrongAnswer = Number(answer) + randomOffset;
    tryToAddWrongProp(propositions, wrongAnswer.toString());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = new NumberNode(Number(answer));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};
export const addAndSubExercise: MathExercise<Identifiers> = {
  id: "addAndSub",
  connector: "=",
  label: "Additions et soustractions",
  levels: ["6ème", "5ème"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAddAndSubQuestions, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
