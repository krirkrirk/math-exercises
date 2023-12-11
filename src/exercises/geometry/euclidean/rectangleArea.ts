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
};
type VEAProps = {};

const getRectangleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
  const length = randint(3, 13);
  const width = randint(1, length);
  const answer = length * width + '';
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer,
    answerFormat: 'tex',
    keys: [],
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(3, 13) * randint(3, 13) + '');
  }

  return shuffle(propositions);
};

export const rectangleArea: MathExercise<QCMProps, VEAProps> = {
  id: 'rectangleArea',
  connector: '=',
  label: "Calculer l'aire d'un rectangle",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getRectangleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
