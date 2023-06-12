import { randint } from '#root/math/utils/random/randint';
import { round } from 'mathjs';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';
import { shuffle } from '#root/utils/shuffle';

export const reciprocalPercentage: Exercise = {
  id: 'reciprocalPercentage',
  connector: '=',
  instruction: '',
  label: "Calculer un taux d'évolution réciproque",
  levels: ['4', '3', '2'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getReciprocalPercentageQuestion, nb),
  keys: ['percent'],
};

export function getReciprocalPercentageQuestion(): Question {
  const randPercent = randint(1, 50);
  const tab = ['hausse', 'baisse'];
  let ans = 0;
  let a = randint(0, 2);
  let instruction = `Le prix d'un article subit une ${tab[a]} de $${randPercent}\\%$. Quelle évolution devra-t-il subir pour revenir à son prix initial ?`;

  ans = a == 0 ? (1 / (1 + randPercent / 100) - 1) * 100 : (1 / (1 - randPercent / 100) - 1) * 100;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: `${ans > 0 ? '+' + round(ans, 2) : round(ans, 2)} \\%`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        let wrongAnswer = ans;
        const deviation = Math.random() < 0.5 ? -1 : 1;
        const percentDeviation = Math.random() * 20 + 1;

        wrongAnswer += deviation * percentDeviation;
        wrongAnswer = round(wrongAnswer, 2);

        proposition = {
          id: v4() + '',
          statement: `${wrongAnswer > 0 ? '+' + wrongAnswer : wrongAnswer} \\%`,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    answer: `${ans > 0 ? '+' + round(ans, 2) : round(ans, 2)} \\%`,
    keys: ['percent'],
    getPropositions,
  };

  return question;
}
