import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const trianglePerimeter: Exercise = {
  id: 'trianglePerimeter',
  connector: '=',
  instruction: '',
  label: "Calculer le périmètre d'un triangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrianglePerimeter, nb),
};

export function getTrianglePerimeter(): Question {
  const sides = [randint(1, 13), randint(1, 13), randint(1, 13)];

  const question: Question = {
    instruction: `Calculer le périmètre d'un triangle qui a pour côtés: $${sides[0]}$ cm, $${sides[1]}$ cm et $${sides[2]}$ cm.`,
    answer: sides[0] + sides[1] + sides[2] + '',
  };

  return question;
}
