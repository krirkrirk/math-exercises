import { MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Monom } from '#root/math/polynomials/monom';
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const sequenceRationalFracLimit: MathExercise<QCMProps, VEAProps> = {
  id: 'sequenceRationalFracLimit',
  connector: '=',
  instruction: '',
  label: "Limite d'une suite rationnelle",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSequenceRationalFracLimitQuestion(): Question {
  const polyNum = PolynomialConstructor.random(4, 'n');
  const polyDenum = PolynomialConstructor.random(4, 'n');
  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const to = '+\\infty';
  let answer: string;
  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff).simplify().toTree().toTex();
  if (polyDenum.degree === polyNum.degree) {
    answer = leadingCoeffsRational;
  } else if (polyDenum.degree > polyNum.degree) {
    answer = '0';
  } else {
    const tempPoly = new Monom(
      polyNum.degree - polyDenum.degree,
      numLeadingCoeff * denumLeadingCoeff > 0 ? 1 : -1,
      'n',
    );
    answer = tempPoly.getLimit(to);
  }

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
    tryToAddWrongProp(res, leadingCoeffsRational);

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
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = \\dfrac{${polyNum
      .toTree()
      .toTex()}}{${polyDenum.toTree().toTex()}}$.`,
    keys: ['infty'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
