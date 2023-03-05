import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { AffineConstructor } from 'src/math/polynomials/affine';
import { DiscreteSet } from 'src/math/sets/discreteSet';
import { Interval } from 'src/math/sets/intervals/intervals';
import { MultiplyNode } from 'src/tree/nodes/operators/multiplyNode';

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
