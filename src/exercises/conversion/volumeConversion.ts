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
  randomVolume: number;
};
type VEAProps = {};
const getVolumeConversion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const units = ['mm^3', 'cm^3', 'dm^3', 'm^3', 'dam^3', 'hm^3', 'km^3'];

  const randomUnitIndex = randint(0, 7);
  const randomUnitInstructionIndex = randint(
    // cette manip a pour but d'éviter des conversion de type km³ --> cm³ ou le contraire (chiffre trop grand/petit)
    randomUnitIndex - 2 < 0 ? 0 : randomUnitIndex - 2,
    randomUnitIndex + 2 > 7 ? 7 : randomUnitIndex + 3,
    [randomUnitIndex],
  );
  const randomVolume = DecimalConstructor.random(0, 1000, randint(0, 4));
  const answer = (
    randomVolume.multiplyByPowerOfTen(3 * (randomUnitIndex - randomUnitInstructionIndex)).value + ''
  ).replace('.', ',');
  const question: Question<QCMProps, VEAProps> = {
    instruction: `$${randomVolume.value}$ $${units[randomUnitIndex]}$ = ... $${units[randomUnitInstructionIndex]}$`,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, randomUnitIndex, randomUnitInstructionIndex, randomVolume: randomVolume.value },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, randomUnitIndex, randomUnitInstructionIndex, randomVolume },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const volumeDecimal = new Decimal(randomVolume);
  while (propositions.length < n) {
    const wrongAnswer =
      volumeDecimal.multiplyByPowerOfTen(randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex])).value + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const volumeConversion: MathExercise<QCMProps, VEAProps> = {
  id: 'volumeConversion',
  connector: '=',
  label: 'Conversion de volumes',
  levels: ['6ème', '5ème', 'CAP', '2ndPro'],
  sections: ['Conversions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getVolumeConversion, nb),
  getPropositions,

  qcmTimer: 60,
  freeTimer: 60,
};
