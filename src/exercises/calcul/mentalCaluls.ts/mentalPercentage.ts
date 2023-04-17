import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';

export const mentalPercentage: Exercise = {
  id: 'mentalPercentage',
  connector: '=',
  instruction: '',
  label: 'Effectuer mentalement des calculs de pourcentages simples',
  levels: ['5', '4', '3', '2', '1', '0'],
  section: 'Pourcentages',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getMentalPercentage, nb),
  keys: [],
};

export function getMentalPercentage(): Question {
  let a = 1,
    b = 1;

  const rand = randint(1, 10);

  switch (rand) {
    case 1: // 10% de 70%
      a = 10 * randint(1, 3);
      b = randint(1, 200);
      break;

    case 2: // 30% de 9
      a = randint(1, 10);
      b = randint(1, 10) * a;
      a *= 10;
      break;

    case 3: // 32% de 10
      a = randint(1, 100);
      b = 10 ** randint(1, 3);
      break;

    case 4: // 14% de 50 ou 230% de 20
      a = coinFlip() ? randint(1, 100) : randint(11, 30) * 10;
      b = coinFlip() ? 20 : 50;
      break;

    case 5: // 12.5% de 72
      a = coinFlip() ? 12.5 : 12.5 + 100;
      b = 8 * randint(1, 25);
      break;

    case 6: // 15% de 90
      a = coinFlip() ? 15 * randint(1, 6) : 30 * randint(1, 4, [2]) + 100;
      b = 3 * randint(1, 10) * 10;
      break;

    case 7: // 20% de x
      a = 20 * randint(1, 12, [5]);
      b = 5 * randint(1, 21);
      break;

    case 8: // 75% de x
      a = 25 * randint(1, 8, [4]);
      b = 4 * randint(1, 75);
      break;

    case 9: //0.5 % de 1000
      a = randint(1, 10) / 10;
      b = 1000;
      break;
  }

  const question: Question = {
    instruction: `Calculer $${a}\\%$ de $${b}$`,
    answer: (a * b) / 100 + '',
    keys: [],
  };

  return question;
}
