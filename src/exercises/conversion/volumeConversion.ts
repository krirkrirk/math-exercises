import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const volumeConversion: Exercise = {
  id: 'volumeConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de volumes',
  levels: ['1', '0'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getVolumeConversion, nb),
  keys: ['x'],
};

export function getVolumeConversion(): Question {
  const units = ['mm^3', 'cm^3', 'dm^3', 'm^3', 'dam^3', 'hm^3', 'km^3'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomVolume = DecimalConstructor.random(0, 1000, randint(0, 4));

  const question: Question = {
    instruction: `$${randomVolume.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomVolume.multiplyByPowerOfTen(3 * (randomUnitIndex - randomUnitInstructionIndex)).value + '',
    keys: [],
  };

  return question;
}
