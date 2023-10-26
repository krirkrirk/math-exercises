import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const massConversion: MathExercise = {
  id: 'massConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de masses',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMassConversion, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getMassConversion(): Question {
  const units = ['mg', 'cg', 'dg', 'g', 'dag', 'hg', 'kg'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomMass = DecimalConstructor.random(0, 1000, randint(0, 4));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: randomMass.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer =
          randomMass.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$${randomMass.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomMass.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
