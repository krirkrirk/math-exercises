import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

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

  const question: Question = {
    startStatement: `\\frac{${polynome1.toTex()}}{${polynome2.toTex()}} = 0`,
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou', 'emptyset'],
  };

  return question;
}
