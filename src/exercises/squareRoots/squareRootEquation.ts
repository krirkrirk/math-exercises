import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const squareRootEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'squareRootEquation',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation du type $\\sqrt x = k$',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Racines carrées', 'Équations', 'Fonctions de référence'],
  generator: (nb: number) => getDistinctQuestions(getSquareRootEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSquareRootEquationQuestion(): Question {
  const k = Math.random() < 0.2 ? randint(-20, 0) : randint(0, 11);
  const answer = k < 0 ? 'S=\\emptyset' : `S=\\left\\{${k ** 2}\\right\\}`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    if (k >= 0)
      res.push({
        id: v4(),
        statement: 'S=\\emptyset',
        isRightAnswer: false,
        format: 'tex',
      });
    if (Math.sqrt(k) !== k ** 2)
      res.push({
        id: v4(),
        statement: `S=\\{\\sqrt{${k}}\\}`,
        isRightAnswer: false,
        format: 'tex',
      });
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `S=\\{${randint(1, 100)}\\}`;
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
    answer: answer,
    instruction: `Résoudre l'équation suivante : $\\sqrt x = ${k}$`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
