import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const applyPercent: MathExercise<QCMProps, VEAProps> = {
  id: 'applyPercent',
  connector: '=',
  instruction: '',
  label: "Appliquer un pourcentage d'augmentation ou de diminution.",
  levels: ['4ème', '3ème', '2nde', 'CAP', '2ndPro', '1rePro', 'TermPro', '1reTech', 'TermTech'],
  sections: ['Pourcentages'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getApplyPercentQuestion, nb),
  keys: ['percent'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getApplyPercentQuestion(): Question {
  const randNbr = randint(1, 500);
  const randPercent = randint(1, 100);
  let instruction = '';
  let ans = '';
  let ansNb = 0;
  if (coinFlip()) {
    ansNb = round(randNbr * (1 + randPercent / 100), 2);
    ans = (ansNb + '').replace('.', ',');
    instruction = `Appliquer une hausse de $${randPercent}\\%$ à $${randNbr}$.`;
  } else {
    ansNb = round(randNbr * (1 - randPercent / 100), 2);
    ans = (ansNb + '').replace('.', ',');
    instruction = `Appliquer une baisse de $${randPercent}\\%$ à $${randNbr}$.`;
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: ans.toString(),
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        let wrongAnswer = ansNb;
        const deviation = Math.random() < 0.5 ? -1 : 1;
        const percentDeviation = Math.random() * 20 + 1;

        wrongAnswer += deviation * (percentDeviation / 100) * ansNb;
        wrongAnswer = round(wrongAnswer, 2);

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toString(),
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
    instruction,
    answer: ans.toString(),
    keys: ['percent'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
