/**
 * a^b*a^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const powersOfTenProduct: Exercise = {
  id: 'powersOfTenProduct',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Multiplication de puissances de 10',
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersProductQuestion(true), nb),
};

export const powersProduct: Exercise = {
  id: 'powersProduct',
  connector: '=',
  instruction: 'Calculer :',
  label: 'Multiplication de puissances',
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersProductQuestion, nb),
  keys: [],
};

export function getPowersProductQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new MultiplyNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c)),
  );
  const answerTree = new Power(a, b + c).simplify();

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
  };
  return question;
}
