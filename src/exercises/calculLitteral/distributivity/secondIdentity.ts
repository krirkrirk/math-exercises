import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { AffineConstructor } from 'src/math/polynomials/affine';
import { DiscreteSet } from 'src/math/sets/discreteSet';
import { Interval } from 'src/math/sets/intervals/intervals';
import { NumberNode } from 'src/tree/nodes/numbers/numberNode';
import { PowerNode } from 'src/tree/nodes/operators/powerNode';

export const secondIdentity: Exercise = {
  id: 'idRmq2',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Identité remarquable $(a-b)^2$',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getSecondIdentityQuestion, nb),
};

export function getSecondIdentityQuestion(): Question {
  const intervalA = new Interval('[[0; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const intervalB = new Interval('[[-10; 0]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(intervalA, intervalB);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answerTree = affine.multiply(affine).toTree();

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
}
