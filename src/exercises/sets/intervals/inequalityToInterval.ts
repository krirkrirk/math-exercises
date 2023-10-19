import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { IntervalConstructor } from '#root/math/sets/intervals/intervals';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const inequalityToInterval: Exercise = {
  id: 'inequalityToInterval',
  connector: '=',
  instruction: '',
  label: 'Traduire une inégalité en intervalle',
  levels: ['2ndPro', '2nde', 'CAP', '1reESM'],
  isSingleStep: true,
  sections: ['Ensembles et intervalles'],
  generator: (nb: number) => getDistinctQuestions(getInequalityToIntervalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getInequalityToIntervalQuestion(): Question {
  const reverseBracket = (bracket: ']' | '[') => {
    return bracket === '[' ? ']' : '[';
  };
  const switchInequality = (symbol: '\\leq' | '<' | '\\geq' | '>') => {
    if (symbol === '\\leq') return '<';
    if (symbol === '<') return '\\leq';
    if (symbol === '>') return '\\geq';
    return '>';
  };
  const reverseInequality = (symbol: '\\leq' | '<' | '\\geq' | '>') => {
    if (symbol === '\\leq') return '\\geq';
    if (symbol === '<') return '>';
    if (symbol === '>') return '<';
    return '\\leq';
  };
  const isIntervalToInequality = coinFlip();
  const interval = IntervalConstructor.random();
  const inequalityString = interval.toInequality();
  const answer = isIntervalToInequality ? inequalityString : `x \\in ${interval.toTex()}`;
  const instruction = isIntervalToInequality
    ? `Soit $x \\in ${interval.toTex()}$. Traduire cette appartenance en une inégalité.`
    : `Soit $${inequalityString}$. Traduire cette inégalité en appartenance à un intervalle.`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    if (isIntervalToInequality) {
      if (interval.min === -Infinity) {
        const wrongStatements = [
          `x ${switchInequality(interval.rightInequalitySymbol)} ${interval.maxTex}`,
          `-\\infty \\leq x ${switchInequality(interval.rightInequalitySymbol)} ${interval.maxTex}`,
          `-\\infty < x ${switchInequality(interval.rightInequalitySymbol)} ${interval.maxTex}`,
        ];
        wrongStatements.forEach((statement) => {
          res.push({
            id: v4(),
            statement,
            isRightAnswer: false,
            format: 'tex',
          });
        });
      } else if (interval.max === Infinity) {
        const wrongStatements = [
          `x ${switchInequality(reverseInequality(interval.leftInequalitySymbol))} ${interval.minTex}`,
          `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x \\leq +\\infty`,
          `${interval.minTex} ${switchInequality(interval.leftInequalitySymbol)} x \\leq +\\infty`,
        ];
        wrongStatements.forEach((statement) => {
          res.push({
            id: v4(),
            statement,
            isRightAnswer: false,
            format: 'tex',
          });
        });
      } else {
        const wrongStatements = [
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
        wrongStatements.forEach((statement) => {
          res.push({
            id: v4(),
            statement,
            isRightAnswer: false,
            format: 'tex',
          });
        });
      }
    } else {
      res.push({
        id: v4(),
        statement: `x \\in \\left${reverseBracket(interval.leftBracket)}${interval.insideToTex()}\\right${
          interval.rightBracket
        }`,
        isRightAnswer: true,
        format: 'tex',
      });
      res.push({
        id: v4(),
        statement: `x \\in \\left${interval.leftBracket}${interval.insideToTex()}\\right${reverseBracket(
          interval.rightBracket,
        )}`,
        isRightAnswer: true,
        format: 'tex',
      });
      res.push({
        id: v4(),
        statement: `x \\in \\left${reverseBracket(
          interval.leftBracket,
        )}${interval.insideToTex()}\\right${reverseBracket(interval.rightBracket)}`,
        isRightAnswer: true,
        format: 'tex',
      });
    }

    return shuffle(res);
  };

  const question: Question = {
    answer,
    instruction: instruction,
    keys: ['x', 'belongs', 'inf', 'sup', 'geq', 'leq', 'lbracket', 'rbracket', 'semicolon'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
