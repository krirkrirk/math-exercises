import { RemarkableValueConstructor } from '../../trigonometry/remarkableValue';
import { coinFlip } from '../../utils/coinFlip';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const remarkableValuesExercise: Exercise = {
  id: 'remarkableValues',
  connector: '=',
  instruction: 'Donner la valeur exacte :',
  label: 'Valeurs remarquables de cos et sin',
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Trigonométrie',
  generator: (nb: number) => getDistinctQuestions(getRemarkableValues, nb),
};

export function getRemarkableValues(): Question {
  const isCos = coinFlip();
  const remarkableValue = RemarkableValueConstructor.simplifiable();
  const question: Question = {
    startStatement: isCos
      ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
      : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`,
    answer: isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex(),
  };
  return question;
}
