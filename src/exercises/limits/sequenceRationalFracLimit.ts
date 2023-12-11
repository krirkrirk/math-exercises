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

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = \\dfrac{${polyNum
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

export const sequenceRationalFracLimit: MathExercise<QCMProps, VEAProps> = {
  id: 'sequenceRationalFracLimit',
  connector: '=',
  label: "Limite d'une suite rationnelle",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceRationalFracLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
