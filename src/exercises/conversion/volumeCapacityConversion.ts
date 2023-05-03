import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const volumeCapacityConversion: Exercise = {
  id: 'volumeCapacityConversion',
  connector: '=',
  instruction: '',
  label: "Conversion d'un volume vers une contenance et vice versa",
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getVolumeCapacityConversion, nb),
  keys: [],
};

export function getVolumeCapacityConversion(): Question {
  const volumeUnits = ['mm^3', 'cm^3', 'dm^3', 'm^3', 'dam^3', 'hm^3', 'km^3'];
  const capacityUnits = ['mL', 'cL', 'dL', 'L', 'daL', 'hL', 'kL'];

  const randomUnitInstructionIndex = randint(0, 7);
  const randomUnitIndex = randint(
    // cette manip a pour but d'éviter des conversion avec des nombres trop grand/petit
    randomUnitInstructionIndex - 1 < 0 ? 0 : randomUnitInstructionIndex - 1,
    randomUnitInstructionIndex + 2 > 7 ? 7 : randomUnitInstructionIndex + 2,
  );
  const random = DecimalConstructor.random(0, 1000, randint(0, 4));

  let instructionUnit;
  let AsnwerUnit;
  let answer;

  if (coinFlip()) {
    instructionUnit = volumeUnits[randomUnitIndex];
    AsnwerUnit = capacityUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(3 * (randomUnitIndex - 2) + 3 - randomUnitInstructionIndex).value + '';
  } else {
    instructionUnit = capacityUnits[randomUnitIndex];
    AsnwerUnit = volumeUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(randomUnitIndex - 3 + 3 * (2 - randomUnitInstructionIndex)).value + '';
  }

  const question: Question = {
    instruction: `$${random.value}$ $${instructionUnit}$ = ... $${AsnwerUnit}$`,
    answer,
    keys: [],
  };

  return question;
}
