import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const rectangleArea: Exercise = {
  id: 'rectangleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un rectangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getRectangleArea, nb),
};

export function getRectangleArea(): Question {
  const length = randint(3, 13);
  const width = randint(1, length);

  const question: Question = {
    instruction: `Calculer l'aire d'un rectangle de $${length}$ cm de longueur et de $${width}$ cm de largeur.`,
    answer: length * width + '',
  };

  return question;
}
