import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { v4 } from 'uuid';

export const genericSequenceVariations: MathExercise = {
  id: 'genericSequenceVariations',
  connector: '=',
  instruction: '',
  label: "Déterminer le sens de variations d'une suite en étudiant la différence de deux termes",
  levels: ['1reESM', '1rePro', '1reTech'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getGenericSequenceVariationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: 'QCM',
};

export function getGenericSequenceVariationsQuestion(): Question {
  const u = PolynomialConstructor.randomWithOrder(2, 'n');
  const [b, a] = u.coefficients.slice(1);
  const root = Math.ceil((-a - b) / (2 * a));
  const answer =
    root <= 0
      ? a > 0
        ? 'Croissante'
        : 'Décroissante'
      : `${a > 0 ? 'Croissante' : 'Décroissante'} à partir du rang ${root}`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'raw',
    });

    tryToAddWrongProp(res, 'Croissante', 'raw');
    tryToAddWrongProp(res, 'Décroissante', 'raw');
    let fakeRoot = root <= 0 ? randint(1, 10) : root;
    tryToAddWrongProp(res, `Croissante à partir du rang ${fakeRoot}`, 'raw');
    tryToAddWrongProp(res, `Décroissante à partir du rang ${fakeRoot}`, 'raw');

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer,
    instruction: `Soit $u$ la suite définie par $u_n = ${u.toTree().toTex()}$. Quel est le sens de variations de $u$ ?`,
    keys: [],
    getPropositions,
    answerFormat: 'raw',
  };

  return question;
}
