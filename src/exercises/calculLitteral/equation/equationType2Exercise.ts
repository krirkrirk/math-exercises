import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Affine } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';

/**
 *  type ax=b
 */
export const equationType2Exercise: Exercise = {
  id: 'equa2',
  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Equations $ax=b$',
  levels: ['4', '3', '2'],
  section: 'Équations',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType2ExerciseQuestion, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
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
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  };
  return question;
}
