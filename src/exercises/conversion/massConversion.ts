import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const massConversion: Exercise = {
  id: 'massConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de masses',
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMassConversion, nb),
  keys: [],
};

export function getMassConversion(): Question {
  const units = ['mg', 'cg', 'dg', 'g', 'dag', 'hg', 'kg'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomMass = DecimalConstructor.random(0, 1000, randint(0, 4));

  const question: Question = {
    instruction: `$${randomMass.value}$ ${units[randomUnitIndex]} = ... ${units[randomUnitInstructionIndex]}`,
    answer: randomMass.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
  };

  return question;
}
