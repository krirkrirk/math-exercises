import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const mainRemarkableValuesExercise: Exercise = {
  id: 'mainRemarkableValues',
  connector: '=',
  instruction: 'Donner la valeur exacte :',
  label: 'Valeurs remarquables de cos et sin sur [-\\pi, \\pi]',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Trigonométrie',
  generator: (nb: number) => getDistinctQuestions(getMainRemarkableValues, nb),
  keys: ['pi', 'cos', 'sin'],
};

export function getMainRemarkableValues(): Question {
  const isCos = coinFlip();

  const remarkableValue = RemarkableValueConstructor.mainInterval();

  const question: Question = {
    startStatement: isCos
      ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
      : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`,
    answer: isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex(),
    keys: ['pi', 'cos', 'sin'],
  };
  return question;
}
