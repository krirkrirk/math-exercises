import { randint } from '../../mathutils/random/randint';
import { Power } from '../../numbers/integer/power';
import { NumberNode } from '../../tree/nodes/numbers/numberNode';
import { FractionNode } from '../../tree/nodes/operators/fractionNode';
import { MultiplyNode } from '../../tree/nodes/operators/multiplyNode';
import { PowerNode } from '../../tree/nodes/operators/powerNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

/**
 * 10^(-x) into 0,0...1
 */

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
