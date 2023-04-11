import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { sqrt } from 'mathjs';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const averageEvolutionRate: Exercise = {
  id: 'averageEvolutionRate',
  connector: '=',
  instruction: '',
  label: "Calculer un taux d'évolution moyen",
  levels: ['4', '3', '2'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAverageEvolutionRate, nb),
};

export function getAverageEvolutionRate(): Question {
  const rate = randint(1, 100);
  const nbMois = randint(2, 13);

  const instruction = `un prix augmente de $${rate}\\%$ en $${nbMois}$ mois. Quel est le taux d'évolution moyen par mois ?`;
  const answer = `${round((Math.pow(1 + rate / 100, 1 / nbMois) - 1) * 100, 2)}\\%`;

  const question: Question = {
    instruction,
    answer,
    keys: ['percent'],
  };

  return question;
}
