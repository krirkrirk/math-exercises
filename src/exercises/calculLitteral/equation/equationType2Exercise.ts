import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Affine } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 *  type ax=b
 */
export const equationType2Exercise: Exercise = {
  id: 'equa2',
  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Équations $ax=b$',
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

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(
          b.value + randint(-7, 8, [0, -b.value]),
          a.value + randint(-7, 8, [-a.value, 0]),
        ).simplify();
        proposition = {
          id: v4() + '',
          statement: new EqualNode(new VariableNode('x'), wrongAnswer.toTree()).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: tree.toTex(),
    answer: answer.toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };
  return question;
}
