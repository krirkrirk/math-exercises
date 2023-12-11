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
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  side: number;
};
type VEAProps = {};

const getSquarePerimeter: QuestionGenerator<QCMProps, VEAProps> = () => {
  const side = randint(1, 21);
  const answer = side * 4 + '';
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer le périmètre d'un carré de $${side}$ cm de côté.`,
    answer,
    answerFormat: 'tex',
    keys: [],
    qcmGeneratorProps: { answer, side },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, side }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, side * 4 + randint(-side * 4 + 1, 14, [0]) + '');
  }

  return shuffle(propositions);
};

export const squarePerimeter: MathExercise<QCMProps, VEAProps> = {
  id: 'squarePerimeter',
  connector: '=',
  label: "Calculer le périmètre d'un carré",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getSquarePerimeter, nb, 20),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 20,
  getPropositions,
};
