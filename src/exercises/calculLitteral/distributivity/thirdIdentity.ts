import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

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

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
  };
}
