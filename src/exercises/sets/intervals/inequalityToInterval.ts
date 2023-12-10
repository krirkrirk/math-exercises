import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  addWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Interval, IntervalConstructor } from '#root/math/sets/intervals/intervals';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

const getInequalityToIntervalQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const isIntervalToInequality = coinFlip();
  const interval = IntervalConstructor.random();
  const inequalityString = interval.toInequality();
  const answer = isIntervalToInequality ? inequalityString : `x\\in${interval.toTex()}`;
  const instruction = isIntervalToInequality
    ? `Soit $x \\in ${interval.toTex()}$. Traduire cette appartenance en une inégalité.`
    : `Soit $${inequalityString}$. Traduire cette inégalité en appartenance à un intervalle.`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: instruction,
    keys: ['x', 'belongs', 'inf', 'sup', 'geq', 'leq', 'lbracket', 'rbracket', 'semicolon', 'infty'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, isIntervalToInequality: isIntervalToInequality, intervalTex: interval.tex },
  };

  return question;
};

type QCMProps = {
  answer: string;
  isIntervalToInequality: boolean;
  intervalTex: string;
};
type VEAProps = {};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, isIntervalToInequality, intervalTex }) => {
  const reverseBracket = (bracket: ']' | '[') => {
    return bracket === '[' ? ']' : '[';
  };
  const switchInequality = (symbol: '\\le' | '<' | '\\ge' | '>') => {
    if (symbol === '\\le') return '<';
    if (symbol === '<') return '\\le';
    if (symbol === '>') return '\\ge';
    return '>';
  };
  const reverseInequality = (symbol: '\\le' | '<' | '\\ge' | '>') => {
    if (symbol === '\\le') return '\\ge';
    if (symbol === '<') return '>';
    if (symbol === '>') return '<';
    return '\\le';
  };

  const interval = new Interval(intervalTex);
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  let wrongStatements: string[] = [];
  if (isIntervalToInequality) {
    if (interval.min === -Infinity) {
      wrongStatements = [
        `x${switchInequality(interval.rightInequalitySymbol)}${interval.maxTex}`,
        `-\\infty\\le x${switchInequality(interval.rightInequalitySymbol)}${interval.maxTex}`,
        `-\\infty <x${switchInequality(interval.rightInequalitySymbol)}${interval.maxTex}`,
      ];
    } else if (interval.max === Infinity) {
      wrongStatements = [
        `x ${switchInequality(reverseInequality(interval.leftInequalitySymbol))} ${interval.minTex}`,
        `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x \\le +\\infty`,
        `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x \\le +\\infty`,
      ];
    } else {
      wrongStatements = [
        `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x ${interval.rightInequalitySymbol} ${
          interval.maxTex
        }`,
        `${interval.minTex} ${interval.leftInequalitySymbol} x ${switchInequality(interval.rightInequalitySymbol)} ${
          interval.maxTex
        }`,
        `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x ${switchInequality(
          interval.rightInequalitySymbol,
        )} ${interval.maxTex}`,
      ];
    }
  } else {
    wrongStatements = [
      `x \\in ${reverseBracket(interval.leftBracket)}${interval.insideToTex()}${interval.rightBracket}`,
      `x \\in ${interval.leftBracket}${interval.insideToTex()}${reverseBracket(interval.rightBracket)}`,
      `x \\in ${reverseBracket(interval.leftBracket)}${interval.insideToTex()}${reverseBracket(interval.rightBracket)}`,
    ];
  }
  wrongStatements.forEach((statement) => {
    addWrongProp(propositions, statement);
  });
  return shuffle(propositions);
};

export const inequalityToInterval: MathExercise<QCMProps, VEAProps> = {
  id: 'inequalityToInterval',
  connector: '=',
  label: 'Traduire une inégalité en intervalle',
  levels: ['2ndPro', '2nde', 'CAP', '1reESM'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getInequalityToIntervalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
