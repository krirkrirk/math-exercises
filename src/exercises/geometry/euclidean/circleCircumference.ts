import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';

export const circleCircumference: Exercise = {
  id: 'circleCircumference',
  connector: '=',
  instruction: '',
  label: "Calculer la circonférence d'un cercle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getCircleCircumference, nb),
};

export function getCircleCircumference(): Question {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();

  const question: Question = {
    instruction: `Calculer la circonférence d'un cercle de ${coin ? 'rayon ' + radius : 'diamètre ' + diametre} cm.`,
    answer: coin ? round(2 * Math.PI * radius, 2) + '' : round(Math.PI * diametre, 2) + '',
  };

  return question;
}
