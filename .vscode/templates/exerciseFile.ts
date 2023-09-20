import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const {{name}}: Exercise = {
  id: '{{name}}',
  connector: '',
  instruction: '',
  label: '',
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(get{{namePascal}}Question, nb),
};

export function get{{namePascal}}Question(): Question {
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: '',
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
          id: v4() + '',
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
    answer: '',
    instruction: "",
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
