import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const simpleDistributivity: Exercise = {
  id: 'simpleDistri',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Distributivité simple',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getSimpleDistributivityQuestion, nb),
  keys: ['x'],
};

export function getSimpleDistributivityQuestion(): Question {
  const excludeNbrs = [new Integer(-1), new Integer(0), new Integer(1)];
  const interval = new Interval('[[-10; 10]]').difference(new DiscreteSet(excludeNbrs));
  const affine = AffineConstructor.random(interval, interval);
  const coeff = interval.getRandomElement();

  const statementTree = new MultiplyNode(new NumberNode(coeff.value), affine.toTree());
  const answerTree = affine.times(coeff.value).toTree();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: new Affine(coeff.value * affine.a, affine.b).toTree().toTex(),
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: new Affine(affine.a, coeff.value * affine.b).toTree().toTex(),
        isRightAnswer: false,
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: affine.times(-coeff.value).toTree().toTex(),
        isRightAnswer: false,
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = AffineConstructor.random(interval, interval).toTree();

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
