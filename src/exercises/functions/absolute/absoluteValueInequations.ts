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
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {};

const getAbsoluteValueInequationsQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = randint(1, 10);
  //|x-b| <= a
  const b = -poly.coefficients[0];
  const isStrict = coinFlip();
  const answer = isStrict ? `S=]${b - a};${b + a}[` : `S=[${b - a};${b + a}]`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Résoudre l'inéquation $|${poly.toTree().toTex()}|${isStrict ? '<' : '\\le'}${a}$.`,
    keys: ['S', 'equal', 'lbracket', 'semicolon', 'rbracket', 'emptyset'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `S=]${b - a};${b + a}[`);
  tryToAddWrongProp(propositions, `S=[${b - a};${b + a}]`);
  tryToAddWrongProp(propositions, `S=\\left\\{${b - a};${b + a}\\right\\}`);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `S=[${randint(-9, 0)};${randint(0, 10)}]`);
  }

  return shuffleProps(propositions, n);
};
export const absoluteValueInequations: MathExercise<QCMProps, VEAProps> = {
  id: 'absoluteValueInequations',
  connector: '\\iff',
  label: 'Résoudre une inéquation avec valeur absolue',
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Valeur absolue', 'Inéquations', 'Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getAbsoluteValueInequationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
