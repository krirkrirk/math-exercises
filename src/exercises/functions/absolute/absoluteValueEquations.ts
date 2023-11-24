import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { probaFlip } from '#root/utils/probaFlip';
import { probaLawFlip } from '#root/utils/probaLawFlip';
import { v4 } from 'uuid';

export const absoluteValueEquations: MathExercise = {
  id: 'absoluteValueEquation',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une équation avec valeur absolue',
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Valeur absolue', 'Équations'],
  generator: (nb: number) => getDistinctQuestions(getAbsoluteValueEquationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getAbsoluteValueEquationsQuestion(): Question {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = probaFlip(0.9) ? randint(1, 10) : coinFlip() ? 0 : randint(-9, 0);
  //|x-b| = a
  const b = -poly.coefficients[0];
  const answer =
    a === 0 ? `S=\\left\\{${b}\\right\\}` : a < 0 ? `S=\\emptyset` : `S=\\left\\{${b - a};${b + a}\\right\\}`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    if (a < 0) {
      tryToAddWrongProp(res, `S=\\left\\{${b - a};${b + a}\\right\\}`);
      tryToAddWrongProp(res, `S=\\left\\{${b + a}\\right\\}`);
    } else if (a === 0) {
      tryToAddWrongProp(res, `S=\\emptyset`);
    } else if (a > 0) {
      tryToAddWrongProp(res, `S=\\left\\{${b + a}\\right\\}`);
      tryToAddWrongProp(res, `S=\\left\\{${-b - a};${-b + a}\\right\\}`);
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `S=\\left\\{${randint(-9, 0)};${randint(0, 10)}\\right\\}`;
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
    answer: answer,
    instruction: `Résoudre l'équation $|${poly.toTree().toTex()}| = ${a}$.`,
    keys: ['S', 'equal', 'emptyset', 'lbrace', 'semicolon', 'rbrace'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
