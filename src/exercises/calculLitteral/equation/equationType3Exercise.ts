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
 *  type ax+b=c
 */
export const equationType3Exercise: Exercise = {
  id: 'equa3',

  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Equations $ax+b=c$',
  levels: ['4', '3', '2'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationType3ExerciseQuestion, nb),
};

export function getEquationType3ExerciseQuestion(): Question {
  const interval = new Interval('[[-10; 10]]');
  const intervalStar = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const b = intervalStar.getRandomElement();
  const a = intervalStar.getRandomElement();
  const c = interval.getRandomElement();

  const affine = new Affine(a.value, b.value).toTree();
  const solution = new Rational(c.value - b.value, a.value).simplify();
  const statementTree = new EqualNode(affine, c.toTree());
  const answerTree = new EqualNode(new VariableNode('x'), solution.toTree());
  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  };
  return question;
}
