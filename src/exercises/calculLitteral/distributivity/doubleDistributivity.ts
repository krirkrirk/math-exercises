import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const doubleDistributivity: MathExercise<QCMProps, VEAProps> = {
  id: 'doubleDistri',
  connector: '=',
  instruction: '',
  label: 'Distributivité double',
  levels: ['3ème', '2nde', '1reTech'],
  sections: ['Calcul littéral'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getDoubleDistributivityQuestion, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDoubleDistributivityQuestion(): Question {
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affines = AffineConstructor.differentRandoms(2, interval, interval);

  const statementTree = new MultiplyNode(affines[0].toTree(), affines[1].toTree());
  const answerTree = affines[0].multiply(affines[1]).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    res.push({
      id: v4() + '',
      statement: affines[0]
        .multiply(new Affine(-affines[1].a, randint(-9, 10, [affines[1].b])))
        .toTree()
        .toTex(),
      isRightAnswer: false,
      format: 'tex',
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: affines[1]
          .multiply(new Affine(randint(-9, 10, [affines[0].a, 0]), affines[0].b))
          .toTree()
          .toTex(),
        isRightAnswer: false,
        format: 'tex',
      });

    for (let i = 0; i < n - 3; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const affinesTemps = AffineConstructor.differentRandoms(2, interval, interval);
        const wrongAnswer = affinesTemps[0].multiply(affinesTemps[1]).toTree();

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTex(),
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  return {
    instruction: `Développer et réduire : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
    answerFormat: 'tex',
  };
}
