import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const multiplicationEquation: Exercise = {
  id: 'multiplicationEquation',
  connector: '\\iff',
  instruction: 'Résoudre :',
  label: 'Résoudre une équation produit nul',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getMultiplicationEquation, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou'],
};

export function getMultiplicationEquation(): Question {
  // (ax + b)(cx + d) = 0
  let a, b, c, d;
  do {
    a = randint(-9, 10, [0]);
    b = randint(-9, 10, [0]);
    c = randint(-9, 10, [0]);
    d = randint(-9, 10, [0]);
  } while (a / c === b / d);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);

  const question: Question = {
    startStatement: `(${polynome1.toTex()})(${polynome2.toTex()}) = 0`,
    answer: `S = \\left\\{${simplifyNode(
      new FractionNode(new NumberNode(-b), new NumberNode(a)),
    ).toTex()};${simplifyNode(new FractionNode(new NumberNode(-d), new NumberNode(c))).toTex()}\\right\\}`,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou'],
  };

  return question;
}