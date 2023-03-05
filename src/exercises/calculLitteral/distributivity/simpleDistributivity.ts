import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { AffineConstructor } from 'src/math/polynomials/affine';
import { DiscreteSet } from 'src/math/sets/discreteSet';
import { Interval } from 'src/math/sets/intervals/intervals';
import { NumberNode } from 'src/tree/nodes/numbers/numberNode';
import { MultiplyNode } from 'src/tree/nodes/operators/multiplyNode';

export const simpleDistributivity: Exercise = {
  id: 'simpleDistri',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Distributivité simple',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getSimpleDistributivityQuestion, nb),
};

export function getSimpleDistributivityQuestion(): Question {
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);
  const coeff = interval.getRandomElement();

  const statementTree = new MultiplyNode(new NumberNode(coeff.value), affine.toTree());
  const answerTree = affine.times(coeff.value).toTree();
  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
}
