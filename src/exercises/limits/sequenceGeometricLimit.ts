import { Exercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { NumberType } from '#root/math/numbers/nombre';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { GeometricSequenceConstructor } from '#root/math/sequences/geometricSequence';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const sequenceGeometricLimit: Exercise = {
  id: 'sequenceGeometricLimit',
  connector: '=',
  instruction: '',
  label: "Limite d'une suite géométrique",
  levels: ['TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Limites'],
  generator: (nb: number) => getDistinctQuestions(getSequenceGeometricLimitQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getSequenceGeometricLimitQuestion(): Question {
  const sequence = GeometricSequenceConstructor.randomWithLimit();
  const to = '+\\infty';
  const answer = sequence.getLimit();
  if (!answer) throw Error('received geometric sequence with no limit');
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, '+\\infty');
    tryToAddWrongProp(res, '-\\infty');
    tryToAddWrongProp(res, '0');
    tryToAddWrongProp(res, sequence.reason.tex + '');
    tryToAddWrongProp(res, sequence.firstTerm.tex + '');

    return shuffle([res[0], ...res.slice(1, n - 1)]);
  };

  const question: Question = {
    answer: answer,
    instruction: `Déterminer la limite de la suite $u$ définie par : $u_n = ${sequence.toTree().toTex()}$.`,
    keys: ['infty'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
