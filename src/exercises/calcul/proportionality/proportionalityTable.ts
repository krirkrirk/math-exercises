import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const proportionalityTable: Exercise = {
  id: 'proportionalityTable',
  connector: '=',
  instruction: '',
  label: 'Calculs de fréquences marginales et conditionnelles',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Probabilités',
  generator: (nb: number) => getDistinctQuestions(getProportionalityTable, nb),
  keys: ['f', 'cap', 'underscore'],
};

export function getProportionalityTable(): Question {
  const fact = randint(2, 10);
  let [x1, x2]: any = [1, 2].map((el) => randint(1, 100 / fact));
  let [x3, x4]: any = [x1 * fact, x2 * fact];
  let answer: any;

  const randQuation = randint(0, 4);

  switch (randQuation) {
    case 0:
      answer = x1;
      x1 = '?';
      break;
    case 1:
      answer = x2;
      x2 = '?';
      break;
    case 2:
      answer = x3;
      x3 = '?';
      break;
    case 3:
      answer = x4;
      x4 = '?';
      break;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: answer + randint(-answer + 1, 20, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }
    return shuffle(res);
  };

  const question: Question = {
    instruction: `On considère le tableau de proportionnalité suivant : 

| |A|B|
|-|-|-|
|C|${x1}|${x3}|
|D|${x2}|${x4}|`,
    answer: answer + '',
    keys: ['f', 'cap', 'underscore'],
    getPropositions,
  };

  return question;
}
