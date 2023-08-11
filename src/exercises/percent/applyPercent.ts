import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const applyPercent: Exercise = {
  id: 'applyPercent',
  connector: '=',
  instruction: '',
  label: "Appliquer un pourcentage d'augmentation ou de diminution.",
  levels: ['4', '3', '2'],
  section: 'Pourcentages',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getApplyPercentQuestion, nb),
  keys: ['percent'],
};

export function getApplyPercentQuestion(): Question {
  const randNbr = randint(1, 500);
  const randPercent = randint(1, 100);
  let instruction = '';
  let ans = 0;

  if (coinFlip()) {
    ans = randNbr * (1 + randPercent / 100);
    ans = round(ans, 2);
    instruction = `Appliquer une hausse de $${randPercent}\\%$ à $${randNbr}$.`;
  } else {
    ans = randNbr * (1 - randPercent / 100);
    ans = round(ans, 2);
    instruction = `Appliquer une baisse de $${randPercent}\\%$ à $${randNbr}$.`;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: ans.toString(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        let wrongAnswer = ans;
        const deviation = Math.random() < 0.5 ? -1 : 1;
        const percentDeviation = Math.random() * 20 + 1;

        wrongAnswer += deviation * (percentDeviation / 100) * ans;
        wrongAnswer = round(wrongAnswer, 2);

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toString(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    answer: ans.toString(),
    keys: ['percent'],
    getPropositions,
  };

  return question;
}
