import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const averageEvolutionRate: Exercise = {
  id: 'averageEvolutionRate',
  connector: '=',
  instruction: '',
  label: "Calculer un taux d'évolution moyen",
  levels: ['4', '3', '2'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getAverageEvolutionRate, nb),
  keys: ['percent'],
};

export function getAverageEvolutionRate(): Question {
  const rate = randint(1, 100);
  const nbMois = randint(2, 13);

  const instruction = `Un prix augmente de $${rate}\\%$ en $${nbMois}$ mois. Quel est le taux d'évolution mensuel moyen ?`;
  const answer = round((Math.pow(1 + rate / 100, 1 / nbMois) - 1) * 100, 2);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: `${answer}\\%`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        let wrongAnswer = answer;
        const deviation = Math.random() < 0.5 ? -1 : 1;
        const percentDeviation = Math.random() * 10 + 1;

        wrongAnswer += deviation * percentDeviation;
        wrongAnswer = round(wrongAnswer, 2);

        proposition = {
          id: v4() + '',
          statement: `${wrongAnswer}\\%`,
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
    answer: answer + `\\%`,
    keys: ['percent'],
    getPropositions,
  };

  return question;
}
