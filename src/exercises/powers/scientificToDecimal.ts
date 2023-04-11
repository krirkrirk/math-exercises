/**
 * a*10^x vers décimal
 *  */

import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { IntegerConstructor } from '#root/math/numbers/integer/integer';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const scientificToDecimal: Exercise = {
  id: 'scientificToDecimal',
  connector: '=',
  instruction: "Donner l'écriture décimale de :",
  label: 'Ecriture décimale de $a\\times 10^x$',
  levels: ['5', '4', '3', '2'],
  section: 'Puissances',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getScientificToDecimalQuestion, nb),
};

export function getScientificToDecimalQuestion(): Question {
  const randPower = randint(-6, 8);
  const int = IntegerConstructor.random(randint(1, 4));
  const fracPart = DecimalConstructor.randomFracPart(randint(0, 4));
  const randDecimal = DecimalConstructor.fromParts(int + '', fracPart);
  const statement = new MultiplyNode(
    new NumberNode(randDecimal.value),
    new PowerNode(new NumberNode(10), new NumberNode(randPower)),
  );
  const answerTree = randDecimal.multiplyByPowerOfTen(randPower).toTree();

  const question: Question = {
    startStatement: statement.toTex(),
    answer: answerTree.toTex(),
    keys: [],
  };
  return question;
}
