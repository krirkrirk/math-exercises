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
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  coeffs: number[];
};
type VEAProps = {};

const getSequencePolynomNoFILimitQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const length = randint(2, 5);
  const poly = PolynomialConstructor.randomWithLengthAndSameSigns(4, length, 'n');
  const to = '+\\infty';
  const answer = poly.getLimit(to);

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${poly.toTree().toTex()}$.`,
    keys: ['infty'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, coeffs: poly.coefficients },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, coeffs }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, '+\\infty');
  tryToAddWrongProp(propositions, '-\\infty');
  tryToAddWrongProp(propositions, '0');
  tryToAddWrongProp(propositions, coeffs[coeffs.length - 1] + '');

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + '');
  }

  return shuffle(propositions);
};

export const sequencePolynomNoFILimit: MathExercise<QCMProps, VEAProps> = {
  id: 'sequencePolynomNoFILimit',
  connector: '=',
  label: "Limite d'une suite polynomiale (sans F.I.)",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites', 'Suites'],
  generator: (nb: number) => getDistinctQuestions(getSequencePolynomNoFILimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
