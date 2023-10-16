import { DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const lengthConversion: Exercise = {
  id: 'lengthConversion',
  connector: '=',
  instruction: '',
  label: 'Conversion de longueurs',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getLengthConversion, nb),
  keys: [],
};

export function getLengthConversion(): Question {
  const units = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomlength = DecimalConstructor.random(0, 1000, randint(0, 4));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: randomlength.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer =
          randomlength.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
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
    instruction: `$${randomlength.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer: randomlength.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '',
    keys: [],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
