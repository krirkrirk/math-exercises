/**
 * a*b ±c±d
 * a/b ±c±d
 * a*b*c ± d
 * a*b±c*d
 * a/b ± c*d
 */

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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  type: number;
  a: number;
  b: number;
  c: number;
  d: number;
};

const getPriorityQuestions: QuestionGenerator<Identifiers> = () => {
  const type = randint(1, 6);
  let startStatement = "";
  let answer: string = "";
  let a: number, b: number, c: number, d: number;
  let statement: AddNode;
  switch (type) {
    case 1: // a*b ±c±d
      [c, d] = [1, 2, 3, 4].map((el) => randint(-10, 11, [0]));
      [a, b] = [1, 2].map((el) => randint(-10, 11));
      statement = coinFlip()
        ? //a*b first ou last
          new AddNode(
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d)),
          )
        : //a*b middle
          new AddNode(
            new AddNode(
              new NumberNode(c),
              new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            ),
            new NumberNode(d),
          );
      statement.shuffle();
      startStatement = statement.toTex();
      answer = (a * b + c + d).toString();
      break;
    case 2: // a/b ±c±d
      [b, c, d] = [1, 2, 3].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      statement = coinFlip()
        ? //a/b first ou last
          new AddNode(
            new DivideNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d)),
          )
        : //a/b middle
          new AddNode(
            new AddNode(
              new NumberNode(c),
              new DivideNode(new NumberNode(a), new NumberNode(b)),
            ),
            new NumberNode(d),
          );
      statement.shuffle();
      startStatement = statement.toTex();
      answer = (a / b + c + d).toString();
      break;
    case 3: // a*b ± c*d
      [a, b, c, d] = [1, 2, 3, 4].map((el) => randint(-10, 11));
      statement = new AddNode(
        new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        new MultiplyNode(new NumberNode(c), new NumberNode(d)),
      );
      startStatement = statement.toTex();
      answer = (a * b + c * d).toString();
      break;
    case 4: // a*b ± c/d
      [a, b] = [1, 2].map((el) => randint(-10, 11));
      d = randint(-10, 11, [0]);
      c = d * randint(0, 11);
      statement = new AddNode(
        new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        new DivideNode(new NumberNode(c), new NumberNode(d)),
      );
      statement.shuffle();
      startStatement = statement.toTex();
      answer = (a * b + c / d).toString();
      break;
    case 5: // a/b ± c/d
      [b, d] = [1, 2].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      c = d * randint(0, 11);
      statement = new AddNode(
        new DivideNode(new NumberNode(a), new NumberNode(b)),
        new DivideNode(new NumberNode(c), new NumberNode(d)),
      );
      startStatement = statement.toTex();
      answer = (a / b + c / d).toString();
      break;
    case 5: // a*b*c ± d
      [b, d] = [1, 2].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      c = d * randint(0, 11);
      statement = new AddNode(
        new MultiplyNode(
          new MultiplyNode(new NumberNode(a), new NumberNode(b)),
          new NumberNode(c),
        ),
        new NumberNode(d),
      );
      statement.shuffle();
      startStatement = statement.toTex();
      answer = (a * b * c + d).toString();
      break;
    default:
      throw Error("impossible");
  }

  const question: Question<Identifiers> = {
    instruction: `Calculer : $${startStatement}$`,
    startStatement,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, a, b, c, d },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n: number, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-100, 100) + "");
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = new NumberNode(Number(answer));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const operationsPriorities: Exercise<Identifiers> = {
  id: "operationsPriorities",
  connector: "=",
  label: "Priorités opératoires",
  levels: ["5ème", "4ème"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPriorityQuestions, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
