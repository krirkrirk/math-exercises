import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const equationSimpleSquare: Exercise = {
  id: 'equationSimpleSquare',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du second degré du type x² = a',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationSimpleSquare, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

const higherFactor = (n: number): number => {
  for (let i = Math.floor(Math.sqrt(n)); i > 0; i--) if (n % i ** 2 === 0) return i;
  return 1;
};

export function getEquationSimpleSquare(): Question {
  let randNbr = randint(-20, 100);
  let answer: string;

  if (randNbr >= 0) while (higherFactor(randNbr) === 1) randNbr = randint(1, 100);

  const instruction = `Résoudre l'équation suivante : $x^2 = ${randNbr}$`;
  const ans = Math.sqrt(randNbr);

  if (ans === Math.floor(ans)) answer = `\\{${ans}\\ ; -${ans}\\}`;
  else {
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    answer = `\\{${factor}\\sqrt{${radicand}}\\ ; -${factor}\\sqrt{${radicand}} \\}`;
  }

  if (randNbr < 0) answer = `\\emptyset`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    if (ans === Math.floor(ans)) {
      res.push({
        id: v4() + '',
        statement: `${ans}`,
        isRightAnswer: false,
      });

      if (n > 2)
        res.push({
          id: v4() + '',
          statement: `${ans + randint(-ans + 1, 7, [0])}`,
          isRightAnswer: false,
        });

      for (let i = 0; i < n - 3; i++) {
        let isDuplicate: boolean;
        let proposition: Proposition;

        do {
          const tempAns = ans + randint(-ans + 1, 7, [0]);
          proposition = {
            id: v4() + '',
            statement: coinFlip() ? `\\{${tempAns}\\ ; -${tempAns}\\}` : `\\emptyset`,
            isRightAnswer: false,
          };

          isDuplicate = res.some((p) => p.statement === proposition.statement);
        } while (isDuplicate);

        res.push(proposition);
      }
    } else if (randNbr >= 0 && ans !== Math.floor(ans)) {
      const factor = higherFactor(randNbr);
      const radicand = randNbr / factor ** 2;

      res.push({
        id: v4() + '',
        statement: `${factor}\\sqrt{${radicand}}`,
        isRightAnswer: false,
      });

      if (n > 2)
        res.push({
          id: v4() + '',
          statement: `${radicand}\\sqrt{${factor}}`,
          isRightAnswer: false,
        });

      if (n > 3)
        res.push({
          id: v4() + '',
          statement: `${Math.floor(ans)}`,
          isRightAnswer: false,
        });

      for (let i = 0; i < n - 4; i++) {
        let isDuplicate: boolean;
        let proposition: Proposition;

        do {
          const tempFactor = factor + randint(-factor + 1, 7, [0]);
          const tempRadicand = radicand + randint(-radicand + 1, 7, [0]);
          proposition = {
            id: v4() + '',
            statement: coinFlip()
              ? `\\{${tempFactor}\\sqrt{${tempRadicand}}\\ ; -${tempFactor}\\sqrt{${tempRadicand}} \\}`
              : `\\emptyset`,
            isRightAnswer: false,
          };

          isDuplicate = res.some((p) => p.statement === proposition.statement);
        } while (isDuplicate);

        res.push(proposition);
      }
    } else {
      res.push({
        id: v4() + '',
        statement: `-\\sqrt${-randNbr}`,
        isRightAnswer: false,
      });

      if (n > 2)
        res.push({
          id: v4() + '',
          statement: `${Math.floor(Math.sqrt(-randNbr))}`,
          isRightAnswer: false,
        });

      for (let i = 0; i < n - 3; i++) {
        let isDuplicate: boolean;
        let proposition: Proposition;

        do {
          const factor = randint(2, 5);
          const radicand = randint(2, -randNbr);
          proposition = {
            id: v4() + '',
            statement: `\\{${factor}\\sqrt{${radicand}}\\ ; -${factor}\\sqrt{${radicand}} \\}`,
            isRightAnswer: false,
          };

          isDuplicate = res.some((p) => p.statement === proposition.statement);
        } while (isDuplicate);

        res.push(proposition);
      }
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };

  return question;
}
