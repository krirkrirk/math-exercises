import { RemarkableValueConstructor } from '#root/math/trigonometry/remarkableValue';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const mainRemarkableValuesExercise: Exercise = {
  id: 'mainRemarkableValues',
  connector: '=',
  instruction: 'Donner la valeur exacte :',
  label: 'Valeurs remarquables de $\\cos$ et $\\sin$ sur $[-\\pi, \\pi]$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Trigonométrie'],
  generator: (nb: number) => getDistinctQuestions(getMainRemarkableValues, nb),
  keys: ['pi', 'cos', 'sin'],
};

export function getMainRemarkableValues(): Question {
  const isCos = coinFlip();

  const remarkableValue = RemarkableValueConstructor.mainInterval();

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
    return shuffle(props);
  };

  const question: Question = {
    startStatement: isCos
      ? `\\cos\\left(${remarkableValue.angle.toTex()}\\right)`
      : `\\sin\\left(${remarkableValue.angle.toTex()}\\right)`,
    answer: answer,
    keys: ['pi', 'cos', 'sin'],
    answerFormat: 'tex',
    qcmTimer: 60,
    freeTimer: 60,
    getPropositions,
  };
  return question;
}
