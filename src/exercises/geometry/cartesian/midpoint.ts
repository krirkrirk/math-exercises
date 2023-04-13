import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Point } from '#root/math/geometry/point';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';

export const midpoint: Exercise = {
  id: 'midpoint',
  connector: '=',
  instruction: '',
  label: 'Coordonnées du milieu',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getMidpointQuestion, nb),
  keys: ['semicolon'],
};

export function getMidpointQuestion(): Question {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  const A = new Point('A', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
  const B = new Point('B', new NumberNode(coords2[0]), new NumberNode(coords2[1]));
  const question: Question = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Quelles sont les coordonnées du milieu $I$ de $[AB]$ ?`,
    startStatement: 'I',
    answer: A.midpoint(B).toTexWithCoords(),
    keys: ['semicolon'],
  };
  return question;
}
