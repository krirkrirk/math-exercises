import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const volumeConversion: Exercise = {
  id: 'volumeConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de volumes',
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getVolumeConversion, nb),
  keys: [],
};

export function getVolumeConversion(): Question {
  const units = ['mm^3', 'cm^3', 'dm^3', 'm^3', 'dam^3', 'hm^3', 'km^3'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km³ --> cm³ ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 7 ? 7 : randomUnitIndex + 3,
    [randomUnitIndex],
  );
  const randomVolume = DecimalConstructor.random(0, 1000, randint(0, 4));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: randomVolume.multiplyByPowerOfTen(3 * (randomUnitIndex - randomUnitInstructionIndex)).value + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer =
          randomVolume.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$${randomVolume.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomVolume.multiplyByPowerOfTen(3 * (randomUnitIndex - randomUnitInstructionIndex)).value + '',
    keys: [],
    getPropositions,
  };

  return question;
}
