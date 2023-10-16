import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const firstIntegersSum: Exercise = {
  id: 'firstIntegersSum',
  connector: '=',
  instruction: '',
  label: 'Somme des $n$ premiers entiers',
  levels: ['1rePro', '1reTech', '1reSpé', '1reESM'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getFirstIntegersSumQuestion, nb),
};

export function getFirstIntegersSumQuestion(): Question {
  const final = randint(20, 100);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: `${(final * (final + 1)) / 2}`,
      isRightAnswer: true,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: `${(final * (final - 1)) / 2}`,
      isRightAnswer: false,
      format: 'tex',
    });
    res.push({
      id: v4(),
      statement: `${final * (final + 1)}`,
      isRightAnswer: false,
      format: 'tex',
    });
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;
      do {
        const wrongAnswer = randint(30, 200) + '';

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
    answer: `${(final * (final + 1)) / 2}`,
    instruction: `Calculer la somme suivante : $1+2+3+\\ldots + ${final}$`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
