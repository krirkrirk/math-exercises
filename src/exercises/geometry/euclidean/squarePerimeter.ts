import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const squarePerimeter: Exercise = {
  id: 'squarePerimeter',
  connector: '=',
  instruction: '',
  label: "Calculer le périmètre d'un carré",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getSquarePerimeter, nb),
};

export function getSquarePerimeter(): Question {
  const side = randint(1, 13);

  const question: Question = {
    instruction: `Calculer le périmètre d'un carré de $${side}$ cm de côté.`,
    answer: side * 4 + '',
  };

  return question;
}
