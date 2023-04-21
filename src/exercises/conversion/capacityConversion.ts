import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const capacityConversion: Exercise = {
  id: 'capacityConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de capacités',
  levels: ['1', '0'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getCapacityConversion, nb),
  keys: ['x'],
};

export function getCapacityConversion(): Question {
  const units = ['mL', 'cL', 'dL', 'L', 'daL', 'hL', 'kL'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomCapacity = DecimalConstructor.random(0, 1000, randint(0, 4));

  const question: Question = {
    instruction: `$${randomCapacity.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomCapacity.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
  };

  return question;
}
