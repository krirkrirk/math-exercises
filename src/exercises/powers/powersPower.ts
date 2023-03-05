/**
 * (a^b)^c
 */

import { Power } from '#root/math/numbers/integer/power';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const powersOfTenPower: Exercise = {
  id: 'powersOfTenPower',
  connector: '=',
  instruction: 'Calculer :',
  label: "Puissance d'une puissance de 10 ",
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion(true), nb),
};

export const powersPower: Exercise = {
  id: 'powersPower',
  connector: '=',
  instruction: 'Calculer :',
  label: "Puissance d'une puissance",
  levels: ['4', '3', '2', '1'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersPowerQuestion, nb),
};

export function getPowersPowerQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new PowerNode(new PowerNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c));
  let answerTree = new Power(a, b * c).simplify();

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
