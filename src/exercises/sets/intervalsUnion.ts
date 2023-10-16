import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const intervalsUnion: Exercise = {
  id: 'intervalsUnion',
  connector: '=',
  instruction: '',
  label: "Déterminer l'union de deux intervalles",
  levels: ['2nde', '2ndPro', '1reTech', 'CAP'],
  isSingleStep: true,
  sections: ['Intervalles'],
  generator: (nb: number) => getDistinctQuestions(getIntervalsUnionQuestion, nb),
};

export function getIntervalsUnionQuestion(): Question {
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: ``,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = '';
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
    answer: ``,
    instruction: ``,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
