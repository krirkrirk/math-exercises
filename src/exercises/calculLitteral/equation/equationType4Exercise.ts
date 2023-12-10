import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
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
 *  type ax+b=cx+d
 */
export const equationType4Exercise: MathExercise<QCMProps, VEAProps> = {
  id: 'equa4',

  connector: '\\iff',
  instruction: '',
  label: 'Équations $ax+b=cx+d$',
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  sections: ['Équations'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationType4ExerciseQuestion, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getEquationType4ExerciseQuestion(): Question {
  const interval = new Interval('[[-10; 10]]');
  const intervalStar = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const a = intervalStar.getRandomElement()!;
  const b = interval.getRandomElement();
  const intervalC = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0), new Integer(a.value)]));
  const c = intervalC.getRandomElement()!;
  const d = interval.getRandomElement();

  const affines = [new Affine(a.value, b.value), new Affine(c.value, d.value)];
  const solution = new Rational(d.value - b.value, a.value - c.value).simplify();

  const statementTree = new EqualNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = new EqualNode(new VariableNode('x'), solution.toTree());

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(
          d.value - b.value + randint(-7, 8, [0, -d.value + b.value]),
          a.value - c.value + randint(-7, 8, [-a.value + c.value, 0]),
        ).simplify();

        proposition = {
          id: v4() + '',
          statement: new EqualNode(new VariableNode('x'), wrongAnswer.toTree()).toTex(),
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
    instruction: `Résoudre : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
