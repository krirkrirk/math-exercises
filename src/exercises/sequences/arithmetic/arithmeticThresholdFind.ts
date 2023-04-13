import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const arithmeticThresholdFind: Exercise = {
  id: 'arithmeticThresholdFind',
  connector: '=',
  instruction: '',
  label: "Calculer un seuil à l'aide d'une suite arithmétique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getArithmeticThresholdFind, nb),
  keys: ['r', 'n', 'u', 'underscore', 'inf', 'sup', 'approx'],
};

export function getArithmeticThresholdFind(): Question {
  const firstValue = randint(-10, 10);
  const reason = randint(-10, 10, [0]);
  let randValue = firstValue;

  const formula = new Polynomial([firstValue, reason], 'n');

  let instruction = `$(u_n)$ est une suite arithmétique définie par $u_n = ${formula.toString()}$. `;
  let answer = '';

  if (reason > 0) {
    randValue += randint(reason, 100);
    instruction += `A partir de quel rang a-t-on $u_n > ${randValue}$ ?`;
  } else {
    randValue += randint(-100, reason);
    instruction += `A partir de quel rang a-t-on $u_n < ${randValue}$ ?`;
  }

  const question: Question = {
    instruction,
    startStatement: `n`,
    answer: (Math.floor((randValue - firstValue) / reason) + 1).toString(),
    keys: ['r', 'n', 'u', 'underscore', 'inf', 'sup', 'approx'],
  };

  return question;
}
