import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 *  type x+a=b
 */
export const equationType1Exercise: Exercise = {
  id: 'equa1',
  connector: '\\iff',
  instruction: 'Résoudre : ',
  label: 'Équations $x+a = b$',
  levels: ['4', '3', '2'],
  section: 'Équations',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType1ExerciseQuestion, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getEquationType1ExerciseQuestion(): Question {
  const interval = new Interval('[[-10; 10]]');
  const intervalStar = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const b = interval.getRandomElement();
  const a = intervalStar.getRandomElement();
  const solution = b.value - a.value;
  const affine = new Affine(1, a.value).toTree();
  const tree = new EqualNode(affine, b.toTree());

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: `x = ${solution}`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = solution + randint(-3, 4, [0]);
        proposition = {
          id: v4() + '',
          statement: `x = ${wrongAnswer}`,
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
    answer: `x = ${solution}`,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };
  return question;
}
