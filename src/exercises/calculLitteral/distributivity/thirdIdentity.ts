import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const thirdIdentity: Exercise = {
  id: 'idRmq3',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Identité remarquable $(a+b)(a-b)$',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getThirdIdentityQuestion, nb),
  keys: ['x'],
};

export function getThirdIdentityQuestion(): Question {
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);
  const affine2 = new Affine(affine.a, -affine.b);
  const statementTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const answerTree = affine.multiply(affine2).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: affine.multiply(affine2.opposite()).toTree().toTex(),
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: affine.multiply(affine).toTree().toTex(),
        isRightAnswer: false,
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: affine2.multiply(affine2.opposite()).toTree().toTex(),
        isRightAnswer: false,
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const affineTemp = AffineConstructor.random(interval, interval);
        const affineTemp2 = new Affine(affineTemp.a, -affineTemp.b);
        const wrongAnswer = affineTemp.multiply(affineTemp2).toTree();

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

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
  };
}
