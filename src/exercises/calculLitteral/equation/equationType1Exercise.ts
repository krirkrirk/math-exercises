import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 *  type x+a=b
 */
export const equationType1Exercise: MathExercise = {
  id: 'equa1',
  connector: '\\iff',
  instruction: '',
  label: 'Équations $x+a = b$',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  sections: ['Équations'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEquationType1ExerciseQuestion, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getEquationType1ExerciseQuestion(): Question {
  const b = randint(-10, 11);
  const a = randint(-10, 11, [0]);
  const solution = b - a;
  const affine = new Affine(1, a).toTree();
  const tree = new EqualNode(affine, new NumberNode(b));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: `x = ${solution}`,
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4() + '',
      statement: `x = ${b + a}`,
      isRightAnswer: false,
      format: 'tex',
    });
    for (let i = 0; i < n - 2; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = solution + randint(-3, 4, [0]);
        proposition = {
          id: v4() + '',
          statement: `x = ${wrongAnswer}`,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Résoudre : $${tree.toTex()}$`,
    startStatement: tree.toTex(),
    answer: `x=${solution}`,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
