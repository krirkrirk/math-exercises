import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const geometricReasonUsage: MathExercise = {
  id: 'geometricReasonUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la raison d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getGeometricReasonUsage, nb),
  keys: ['q', 'n', 'u', 'underscore'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getGeometricReasonUsage(): Question {
  const reason = randint(2, 10);
  const startRank = randint(0, 20);
  const askedRank = startRank + 1;
  const startValue = randint(1, 10);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (startValue * reason).toString(),
      isRightAnswer: true,
      format: 'tex',
    });

    if (startValue + reason !== 4)
      res.push({
        id: v4() + '',
        statement: (startValue + reason).toString(),
        isRightAnswer: false,
        format: 'tex',
      });

    for (let i = 0; i < (startValue + reason === 4 ? n - 1 : n - 2); i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: startValue * (reason + randint(-reason + 1, 6, [0])) + '',
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
    instruction: `$(u_n)$ est une suite géométrique de raison $q = ${reason}$ et on sait que $u_{${startRank}} = ${startValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer: (startValue * reason).toString(),
    keys: ['q', 'n', 'u', 'underscore'],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
