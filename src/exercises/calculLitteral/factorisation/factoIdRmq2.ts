import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';

export const factoIdRmq2: Exercise = {
  id: 'factoIdRmq2',
  connector: '=',
  instruction: 'Factoriser :',
  isSingleStep: false,
  label: 'Factorisation du type $a^2 - 2ab + b^2$',
  levels: ['3', '2'],
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
};

export function getFactoType1Question(): Question {
  const intervalA = new Interval('[[0; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const intervalB = new Interval('[[-10; 0]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(intervalA, intervalB);

  const statementTree = affine.multiply(affine).toTree();
  const answerTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
