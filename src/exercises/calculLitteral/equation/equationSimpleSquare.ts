import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { diceFlip } from '#root/utils/diceFlip';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => el ** 2);
export const equationSimpleSquare: Exercise = {
  id: 'equationSimpleSquare',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du second degré du type $x^2 = a$',
  levels: ['2nde', '1reESM', '1reSpé', '1reTech'],
  sections: ['Équations'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationSimpleSquare, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

const higherFactor = (n: number): number => {
  for (let i = Math.floor(Math.sqrt(n)); i > 0; i--) if (n % i ** 2 === 0) return i;
  return 1;
};

export function getEquationSimpleSquare(): Question {
  let randNbr = randint(-20, 101);
  let answer: string;

  const rand = diceFlip(3);
  if (rand === 0) randNbr = randint(-20, 0);
  else if (rand === 1) randNbr = random(squares);
  else randNbr = randint(2, 100);

  const instruction = `Résoudre l'équation : $x^2 = ${randNbr}$`;
  const ans = Math.sqrt(randNbr);

  if (randNbr < 0) answer = `S=\\emptyset`;
  else if (ans === Math.floor(ans)) answer = `S=\\left\\{${ans}\\ ; -${ans}\\right\\}`;
  else {
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    answer = `S=\\left\\{${factor === 1 ? '' : factor}\\sqrt{${radicand}}\\ ; -${
      factor === 1 ? '' : factor
    }\\sqrt{${radicand}} \\right\\}`;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    if (ans === Math.floor(ans)) {
      res.push({
        id: v4() + '',
        statement: `S=\\left\\{${ans}\\right\\}`,
        isRightAnswer: false,
        format: 'tex',
      });

      for (let i = 0; i < n - 2; i++) {
        let isDuplicate: boolean;
        let proposition: Proposition;

        do {
          const tempAns = ans + randint(-ans + 1, 7, [0]);
          proposition = {
            id: v4() + '',
            statement: coinFlip() ? `S=\\left\\{${tempAns}\\ ; -${tempAns}\\right\\}` : `S=\\emptyset`,
            isRightAnswer: false,
            format: 'tex',
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
        format: 'tex',
      });

      if (n > 2)
        res.push({
          id: v4() + '',
          statement: `${radicand}\\sqrt{${factor}}`,
          isRightAnswer: false,
          format: 'tex',
        });

      if (n > 3)
        res.push({
          id: v4() + '',
          statement: `${Math.floor(ans)}`,
          isRightAnswer: false,
          format: 'tex',
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
            format: 'tex',
          };

          isDuplicate = res.some((p) => p.statement === proposition.statement);
        } while (isDuplicate);

        res.push(proposition);
      }
    } else {
      res.push({
        id: v4() + '',
        statement: `-\\sqrt{${-randNbr}}`,
        isRightAnswer: false,
        format: 'tex',
      });

      if (n > 2)
        res.push({
          id: v4() + '',
          statement: `${Math.floor(Math.sqrt(-randNbr))}`,
          isRightAnswer: false,
          format: 'tex',
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
            format: 'tex',
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
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
  };

  return question;
}
