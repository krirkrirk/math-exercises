/**
 * 10^(-x) into 0,0...1
 */

import { Power } from 'src/math/numbers/integer/power';
import { randint } from 'src/math/utils/random/randint';
import { NumberNode } from 'src/tree/nodes/numbers/numberNode';
import { PowerNode } from 'src/tree/nodes/operators/powerNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const powersOfTenToDecimal: Exercise = {
  id: 'powersOfTenToDecimal',
  connector: '=',
  instruction: "Donner l'écriture décimale de :",
  label: "Ecriture décimale d'une puissance de 10",
  levels: ['5', '4', '3', '2'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersOfTenDivisionQuestion, nb),
};

export function getPowersOfTenDivisionQuestion(): Question {
  const randPower = randint(-6, 8);

  const statement = new PowerNode(new NumberNode(10), new NumberNode(randPower));
  const answerTree = new Power(10, randPower).toDecimalWriting().toTree();

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
  };
  return question;
}
