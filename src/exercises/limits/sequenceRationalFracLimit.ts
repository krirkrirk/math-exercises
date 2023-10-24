import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Monom } from '#root/math/polynomials/monom';
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const sequenceRationalFracLimit: Exercise = {
  id: 'sequenceRationalFracLimit',
  connector: '=',
  instruction: '',
  label: "Limite d'une suite rationnelle",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSequenceRationalFracLimitQuestion(): Question {
  const polyNum = PolynomialConstructor.random(4, 'n');
  const polyDenum = PolynomialConstructor.random(4, 'n');
  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const isPositiveInfinite = coinFlip();
  const to = isPositiveInfinite ? '+\\infty' : '-\\infty';
  let answer: string;
  if (polyDenum.degree === polyNum.degree) {
    answer = new Rational(numLeadingCoeff, denumLeadingCoeff).simplify().toTree().toTex();
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
  // sinon créer un polynome de coeff = leading coeff et degré = division des degrés

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = '';
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
    instruction: `Soit $u$ la suite définie par $u_n = \\dfrac{${polyNum.toTree().toTex()}}{${polyDenum
      .toTree()
      .toTex()}}$. Déterminer $$\\lim_{n\\to ${to}}u_n$$.`,
    keys: ['infty'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
