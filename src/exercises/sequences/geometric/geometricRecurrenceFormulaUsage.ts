import { MathExercise, GeneratorOptions, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

interface GeometricRecurrenceFormulaUsageOptions extends GeneratorOptions {
  test: boolean;
}

export const geometricRecurrenceFormulaUsage: MathExercise = {
  id: 'geometricRecurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite géométrique",
  levels: ['1reESM', '1reSpé', '1reTech', '1rePro', 'TermTech', 'TermPro'],
  sections: ['Suites'],
  isSingleStep: false,
  keys: ['q', 'n', 'u', 'underscore'],

  qcmTimer: 60,
  freeTimer: 60,
  generator: (nb: number) => getDistinctQuestions(getGeometricRecurrenceFormulaUsage, nb),
};

export function getGeometricRecurrenceFormulaUsage(): Question {
  const firstRank = randint(1, 20);
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);
  const askedRank = firstRank + 1;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: (firstValue * reason).toString(),
      isRightAnswer: true,
      format: 'tex',
    });

    if (firstValue + reason !== 4)
      res.push({
        id: v4() + '',
        statement: (firstValue + reason).toString(),
        isRightAnswer: false,
        format: 'tex',
      });

    for (let i = 0; i < (firstValue + reason === 4 ? n - 1 : n - 2); i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: firstValue * (reason + randint(-reason + 1, 6, [0])) + '',
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
    instruction: `$(u_n)$ est une suite définie par $u_{n+1} = ${reason}\\times u_n$ et $u_{${firstRank}} = ${firstValue}$. Calculer : $u_{${askedRank}}$`,
    startStatement: `u_{${askedRank}}`,
    answer: (firstValue * reason).toString(),
    keys: ['q', 'n', 'u', 'underscore'],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
