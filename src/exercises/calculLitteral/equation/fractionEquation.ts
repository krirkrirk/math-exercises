import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const fractionEquation: Exercise = {
  id: 'fractionEquation',
  connector: '\\iff',
  instruction: 'Résoudre :',
  label: 'Résoudre une équation quotient nul',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionEquation, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou', 'emptyset'],
};

export function getFractionEquation(): Question {
  // (ax + b)/(cx + d) = 0

  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10, [0]);
  const c = randint(-9, 10, [0]);
  const d = randint(-9, 10, [0]);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);

  const answer =
    -d / c === -b / a
      ? `S = \\emptyset`
      : `S = \\left\\{${simplifyNode(new FractionNode(new NumberNode(-b), new NumberNode(a))).toTex()}\\right\\}`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const a = randint(-9, 10, [0]);
        const b = randint(-9, 10, [0]);
        const c = randint(-9, 10, [0]);
        const d = randint(-9, 10, [0]);
        const wrongAnswer =
          -d / c === -b / a
            ? `S = \\emptyset`
            : `S = \\left\\{${simplifyNode(new FractionNode(new NumberNode(-b), new NumberNode(a))).toTex()}\\right\\}`;

        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: `\\frac{${polynome1.toTex()}}{${polynome2.toTex()}} = 0`,
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou', 'emptyset'],
    getPropositions,
  };

  return question;
}
