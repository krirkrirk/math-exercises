import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Integer } from 'src/math/numbers/integer/integer';
import { Rational } from 'src/math/numbers/rationals/rational';
import { Affine } from 'src/math/polynomials/affine';
import { DiscreteSet } from 'src/math/sets/discreteSet';
import { Interval } from 'src/math/sets/intervals/intervals';
import { EqualNode } from 'src/tree/nodes/operators/equalNode';
import { VariableNode } from 'src/tree/nodes/variables/variableNode';

/**
 *  type ax=b
 */
export const equationType2Exercise: Exercise = {
  id: 'equa2',
  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Equations $ax=b$',
  levels: ['4', '3', '2'],
  section: 'Calcul littéral',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType2ExerciseQuestion, nb),
};

export function getEquationType2ExerciseQuestion(): Question {
  const interval = new Interval('[[-10; 10]]');
  const intervalStar = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const b = interval.getRandomElement();
  const a = intervalStar.getRandomElement();
  const solution = new Rational(b.value, a.value).simplify();
  const affine = new Affine(a.value, 0).toTree();
  const tree = new EqualNode(affine, b.toTree());
  const answer = new EqualNode(new VariableNode('x'), solution.toTree());
  const question: Question = {
    startStatement: tree.toTex(),
    answer: answer.toTex(),
  };
  return question;
}
