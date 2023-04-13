import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const firstDegreeEquation: Exercise = {
  id: 'firstDegreeEquation',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du premier degré du type $\\frac{a}{x} = b$',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getFirstDegreeEquation(): Question {
  const a = randint(-30, 30, [0]);
  const b = randint(-30, 30, [0]);

  const question: Question = {
    instruction: `Résoudre l'équation suivante $\\frac{${a}}{x} = ${b}$`,
    startStatement: `x`,
    answer: simplifyNode(new NumberNode(a / b)).toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
  };

  return question;
}
