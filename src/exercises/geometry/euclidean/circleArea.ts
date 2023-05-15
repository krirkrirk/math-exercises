import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';

export const circleArea: Exercise = {
  id: 'circleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un cercle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getCircleArea, nb),
};

export function getCircleArea(): Question {
  const radius = randint(1, 13);
  const diametre = randint(1, 21);

  const coin = coinFlip();

  const question: Question = {
    instruction: `Calculer l'aire d'un cercle de ${coin ? 'rayon ' + radius : 'diamètre ' + diametre} cm.`,
    answer: coin ? round(Math.PI * radius ** 2, 2) + '' : round(Math.PI * (diametre / 2) ** 2, 2) + '',
  };

  return question;
}
