import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const mainRemarkableValuesExercise: MathExercise = {
  id: 'mainRemarkableValues',
  connector: '=',
  instruction: '',
  label: 'Valeurs remarquables de $\\cos$ et $\\sin$ sur $[-\\pi, \\pi]$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Trigonométrie'],
  generator: (nb: number) => getDistinctQuestions(getMainRemarkableValues, nb, 18),
  keys: ['pi', 'cos', 'sin'],
  qcmTimer: 60,
  freeTimer: 60,
  maxAllowedQuestions: 18,
};

export function getMainRemarkableValues(): Question {
  const isCos = coinFlip();

  const remarkableValue = RemarkableValueConstructor.mainInterval();

  const answer = isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex();

  const getPropositions = (n: number) => {
    const props: Proposition[] = [
      {
        id: v4(),
        statement: answer,
        isRightAnswer: true,
        format: 'tex',
      },
    ];

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
      tryToAddWrongProp(props, value);
    });

    return shuffleProps(props, n);
  };

  const statement = isCos
    ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
    : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`;

  const question: Question = {
    instruction: `Donner la valeur exacte de : $${statement}$`,
    startStatement: statement,
    answer: answer,
    keys: ['pi', 'cos', 'sin'],
    answerFormat: 'tex',

    getPropositions,
  };
  return question;
}
