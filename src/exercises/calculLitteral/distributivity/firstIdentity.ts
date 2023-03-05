import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';

export const firstIdentity: Exercise = {
  id: 'idRmq1',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Identité remarquable $(a+b)^2$',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getFirstIdentityQuestion, nb),
};

export function getFirstIdentityQuestion(): Question {
  const interval = new Interval('[[1; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answerTree = affine.multiply(affine).toTree();

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
}
