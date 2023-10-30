import { MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Affine } from '#root/math/polynomials/affine';
import { Monom } from '#root/math/polynomials/monom';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { Interval } from '#root/math/sets/intervals/intervals';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const rationalFracForbiddenValueLimit: MathExercise = {
  id: 'rationalFracForbiddenValueLimit',
  connector: '=',
  instruction: '',
  label: "Limite d'une fraction rationnelle avec valeur interdite",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSequenceRationalFracLimitQuestion(): Question {
  const polyDenum = new Affine(1, randint(-9, 10, [0]));

  const forbiddenValue = -polyDenum.b;
  const interval = new Interval('[[-10;10]]').difference(new DiscreteSet([new Integer(forbiddenValue)]));

  const polyNum = TrinomConstructor.randomFactorized(new Interval('[[-10;10]]'), interval, interval);

  const numLimit = polyNum.calculate(-polyDenum.b);
  const getSign = (nb: number) => {
    return nb >= 0 ? '+' : '-';
  };
  const isRight = coinFlip();
  const to = isRight ? `${forbiddenValue}` : `${forbiddenValue}`;
  const from = isRight ? `x > ${forbiddenValue}` : `x<${forbiddenValue}`;
  const answer = isRight ? `${getSign(numLimit)}\\infty` : `${getSign(-numLimit)}\\infty`;

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
    tryToAddWrongProp(res, polyNum.coefficients[polyNum.degree].toString());

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
    answer,
    instruction: `Soit $f$ la fonction définie par : $f(x) = \\dfrac{${polyNum.toTree().toTex()}}{${polyDenum
      .toTree()
      .toTex()}}$. Déterminer $\\lim\\limits_{x \\to ${to}, ${from}}f(x).$
      `,
    keys: ['infty'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
