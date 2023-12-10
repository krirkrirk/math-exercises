import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getMainRemarkableValues: QuestionGenerator<QCMProps, VEAProps> = () => {
  const isCos = coinFlip();

  const remarkableValue = RemarkableValueConstructor.mainInterval();

  const answer = isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex();

  const statement = isCos
    ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
    : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`;

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Donner la valeur exacte de : $${statement}$`,
    startStatement: statement,
    answer: answer,
    keys: ['pi', 'cos', 'sin'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const values = [
    '-1',
    '-\\frac{\\sqrt 3}{2}',
    '-\\frac{\\sqrt 2}{2}',
    '-\\frac{1}{2}',
    '0',
    '\\frac{\\sqrt 3}{2}',
    '\\frac{\\sqrt 2}{2}',
    '\\frac{1}{2}',
    '1',
  ];
  values.forEach((value) => {
    tryToAddWrongProp(propositions, value);
  });

  return shuffleProps(propositions, n);
};

export const mainRemarkableValuesExercise: MathExercise<QCMProps, VEAProps> = {
  id: 'mainRemarkableValues',
  connector: '=',
  label: 'Valeurs remarquables de $\\cos$ et $\\sin$ sur $[-\\pi, \\pi]$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Trigonométrie'],
  generator: (nb: number) => getDistinctQuestions(getMainRemarkableValues, nb, 18),
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 18,
  getPropositions,
};
