import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Vector, VectorConstructor } from '#root/math/geometry/vector';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const determinant: MathExercise<QCMProps, VEAProps> = {
  id: 'determinant',
  connector: '=',
  instruction: '',
  label: 'Calculer le déterminant de deux vecteurs',
  levels: ['2nde', '1reESM', '1reSpé'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getDeterminantQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDeterminantQuestion(): Question {
  const u = VectorConstructor.random('u');
  const v = VectorConstructor.random('v');
  const answer = u.determinant(v);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });
    const ps = u.scalarProduct(v);
    if (ps.toTex() !== answer.toTex()) {
      res.push({
        id: v4(),
        statement: ps.toTex(),
        isRightAnswer: false,
        format: 'tex',
      });
    }

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-20, 20) + '';
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
    answer: answer.toTex(),
    instruction: `Soient les vecteurs $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer le déterminant $\\det(\\overrightarrow u;\\overrightarrow v)$.`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
