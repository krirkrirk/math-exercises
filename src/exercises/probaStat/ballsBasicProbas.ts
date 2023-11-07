import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { random } from '#root/utils/random';
import { v4 } from 'uuid';

export const ballsBasicProbas: MathExercise = {
  id: 'ballsBasicProbas',
  connector: '=',
  instruction: '',
  label: 'Calcul de probabilité simple avec des boules colorés',
  levels: ['5ème', '4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getBallsBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getBallsBasicProbasQuestion(): Question {
  const colors = ['rouge', 'jaune', 'verte'];
  const repartitions = [randint(1, 4), randint(1, 4), randint(1, 4)];
  const total = repartitions.reduce((acc, curr) => (acc += curr), 0);
  const colorAskedIndex = randint(0, 3);
  const colorAsked = colors[colorAskedIndex];
  const nbColorAsked = repartitions[colorAskedIndex];
  const answer = new Rational(nbColorAsked, total).simplify().tex;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, nbColorAsked + '');
    tryToAddWrongProp(res, `\\frac{1}{3}`);
    if (total === 3) {
      tryToAddWrongProp(res, `3`);
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new Rational(randint(1, total), total).simplify().tex;
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
    answer,
    instruction: `Dans un sac, il y a ${repartitions[0]} boules ${colors[0]}${repartitions[0] > 1 ? 's' : ''}, 
    ${repartitions[1]} boules ${colors[1]}${repartitions[1] > 1 ? 's' : ''} et ${repartitions[2]} boules ${colors[2]}${
      repartitions[2] > 1 ? 's' : ''
    }. Quelle est la probabilité de tirer une boule ${colorAsked} ?`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
