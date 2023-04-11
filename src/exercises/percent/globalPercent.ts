import { randint } from '#root/math/utils/random/randint';
import { round } from 'mathjs';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const globalPercent: Exercise = {
  id: 'globalPercent',
  connector: '=',
  instruction: '',
  label: "Calculer un taux d'évolution global à partir de taux d'évolution successifs",
  levels: ['4', '3', '2'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGlobalPercentQuestion, nb),
};

export function getGlobalPercentQuestion(): Question {
  const tab = ['hausse', 'baisse'];
  let ans = 1;
  let instruction = "Le prix d'un article subit une ";
  const indice = randint(2, 4);

  for (let i = 0; i < indice; i++) {
    const randPercent = randint(1, 50);
    let a = randint(0, 2);
    instruction += `${tab[a]} de $${randPercent}\\%$`;

    if (i + 1 < indice) instruction += ', puis une ';

    if (a == 0) ans *= 1 + randPercent / 100;
    else ans *= 1 - randPercent / 100;
  }

  ans = round((ans - 1) * 100, 2);

  instruction += ". \nDéterminer le taux d'évolution global du prix de cet article.";
  const answer = `${ans} \\%`;

  const question: Question = {
    instruction,
    answer,
    keys: [],
  };

  return question;
}
