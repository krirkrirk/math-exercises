/**
 * a*b ±c±d
 * a/b ±c±d
 * a*b*c ± d
 * a*b±c*d
 * a/b ± c*d
 */

import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { DivideNode } from '#root/tree/nodes/operators/divideNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const operationsPriorities: Exercise = {
  id: 'operationsPriorities',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Priorités opératoires',
  levels: ['6', '5', '4'],
  section: 'Calculs',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPriorityQuestions, nb),
  keys: [],
};

export function getPriorityQuestions(): Question {
  const type = randint(1, 6);
  let startStatement = '';
  let answer: string = '';
  let a, b, c, d: number;
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
            new AddNode(new NumberNode(c), new MultiplyNode(new NumberNode(a), new NumberNode(b))),
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
            new AddNode(new NumberNode(c), new DivideNode(new NumberNode(a), new NumberNode(b))),
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
        new MultiplyNode(new MultiplyNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c)),
        new NumberNode(d),
      );
      statement.shuffle();
      startStatement = statement.toTex();
      answer = (a * b * c + d).toString();
      break;
  }

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4(),
          statement: randint(-100, 100) + '',
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    startStatement,
    answer,
    keys: [],
    getPropositions,
  };
  return question;
}
