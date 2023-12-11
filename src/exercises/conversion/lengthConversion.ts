import { Decimal, DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  randomUnitIndex: number;
  randomUnitInstructionIndex: number;
  randomLength: number;
};
type VEAProps = {};

const getLengthConversion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const units = ['mm', 'cm', 'dm', 'm', 'dam', 'hm', 'km'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomLength = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (randomLength.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '').replace(
    '.',
    ',',
  );
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$${randomLength.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, randomLength: randomLength.value, randomUnitIndex, randomUnitInstructionIndex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, randomLength, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const lengthDecimal = new Decimal(randomLength);
  while (propositions.length < n) {
    const wrongAnswer =
      lengthDecimal.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const lengthConversion: MathExercise<QCMProps, VEAProps> = {
  id: 'lengthConversion',
  connector: '=',
  label: 'Conversion de longueurs',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getLengthConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
