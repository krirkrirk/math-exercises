import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Decimal, DecimalConstructor } from '#root/math/numbers/decimals/decimal';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

/**
 * arrondi à l'unité
 */

const instructions = [
  "Arrondir à l'unité :",
  'Arrondir au dixième :',
  'Arrondir au centième :',
  'Arrondir au millième :',
];

const getRoundQuestions: QuestionGenerator<QCMProps, VEAProps, { precisionAsked: number }> = (opts) => {
  const precisionAsked = opts?.precisionAsked || 0;
  const precision = randint(precisionAsked + 1, precisionAsked + 5);
  const dec = DecimalConstructor.random(0, 1000, precision);
  const decTex = dec.toTree().toTex();
  const answer = dec.round(precisionAsked).toTree().toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `${instructions[precisionAsked]} ${decTex}`,
    startStatement: decTex,
    answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, precisionAsked, decimal: dec.value, precision },
  };
  return question;
};

type QCMProps = {
  answer: string;
  precisionAsked: number;
  decimal: number;
  precision: number;
};
type VEAProps = {};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, precisionAsked, decimal, precision }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const dec = new Decimal(decimal);

  tryToAddWrongProp(
    propositions,
    round(dec.value, precisionAsked) === round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked)
      ? round(dec.value - 0.5 * 10 ** -precisionAsked, precisionAsked) + ''
      : round(dec.value + 0.5 * 10 ** -precisionAsked, precisionAsked) + '',
  );
  tryToAddWrongProp(propositions, dec.toTree().toTex());

  if (dec.decimalPart.length !== precisionAsked + 1)
    tryToAddWrongProp(
      propositions,
      dec
        .round(precisionAsked + 1)
        .toTree()
        .toTex(),
    );

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, DecimalConstructor.random(0, 1000, precision).toTree().toTex());
  }

  return shuffle(propositions);
};

export const roundToUnit: MathExercise<QCMProps, VEAProps> = {
  id: 'roundToUnit',
  connector: '\\approx',
  label: "Arrondir à l'unité",
  levels: ['6ème', '5ème', 'CAP', '2ndPro', '1rePro'],
  sections: ['Calculs'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 0 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
/**
 * arrondi à l'unité
 */
export const roundToDixieme: MathExercise<QCMProps, VEAProps> = {
  id: 'roundToDixieme',
  connector: '\\approx',
  label: 'Arrondir au dixième',
  levels: ['6ème', '5ème', 'CAP', '2ndPro', '1rePro'],
  sections: ['Calculs'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 1 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
/**
 * arrondi à l'unité
 */
export const roundToCentieme: MathExercise<QCMProps, VEAProps> = {
  id: 'roundToCentieme',
  connector: '\\approx',
  label: 'Arrondir au centième',
  levels: ['6ème', '5ème', 'CAP', '2ndPro', '1rePro'],
  sections: ['Calculs'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 2 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
/**
 * arrondi à l'unité
 */
export const roundToMillieme: MathExercise<QCMProps, VEAProps> = {
  id: 'roundToMillieme',
  connector: '\\approx',
  label: 'Arrondir au millième',
  levels: ['6ème', '5ème', 'CAP', '2ndPro', '1rePro'],
  sections: ['Calculs'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions({ precisionAsked: 3 }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};

export const allRoundings: MathExercise<QCMProps, VEAProps> = {
  id: 'allRoundings',
  connector: '\\approx',
  label: 'Arrondir un nombre décimal',
  levels: ['6ème', '5ème', 'CAP', '2ndPro', '1rePro'],
  sections: ['Calculs'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getRoundQuestions({ precisionAsked: randint(0, 4) }), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
