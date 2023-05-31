import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Proposition, Question } from '../exercise';
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
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km² --> cm² ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 7 ? 7 : randomUnitIndex + 3,
    [randomUnitIndex],
  );
  const randomAera = DecimalConstructor.random(0, 1000, randint(0, 4));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    for (let i = 0; i < n; i++) {
      const wrongAnswer =
        randomAera.multiplyByPowerOfTen(2 * randint(-4, 5, [randomUnitIndex - randomUnitInstructionIndex])).value + '';

      res.push({
        id: Math.random() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
    }

    return res;
  };

  const question: Question = {
    instruction: `$${randomAera.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomAera.multiplyByPowerOfTen(2 * (randomUnitIndex - randomUnitInstructionIndex)).value + '',
    keys: [],
    getPropositions,
  };

  return question;
}
