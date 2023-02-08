import { Point } from '../../../geometry/point';
import { randint } from '../../../mathutils/random/randint';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const simplifySquareRoot: Exercise = {
  id: 'midpoint',
  connector: '=',
  instruction: '',
  label: 'Coordonnées du milieu',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getMidpointQuestion, nb),
};

export function getMidpointQuestion(): Question {
  const A = new Point('A', randint(-10, 10), randint(-10, 10));
  const question: Question = {
    startStatement: `Soit $${A.toTex()}$ et $${B.toTex()}$. Quelles sont les coordonnées du milieu $I$ de $[AB]$ ?`,
    answer: latexParser(squareRoot.simplify().toTree()),
  };
  return question;
}
