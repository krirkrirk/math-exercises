import { coinFlip } from '../../utils/coinFlip';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const simplifySquareRoot: Exercise = {
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

  const remarkableValue;

  const question: Question = {
    startStatement: isCos ? `\\cos(${remarkableValue.toTex()})` : `\\sin(${remarkableValue.toTex()})`,
    answer: isCos ? remarkableValue.toCos() : remarkableValue.toSin(),
  };
  return question;
}
