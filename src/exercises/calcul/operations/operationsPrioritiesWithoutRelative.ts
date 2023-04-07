/**
 * a*b ±c±d
 * a/b ±c±d
 * a*b*c ± d
 * a*b±c*d
 * a/b ± c*d
 */

import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { coinFlip } from '#root/utils/coinFlip';

export const operationsPrioritiesWithoutRelative: Exercise = {
  id: 'operationsPrioritiesWithoutRelative',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Priorités opératoires sans les nombres relatifs',
  levels: ['6', '5', '4'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getOperationsPrioritiesWithoutRelative, nb),
};

export function getOperationsPrioritiesWithoutRelative(): Question {
  const type = randint(1, 7);
  const flip = randint(1, 4);
  let startStatement = '';
  let answer: string = '';
  let a, b, c, d: number;
  let statement: AddNode;
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
            new AddNode(new NumberNode(c), new MultiplyNode(new NumberNode(a), new NumberNode(b))),
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
            new AddNode(new NumberNode(c), new DivideNode(new NumberNode(a), new NumberNode(b))),
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
          new MultiplyNode(new MultiplyNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c)),
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
          new MultiplyNode(new MultiplyNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c)),
          new NumberNode(d),
        );
        startStatement = statement.toTex();
        answer = (a * b * c + d).toString();
      }
      break;
  }

  const question: Question = {
    startStatement,
    answer,
  };
  return question;
}
