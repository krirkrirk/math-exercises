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
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  randomSide: number;
};
type VEAProps = {};

const sides = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
  [28, 45, 53],
  [11, 60, 61],
  [16, 63, 65],
  [33, 56, 65],
  [48, 55, 73],
  [13, 84, 85],
  [36, 77, 85],
  [39, 80, 89],
  [65, 72, 97],
];

const getTriangleAreaV2: QuestionGenerator<QCMProps, VEAProps> = () => {
  const randomSide = randint(0, sides.length);
  const area = (sides[randomSide][0] * sides[randomSide][1]) / 2;
  const answer = area + '';
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire du triangle rectangle qui a pour côtés: $${sides[randomSide][0]}$ cm, $${sides[randomSide][1]}$ cm et $${sides[randomSide][2]}$ cm.`,
    answer,
    answerFormat: 'tex',
    keys: [],
    qcmGeneratorProps: { answer, randomSide },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, randomSide }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const area = Number(answer);
  tryToAddWrongProp(propositions, sides[randomSide][0] + sides[randomSide][1] + sides[randomSide][2] + '');
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, area + randint(-area + 1, 14, [0]) + '');
  }

  return shuffle(propositions);
};

export const triangleAreaV2: MathExercise<QCMProps, VEAProps> = {
  id: 'triangleAreaV2',
  connector: '=',
  label: "Calculer l'aire d'un triangle (sans figure)",
  levels: ['5ème', '4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getTriangleAreaV2, nb, 16),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 16,
  getPropositions,
};
