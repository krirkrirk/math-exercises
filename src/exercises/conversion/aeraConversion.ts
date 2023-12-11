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
  randomAera: number;
};
type VEAProps = {};
const getAeraConversion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const units = ['mm^2', 'cm^2', 'dm^2', 'm^2', 'dam^2', 'hm^2', 'km^2'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km² --> cm² ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 7 ? 7 : randomUnitIndex + 3,
    [randomUnitIndex],
  );
  const randomAera = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomAera.multiplyByPowerOfTen(2 * (randomUnitIndex - randomUnitInstructionIndex)).value + ''
  ).replace('.', ',');
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$${randomAera.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, randomAera: randomAera.value, randomUnitIndex, randomUnitInstructionIndex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, randomAera, randomUnitIndex, randomUnitInstructionIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const aeraDecimal = new Decimal(randomAera);
  while (propositions.length < n) {
    const wrongAnswer =
      aeraDecimal.multiplyByPowerOfTen(2 * randint(-2, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const aeraConversion: MathExercise<QCMProps, VEAProps> = {
  id: 'aeraConversion',
  connector: '=',
  getPropositions,

  label: 'Conversion des aires',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getAeraConversion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
