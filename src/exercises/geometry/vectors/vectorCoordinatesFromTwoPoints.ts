import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PointConstructor } from '#root/math/geometry/point';
import { VectorConstructor } from '#root/math/geometry/vector';
import { randint } from '#root/math/utils/random/randint';
import { randomLetter } from '#root/utils/randomLetter';
import { v4 } from 'uuid';

export const vectorCoordinatesFromTwoPoints: MathExercise<QCMProps, VEAProps> = {
  id: 'vectorCoordinatesFromTwoPoints',
  connector: '=',
  instruction: '',
  label: "Déterminer les coordonnées d'un vecteur à partir de deux points",
  levels: ['2nde'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getVectorCoordinatesFromTwoPointsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getVectorCoordinatesFromTwoPointsQuestion(): Question {
  const A = [randint(-9, 9), randint(-9, 9)];
  const B = [randint(-9, 9), randint(-9, 9)];
  const startLetter = randomLetter(true);
  let endLetter = '';
  do {
    endLetter = randomLetter(true);
  } while (endLetter === startLetter);

  const answer = `\\left(${B[0] - A[0]};${B[1] - A[1]}\\right)`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, `\\left(${A[0] - B[0]};${A[1] - B[1]}\\right)`);
    tryToAddWrongProp(res, `\\left(${A[1] - A[0]};${B[1] - B[0]}\\right)`);
    tryToAddWrongProp(res, `\\left(${B[1] - B[0]};${A[1] - A[0]}\\right)`);

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `\\left(${randint(-10, 10)};${randint(-10, 10)}\\right)`;
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
    instruction: `Soit $${startLetter}\\left(${A[0]};${A[1]}\\right)$ et $${endLetter}\\left(${B[0]};${B[1]}\\right)$. Quelles sont les coordonnées du vecteur $\\overrightarrow{${startLetter}${endLetter}}$ ?`,
    keys: ['semicolon'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
