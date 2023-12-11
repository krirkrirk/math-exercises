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
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  leadingCoeffsRational: string;
};
type VEAProps = {};

const getSequencePolynomProductLimitQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const polyNum = PolynomialConstructor.randomWithLength(3, 2, 'n');
  const polyDenum = PolynomialConstructor.randomWithLength(3, 2, 'n');
  const numLeadingCoeff = polyNum.coefficients[polyNum.degree];
  const denumLeadingCoeff = polyDenum.coefficients[polyDenum.degree];

  const product = new Monom(polyNum.degree + polyDenum.degree, numLeadingCoeff * denumLeadingCoeff, 'n');
  const to = '+\\infty';
  let answer = product.getLimit(to);
  let leadingCoeffsRational = new Rational(numLeadingCoeff, denumLeadingCoeff).simplify().toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = (${polyNum.toTree().toTex()})(${polyDenum
      .toTree()
      .toTex()})$.`,
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

export const sequencePolynomProductLimit: MathExercise<QCMProps, VEAProps> = {
  id: 'sequencePolynomProductLimit',
  connector: '=',
  label: "Limite d'un produit de suites polynomiales",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequencePolynomProductLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
