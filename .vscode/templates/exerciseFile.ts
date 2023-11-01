import { shuffleProps, MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const {{name}}: MathExercise = {
  id: '{{name}}',
  connector: "",
  instruction: "",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(get{{namePascal}}Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function get{{namePascal}}Question(): Question {
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

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer: ``,
    instruction: ``,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
