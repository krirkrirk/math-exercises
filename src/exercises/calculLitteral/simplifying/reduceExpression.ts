import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const reduceExpression: Exercise = {
  id: 'reduceExpression',
  connector: '=',
  instruction: "Réduire l'expression suivante :",
  isSingleStep: false,
  label: 'Réduire une expression',
  levels: ['3', '2'],
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getReduceExpression, nb),
  keys: ['x'],
};

export function getReduceExpression(): Question {
  const rand = randint(0, 7);
  let statement: any;
  let polynome1: Polynomial;
  let polynome2: Polynomial;
  let answer: string;

  switch (rand) {
    case 0: // ax + b + cx + d
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6), randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 1:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([0, randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 2:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 3:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([0, randint(-5, 6), randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 4:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([0, 0, randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 5:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([0, randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    case 6:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6, [0])]);

      statement = new AddNode(polynome1.toTree(), polynome2.toTree());
      statement.shuffle();

      answer = polynome1.add(polynome2).toTree().toTex();
      break;

    default:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6, [0])]);
      statement = new AddNode(new Polynomial([1, 2]).toTree(), new Polynomial([3, 4]).toTree());
      statement.shuffle();
      answer = polynome1.add(polynome2).toTree().toTex();
      break;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        polynome2 = new Polynomial(
          rand < 3
            ? [randint(-5, 6, [0]), randint(-5, 6, [0])]
            : [randint(-5, 6, [0]), randint(-5, 6, [0]), randint(-5, 6, [0])],
        );
        proposition = {
          id: v4() + '',
          statement: polynome1.add(polynome2).toTree().toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: statement.toTex(),
    answer,
    keys: ['x'],
    getPropositions,
  };
  return question;
}
