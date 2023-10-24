import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const cubicEquation: Exercise = {
  id: 'cubicEquation',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation du type $x^3 = k$',
  levels: ['2nde', '1reESM', '1reSpé', '1reTech'],
  isSingleStep: true,
  sections: ['Fonctions de référence', 'Fonction cube', 'Équations'],
  generator: (nb: number) => getDistinctQuestions(getCubicEquationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getCubicEquationQuestion(): Question {
  const x = randint(-10, 11);
  const k = x ** 3;
  const answer = `S=\\{${x}\\}`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    if (x ** 3 !== k ** 3) {
      res.push({
        id: v4(),
        statement: `S=\\{${k ** 3}\\}`,
        isRightAnswer: true,
        format: 'tex',
      });
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-10, 11) + '';
        proposition = {
          id: v4() + ``,
          statement: `S=\\{${wrongAnswer}\\}`,
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
    instruction: `Résoudre l'équation suivante : $x^3 = ${k}$`,
    keys: ['S', 'equal', 'lbrace', 'semicolon', 'rbrace', 'emptyset'],

    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
