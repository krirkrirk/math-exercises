import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const factoIdRmq3: Exercise = {
  id: 'factoIdRmq3',
  connector: '=',
  instruction: 'Factoriser :',
  isSingleStep: false,
  label: 'Factorisation du type $a^2 - b^2$',
  levels: ['3', '2'],
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  keys: ['x'],
};

export function getFactoType1Question(): Question {
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);
  const affine2 = new Affine(affine.a, -affine.b);

  const statementTree = affine.multiply(affine2).toTree();
  const answerTree = new MultiplyNode(affine.toTree(), affine2.toTree());

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: new MultiplyNode(affine.toTree(), affine.toTree()).toTex(),
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: new MultiplyNode(affine2.toTree(), affine2.toTree()).toTex(),
        isRightAnswer: false,
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: new MultiplyNode(affine2.toTree(), new Affine(-affine.b, affine.a).toTree()).toTex(),
        isRightAnswer: false,
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new MultiplyNode(
          new Affine(randint(-9, 10, [0]), randint(-9, 10, [0])).toTree(),
          new Affine(randint(-9, 10, [0]), randint(-9, 10, [0])).toTree(),
        );

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
  };
  return question;
}
