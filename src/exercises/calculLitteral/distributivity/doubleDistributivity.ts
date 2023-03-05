import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';

export const doubleDistributivity: Exercise = {
  id: 'doubleDistri',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Distributivité double',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getDoubleDistributivityQuestion, nb),
};

export function getDoubleDistributivityQuestion(): Question {
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affines = AffineConstructor.differentRandoms(2, interval, interval);

  const statementTree = new MultiplyNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = affines[0].multiply(affines[1]).toTree();

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
}
