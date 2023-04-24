import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const aeraConversion: Exercise = {
  id: 'aeraConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion des aires',
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAeraConversion, nb),
  keys: [],
};

export function getAeraConversion(): Question {
  const units = ['mm^2', 'cm^2', 'dm^2', 'm^2', 'dam^2', 'hm^2', 'km^2'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomAera = DecimalConstructor.random(0, 1000, randint(0, 4));

  const question: Question = {
    instruction: `$${randomAera.value}$ ${units[randomUnitIndex]} = ... ${units[randomUnitInstructionIndex]}`,
    answer: randomAera.multiplyByPowerOfTen(2 * (randomUnitIndex - randomUnitInstructionIndex)).value + '',
    keys: [],
  };

  return question;
}
