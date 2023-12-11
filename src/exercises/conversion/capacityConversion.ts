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
  randomCapacity: number;
};
type VEAProps = {};

const getCapacityConversion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const units = ['mL', 'cL', 'dL', 'L', 'daL', 'hL', 'kL'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(0, 7, [randomUnitIndex]);
  const randomCapacity = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (randomCapacity.multiplyByPowerOfTen(randomUnitIndex - randomUnitInstructionIndex).value + '').replace(
    '.',
    ',',
  );
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$${randomCapacity.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, randomCapacity: randomCapacity.value, randomUnitIndex, randomUnitInstructionIndex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, randomCapacity, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const capacityDecimal = new Decimal(randomCapacity);
  while (propositions.length < n) {
    const wrongAnswer =
      capacityDecimal.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const capacityConversion: MathExercise<QCMProps, VEAProps> = {
  id: 'capacityConversion',
  connector: '=',
  getPropositions,

  label: 'Conversion de capacités',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getCapacityConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
