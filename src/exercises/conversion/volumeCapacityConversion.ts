import { Decimal, DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

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
  let answer: Decimal;

  if (coinFlip()) {
    instructionUnit = volumeUnits[randomUnitIndex];
    AsnwerUnit = capacityUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(3 * (randomUnitIndex - 2) + 3 - randomUnitInstructionIndex);
  } else {
    instructionUnit = capacityUnits[randomUnitIndex];
    AsnwerUnit = volumeUnits[randomUnitInstructionIndex];
    answer = random.multiplyByPowerOfTen(randomUnitIndex - 3 + 3 * (2 - randomUnitInstructionIndex));
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer.value + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = answer.multiplyByPowerOfTen(randint(-3, 4, [0]));
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.value + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$${random.value}$ $${instructionUnit}$ = ... $${AsnwerUnit}$`,
    answer: answer.value + '',
    keys: [],
    getPropositions,
  };

  return question;
}
