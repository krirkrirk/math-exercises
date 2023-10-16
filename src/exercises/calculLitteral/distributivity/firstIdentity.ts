import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const firstIdentity: Exercise = {
  id: 'idRmq1',
  connector: '=',
  instruction: 'Développer et réduire :',
  label: 'Identité remarquable $(a+b)^2$',
  levels: ['3ème', '2nde'],
  sections: ['Calcul littéral'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstIdentityQuestion, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getFirstIdentityQuestion(): Question {
  const interval = new Interval('[[1; 10]]').difference(new DiscreteSet([new Integer(0)]));
  const affine = AffineConstructor.random(interval, interval);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answerTree = affine.multiply(affine).toTree();

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
      statement: new Polynomial([affine.b ** 2, 0, affine.a ** 2]).toTree().toTex(),
      isRightAnswer: false,
      format: 'tex',
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: new Polynomial([affine.b ** 2, affine.a * affine.b, affine.a ** 2]).toTree().toTex(),
        isRightAnswer: false,
        format: 'tex',
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: new Polynomial([affine.b ** 2, affine.a ** 2 + affine.b ** 2, affine.a ** 2]).toTree().toTex(),
        isRightAnswer: false,
        format: 'tex',
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const affineTemp = AffineConstructor.random(interval, interval);
        const wrongAnswer = affine.multiply(affineTemp).toTree();
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
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
    answerFormat: 'tex',
  };
}
