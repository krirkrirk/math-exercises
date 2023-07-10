import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const doubleDistributivity: Exercise = {
  id: 'doubleDistri',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Distributivité double',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getDoubleDistributivityQuestion, nb),
  keys: ['x'],
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
    });

    res.push({
      id: v4() + '',
      statement: affines[0]
        .multiply(new Affine(-affines[1].a, randint(-9, 10, [affines[1].b])))
        .toTree()
        .toTex(),
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: affines[1]
          .multiply(new Affine(randint(-9, 10, [affines[0].a]), affines[0].b))
          .toTree()
          .toTex(),
        isRightAnswer: false,
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
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  return {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
  };
}
