import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { probaFlip } from '#root/utils/probaFlip';
import { probaLawFlip } from '#root/utils/probaLawFlip';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {};

const getAbsoluteValueEquationsQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = probaFlip(0.9) ? randint(1, 10) : coinFlip() ? 0 : randint(-9, 0);
  //|x-b| = a
  const b = -poly.coefficients[0];
  const answer =
    a === 0 ? `S=\\left\\{${b}\\right\\}` : a < 0 ? `S=\\emptyset` : `S=\\left\\{${b - a};${b + a}\\right\\}`;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Résoudre l'équation $|${poly.toTree().toTex()}| = ${a}$.`,
    keys: ['S', 'equal', 'emptyset', 'lbrace', 'semicolon', 'rbrace'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (a < 0) {
    tryToAddWrongProp(propositions, `S=\\left\\{${b - a};${b + a}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${b + a}\\right\\}`);
  } else if (a === 0) {
    tryToAddWrongProp(propositions, `S=\\emptyset`);
  } else if (a > 0) {
    tryToAddWrongProp(propositions, `S=\\left\\{${b + a}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${-b - a};${-b + a}\\right\\}`);
  }
  while (propositions.length < n) {
    const wrongAnswer = `S=\\left\\{${randint(-9, 0)};${randint(0, 10)}\\right\\}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const absoluteValueEquations: MathExercise<QCMProps, VEAProps> = {
  id: 'absoluteValueEquation',
  connector: '\\iff',
  label: 'Résoudre une équation avec valeur absolue',
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Valeur absolue', 'Équations'],
  generator: (nb: number) => getDistinctQuestions(getAbsoluteValueEquationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
