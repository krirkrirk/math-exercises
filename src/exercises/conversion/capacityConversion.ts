import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const capacityConversion: Exercise = {
  id: 'capacityConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de capacités',
  levels: ['6', '5'],
  section: 'Conversions',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getCapacityConversion, nb),
  keys: [],
};

export function getCapacityConversion(): Question {
  const units = ['mL', 'cL', 'dL', 'L', 'daL', 'hL', 'kL'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomCapacity = DecimalConstructor.random(0, 1000, randint(0, 4));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    for (let i = 0; i < n; i++) {
      const wrongAnswer =
        randomCapacity.multiplyByPowerOfTen(randint(-4, 5, [randomUnitIndex - randomUnitInstructionIndex])).value + '';

      res.push({
        id: Math.random() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
    }

    return res;
  };

  const question: Question = {
    instruction: `$${randomCapacity.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomCapacity.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
    getPropositions,
  };

  return question;
}
