import {
  MathExercise,
  Question,
  Proposition,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getCircleCircumference: QuestionGenerator<QCMProps, VEAProps> = () => {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();
  const answerNb = coin ? round(2 * Math.PI * radius, 2) : round(Math.PI * diametre, 2);
  const answer = (answerNb + '').replace('.', ',');
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer la circonférence d'un cercle de ${coin ? 'rayon ' + radius : 'diamètre ' + diametre} cm.`,
    answer: answer,
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
    tryToAddWrongProp(propositions, round(Math.random() * 100, 2) + '');
  }

  return shuffle(propositions);
};

export const circleCircumference: MathExercise<QCMProps, VEAProps> = {
  id: 'circleCircumference',
  connector: '=',
  label: "Calculer la circonférence d'un cercle",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getCircleCircumference, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
