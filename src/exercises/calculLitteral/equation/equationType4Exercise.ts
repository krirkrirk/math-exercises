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
 *  type ax+b=cx+d
 */
export const equationType4Exercise: Exercise = {
  id: 'equa4',

  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Equations $ax+b=cx+d$',
  levels: ['4', '3', '2'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationType4ExerciseQuestion, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getEquationType4ExerciseQuestion(): Question {
  const interval = new Interval('[[-10; 10]]');
  const intervalStar = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const a = intervalStar.getRandomElement();
  const b = interval.getRandomElement();
  const intervalC = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0), new Integer(a.value)]));
  const c = intervalC.getRandomElement();
  const d = interval.getRandomElement();

  const affines = [new Affine(a.value, b.value), new Affine(c.value, d.value)];
  const solution = new Rational(d.value - b.value, a.value - c.value).simplify();

  const statementTree = new EqualNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = new EqualNode(new VariableNode('x'), solution.toTree());
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  };
  return question;
}
