import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

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

const getRemarkableValues: QuestionGenerator<QCMProps, VEAProps> = () => {
  const isCos = coinFlip();
  const remarkableValue = RemarkableValueConstructor.simplifiable();

  const answer = isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex();

  shuffle(values);

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

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const statement = random(values);
    tryToAddWrongProp(propositions, statement);
  }
  return shuffle(propositions);
};

export const remarkableValuesExercise: MathExercise<QCMProps, VEAProps> = {
  id: 'remarkableValues',
  connector: '=',
  label: 'Valeurs remarquables de $\\cos$ et $\\sin$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Trigonométrie'],
  generator: (nb: number) => getDistinctQuestions(getRemarkableValues, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
