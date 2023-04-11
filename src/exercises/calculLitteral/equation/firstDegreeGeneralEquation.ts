import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';

export const firstDegreeGeneralEquation: Exercise = {
  id: 'firstDegreeGeneralEquation',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du premier degré du type ax + b = cx',
  levels: ['2', '1'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeGeneralEquation, nb),
};

export function getFirstDegreeGeneralEquation(): Question {
  let a = randint(-9, 10, [0]);
  const b = randint(-9, 10);
  const c = randint(-9, 10, [a, 0]);

  const question: Question = {
    instruction: `Résoudre l'équation suivante $${new Polynomial([b, a])} = ${new Polynomial([0, c])}$`,
    startStatement: `x`,
    answer: simplifyNode(new NumberNode(-b / (a - c))).toTex(),
  };

  return question;
}
