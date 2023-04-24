import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const lengthConversion: Exercise = {
  id: 'lengthConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de longueurs',
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getLengthConversion, nb),
  keys: [],
};

export function getLengthConversion(): Question {
  const units = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomlength = DecimalConstructor.random(0, 1000, randint(0, 4));

  const question: Question = {
    instruction: `$${randomlength.value}$ ${units[randomUnitIndex]} = ... ${units[randomUnitInstructionIndex]}`,
    answer: randomlength.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
  };

  return question;
}
