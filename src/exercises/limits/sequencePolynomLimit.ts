import { MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const sequencePolynomLimit: MathExercise = {
  id: 'sequencePolynomLimit',
  connector: '=',
  instruction: '',
  label: "Limite d'une suite polynomiale",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequencePolynomLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSequencePolynomLimitQuestion(): Question {
  const poly = PolynomialConstructor.random(4, 'n');
  const to = '+\\infty';
  const answer = poly.getLimit(to);
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, '+\\infty');
    tryToAddWrongProp(res, '-\\infty');
    tryToAddWrongProp(res, '0');
    tryToAddWrongProp(res, poly.coefficients[poly.degree] + '');

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-10, 10) + '';
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
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${poly.toTree().toTex()}$.`,
    keys: ['infty'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
