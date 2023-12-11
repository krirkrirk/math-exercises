import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Monom } from '#root/math/polynomials/monom';
import { Polynomial, PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  leadingCoeffsRational: string;
};
type VEAProps = {};
const getSequenceRationalFracLimitQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const polyNum = PolynomialConstructor.randomWithLength(4, randint(2, 5));
  const polyDenum = PolynomialConstructor.randomWithLength(4, randint(2, 5));

  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const to = coinFlip() ? '+\\infty' : '-\\infty';
  let answer: string;
  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff).simplify().toTree().toTex();
  if (polyDenum.degree === polyNum.degree) {
    answer = leadingCoeffsRational;
  } else if (polyDenum.degree > polyNum.degree) {
    answer = '0';
  } else {
    const tempPoly = new Monom(polyNum.degree - polyDenum.degree, numLeadingCoeff * denumLeadingCoeff > 0 ? 1 : -1);
    answer = tempPoly.getLimit(to);
  }

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Déterminer la limite en $${to}$ de la fonction $f$ définie par : $f(x) = \\dfrac{${polyNum
      .toTree()
      .toTex()}}{${polyDenum.toTree().toTex()}}$.`,
    keys: ['infty'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, leadingCoeffsRational },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, leadingCoeffsRational }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, '+\\infty');
  tryToAddWrongProp(propositions, '-\\infty');
  tryToAddWrongProp(propositions, '0');
  tryToAddWrongProp(propositions, leadingCoeffsRational);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + '');
  }

  return shuffle(propositions);
};

export const rationalFracLimit: MathExercise<QCMProps, VEAProps> = {
  id: 'rationalFracLimit',
  connector: '=',
  label: "Limite d'une fraction rationnelle",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
