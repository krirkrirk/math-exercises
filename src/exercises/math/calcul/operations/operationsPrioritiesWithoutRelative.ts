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
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  type: number;
  flip: number;
  a: number;
  b: number;
  c: number;
  d: number;
};

const getOperationsPrioritiesWithoutRelative: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 9);
  const flip = randint(1, 4);
  let startStatement = "";
  let answer: string = "";
  let a = 1,
    b = 1,
    c = 1,
    d = 1;
  let statement: AlgebraicNode;
  switch (type) {
    case 1: // a*b ± c±d
      switch (flip) {
        case 1:
          //a*b first

          [a, b] = [1, 2].map((el) => randint(0, 11));
          c = randint(-(a * b), 11, [0]);
          d = randint(-(a * b + c), 11, [0]);

          statement = new AddNode(
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d)),
          );

          startStatement = statement.toTex();
          answer = (a * b + c + d).toString();

          break;

        case 2:
          //a*b last
          c = randint(0, 11, [0]);
          d = randint(-c, 11, [0]);
          do {
            a = randint(-10, 11);
            b = randint(0, 11);
          } while (c + d + a * b < 0);

          statement = new AddNode(
            new AddNode(new NumberNode(c), new NumberNode(d)),
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
          );

          startStatement = statement.toTex();
          answer = (a * b + c + d).toString();

          break;
        case 3:
          //a*b middle

          c = randint(0, 11, [0]);
          do {
            a = randint(-10, 11);
            b = randint(0, 11);
          } while (c + a * b < 0);
          d = randint(-(c + a * b), 11, [0]);

          statement = new AddNode(
            new AddNode(
              new NumberNode(c),
              new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            ),
            new NumberNode(d),
          );

          startStatement = statement.toTex();
          answer = (a * b + c + d).toString();

          break;
      }
      break;

    case 2: // a/b ±c±d
      switch (flip) {
        case 1:
          //a/b first

          b = randint(0, 11, [0]);
          a = b * randint(0, 11);
          c = randint(-(a / b), 11, [0]);
          d = randint(-(a / b + c), 11, [0]);

          statement = new AddNode(
            new DivideNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d)),
          );

          startStatement = statement.toTex();
          answer = (a / b + c + d).toString();

          break;

        case 2:
          //a/b last
          c = randint(0, 11, [0]);
          d = randint(-c, 11, [0]);
          do {
            b = randint(1, 11);
            a = b * randint(-10, 11);
          } while (c + d + a / b < 0);

          statement = new AddNode(
            new AddNode(new NumberNode(c), new NumberNode(d)),
            new DivideNode(new NumberNode(a), new NumberNode(b)),
          );

          startStatement = statement.toTex();
          answer = (a / b + c + d).toString();

          break;
        case 3:
          //a/b middle

          c = randint(0, 11, [0]);
          do {
            b = randint(1, 11);
            a = b * randint(-10, 11);
          } while (c + a / b < 0);
          d = randint(-(c + a / b), 11, [0]);

          statement = new AddNode(
            new AddNode(
              new NumberNode(c),
              new DivideNode(new NumberNode(a), new NumberNode(b)),
            ),
            new NumberNode(d),
          );

          startStatement = statement.toTex();
          answer = (a / b + c + d).toString();

          break;
      }
      break;

    case 3: // a*b ± c*d
      [a, b] = [1, 2].map((el) => randint(1, 11));

      do {
        c = randint(-10, 11);
        d = randint(1, 11);
      } while (a * b + c * d < 0);

      statement = new AddNode(
        new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        new MultiplyNode(new NumberNode(c), new NumberNode(d)),
      );

      startStatement = statement.toTex();
      answer = (a * b + c * d).toString();
      break;

    case 4: // a*b ± c/d
      if (coinFlip()) {
        [a, b] = [1, 2].map((el) => randint(1, 11));
        d = randint(0, 11, [0]);
        c = d * randint(-(a * b), 11);

        statement = new AddNode(
          new MultiplyNode(new NumberNode(a), new NumberNode(b)),
          new DivideNode(new NumberNode(c), new NumberNode(d)),
        );
        startStatement = statement.toTex();
        answer = (a * b + c / d).toString();
      } else {
        d = randint(0, 11, [0]);
        c = d * randint(0, 11);
        do {
          a = randint(-10, 11);
          b = randint(0, 11);
        } while (c / d + a * b < 0);

        statement = new AddNode(
          new DivideNode(new NumberNode(c), new NumberNode(d)),
          new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        );
        startStatement = statement.toTex();
        answer = (a * b + c / d).toString();
      }

      break;

    case 5: // a/b ± c/d
      b = randint(0, 11, [0]);
      a = b * randint(0, 11);
      do {
        d = randint(0, 11, [0]);
        c = d * randint(-10, 11);
      } while (a / b + c / d < 0);

      statement = new AddNode(
        new DivideNode(new NumberNode(a), new NumberNode(b)),
        new DivideNode(new NumberNode(c), new NumberNode(d)),
      );

      startStatement = statement.toTex();
      answer = (a / b + c / d).toString();
      break;

    case 6: // a*b*c ± d
      if (coinFlip()) {
        [a, b, c] = [1, 2, 3].map((el) => randint(1, 11));
        d = randint(-a * b * c, 11);

        statement = new AddNode(
          new MultiplyNode(
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            new NumberNode(c),
          ),
          new NumberNode(d),
        );
        startStatement = statement.toTex();
        answer = (a * b * c + d).toString();
      } else {
        d = randint(1, 11);
        do {
          a = randint(-10, 11, [0]);
          [b, c] = [1, 2].map((el) => randint(1, 11));
        } while (a * b * c + d < 0);

        statement = new AddNode(
          new MultiplyNode(
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            new NumberNode(c),
          ),
          new NumberNode(d),
        );
        startStatement = statement.toTex();
        answer = (a * b * c + d).toString();
      }
      break;
    case 7: //a/b*c et c*a/b
      b = randint(2, 10);
      a = b * randint(2, 10);
      c = randint(2, 10);
      statement = new MultiplyNode(
        new DivideNode(a.toTree(), b.toTree()),
        c.toTree(),
      );
      (statement as MultiplyNode).shuffle();
      answer = ((a / b) * c).frenchify();
      startStatement = statement.toTex();

      break;
    case 8: //a+-b+-c
      a = randint(5, 15);
      b = randint(-a, 10);
      c = b > 0 ? randint(-(a + b), 0) : randint(-(a + b), 10);
      statement = new AddNode(new AddNode(a.toTree(), b.toTree()), c.toTree());
      answer = (a + b + c).frenchify();
      startStatement = statement.toTex();
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
    identifiers: { a, b, c, d, flip, type },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 50) + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (studentAns, { answer }) => {
  const answerTree = new NumberNode(Number(answer));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(studentAns);
};

export const operationsPrioritiesWithoutRelative: Exercise<Identifiers> = {
  id: "operationsPrioritiesWithoutRelative",
  connector: "=",
  label: "Priorités opératoires sans les nombres relatifs",
  levels: ["6ème", "5ème", "4ème"],
  sections: ["Calculs"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getOperationsPrioritiesWithoutRelative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
