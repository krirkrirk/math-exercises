import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { v4 } from 'uuid';

export const absoluteValueInequations: MathExercise = {
  id: 'absoluteValueInequations',
  connector: '\\iff',
  instruction: '',
  label: 'Résoudre une inéquation avec valeur absolue',
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Valeur absolue', 'Inéquations', 'Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getAbsoluteValueInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getAbsoluteValueInequationsQuestion(): Question {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = randint(1, 10);
  //|x-b| <= a
  const b = -poly.coefficients[0];
  const isStrict = coinFlip();
  const answer = isStrict ? `S=]${b - a};${b + a}[` : `S=[${b - a};${b + a}]`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, `S=]${b - a};${b + a}[`);
    tryToAddWrongProp(res, `S=[${b - a};${b + a}]`);
    tryToAddWrongProp(res, `S=\\left\\{${b - a};${b + a}\\right\\}`);

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `S=[${randint(-9, 0)};${randint(0, 10)}]`;
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
    instruction: `Résoudre l'inéquation $|${poly.toTree().toTex()}|${isStrict ? '<' : '\\le'}${a}$.`,
    keys: ['S', 'equal', 'lbracket', 'semicolon', 'rbracket', 'emptyset'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
