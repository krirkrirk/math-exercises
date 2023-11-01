import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { IntegerConstructor } from '#root/math/numbers/integer/integer';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const proportionalityTable: MathExercise = {
  id: 'proportionalityTable',
  connector: '=',
  instruction: '',
  label: 'Calcul dans un tableau de proportionnalité',
  levels: ['5ème', '4ème', '3ème', 'CAP', '2ndPro', '1rePro'],
  isSingleStep: false,
  sections: ['Proportionnalité'],
  generator: (nb: number) => getDistinctQuestions(getProportionalityTable, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getProportionalityTable(): Question {
  const fact = randint(2, 10);
  let [x1, x2]: (string | number)[] = IntegerConstructor.randomDifferents(1, 100 / fact, 2);
  let [x3, x4]: (string | number)[] = [x1 * fact, x2 * fact];
  let answer = '';

  const randQuation = randint(0, 4);

  switch (randQuation) {
    case 0:
      answer = x1 + '';
      x1 = '?';
      break;
    case 1:
      answer = +x2 + '';
      x2 = '?';
      break;
    case 2:
      answer = x3 + '';
      x3 = '?';
      break;
    case 3:
      answer = x4 + '';
      x4 = '?';
      break;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '',
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: answer + randint(-answer + 1, 20, [0]) + '',
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
    instruction: `On considère le tableau de proportionnalité suivant : 

| | |
|-|-|
|${x1}|${x3}|
|${x2}|${x4}|

Déterminer le nombre manquant.`,
    answer: answer,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
