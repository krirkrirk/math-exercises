import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const geometricFirstTermsSum: Exercise = {
  id: 'geometricFirstTermsSum',
  connector: '=',
  instruction: '',
  label: "Somme des termes d'une suite géométrique",
  levels: ['1reESM', '1rePro', '1reSpé', '1reTech', 'TermPro', 'TermSpé', 'TermTech'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getGeometricFirstTermsSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getGeometricFirstTermsSumQuestion(): Question {
  const raison = randint(2, 10);
  const final = randint(6, 15);
  const answer = (raison ** (final + 1) - 1) / (raison - 1);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer.toString(),
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: (raison ** (final + 1) - 1).toString(),
      isRightAnswer: false,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: ((raison ** final - 1) / (raison - 1)).toString(),
      isRightAnswer: false,
      format: 'tex',
    });
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;
      do {
        const wrongAnswer = randint(1000, 10000) + '';

        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
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
    answer: answer + '',
    instruction: `Calculer la somme suivante : $1 + ${raison} + ${raison}^2 + \\ldots + ${raison}^{${final}}$`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
