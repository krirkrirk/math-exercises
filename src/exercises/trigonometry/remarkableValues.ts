import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const remarkableValuesExercise: Exercise = {
  id: 'remarkableValues',
  connector: '=',
  instruction: 'Donner la valeur exacte :',
  label: 'Valeurs remarquables de $\\cos$ et $\\sin$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Trigonométrie'],
  generator: (nb: number) => getDistinctQuestions(getRemarkableValues, nb),
  keys: ['pi', 'cos', 'sin'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getRemarkableValues(): Question {
  const isCos = coinFlip();
  const remarkableValue = RemarkableValueConstructor.simplifiable();

  const answer = isCos ? remarkableValue.cos.toTex() : remarkableValue.sin.toTex();

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
  shuffle(values);
  const getPropositions = (n: number) => {
    const props: Proposition[] = [
      {
        id: v4(),
        statement: answer,
        isRightAnswer: true,
        format: 'tex',
      },
    ];
    for (let i = 0; i < n - 1; i++) {
      const statement = values.find((val) => !props.some((el) => el.statement === val))!;
      props.push({
        id: v4(),
        statement,
        isRightAnswer: false,
        format: 'tex',
      });
    }
    return props;
  };

  const question: Question = {
    startStatement: isCos
      ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
      : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`,
    answer: answer,
    keys: ['pi', 'cos', 'sin'],
    answerFormat: 'tex',

    getPropositions,
  };
  return question;
}
