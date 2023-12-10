import { randint } from '#root/math/utils/random/randint';
import { round } from 'mathjs';
import { MathExercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';
import { shuffle } from '#root/utils/shuffle';

export const globalPercent: MathExercise<QCMProps, VEAProps> = {
  id: 'globalPercent',
  connector: '=',
  instruction: '',
  label: "Calculer un taux d'évolution global à partir de taux d'évolution successifs",
  levels: ['2nde', '1rePro', 'TermPro', '1reTech', 'TermTech'],
  sections: ['Pourcentages'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGlobalPercentQuestion, nb),
  keys: ['percent'],
  qcmTimer: 60,
  freeTimer: 60,
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
  const answer = `${(ans + '').replace('.', ',')}\\%`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
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
          statement: `${wrongAnswer} \\%`,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    answer,
    keys: ['percent'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
