import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const squareArea: Exercise = {
  id: 'squareArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un carré",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getSquareArea, nb),
};

export function getSquareArea(): Question {
  const side = randint(1, 13);

  const question: Question = {
    instruction: `Calculer l'aire d'un carré de $${side}$ cm de côté.`,
    answer: side ** 2 + '',
  };

  return question;
}
