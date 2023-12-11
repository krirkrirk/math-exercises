import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  rand: number;
  polynome1Coeffs: number[];
};
type VEAProps = {};
const getReduceExpression: QuestionGenerator<QCMProps, VEAProps> = () => {
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

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Réduire l'expression suivante : $${statement.toTex()}$`,
    startStatement: statement.toTex(),
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, rand, polynome1Coeffs: polynome1.coefficients },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, rand, polynome1Coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const polynome1 = new Polynomial(polynome1Coeffs);
  while (propositions.length < n) {
    const polynome2 = new Polynomial(
      rand < 3
        ? [randint(-5, 6, [0]), randint(-5, 6, [0])]
        : [randint(-5, 6, [0]), randint(-5, 6, [0]), randint(-5, 6, [0])],
    );
    tryToAddWrongProp(propositions, polynome1.add(polynome2).toTree().toTex());
  }

  return shuffle(propositions);
};

export const reduceExpression: MathExercise<QCMProps, VEAProps> = {
  id: 'reduceExpression',
  connector: '=',
  isSingleStep: false,
  label: 'Réduire une expression',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro'],
  sections: ['Calcul littéral'],
  generator: (nb: number) => getDistinctQuestions(getReduceExpression, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
