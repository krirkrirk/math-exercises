import { Point } from '../../../geometry/point';
import { randint } from '../../../mathutils/random/randint';
import { distinctRandTupleInt } from '../../../mathutils/random/randTupleInt';
import { NumberNode } from '../../../tree/nodes/numbers/numberNode';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';

export const midpoint: Exercise = {
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
  const [coords1, coords2] = distinctRandTupleInt(2, 2, {from: -9, to : 10});
  const A = new Point('A', new NumberNode(coords1[0]),  new NumberNode(coords1[1]));
  const B = new Point('B', new NumberNode(coords2[0]),  new NumberNode(coords2[1]));
  const question: Question = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Quelles sont les coordonnées du milieu $I$ de $[AB]$ ?`,
    startStatement: "I",
    answer: A.midpoint(B).toTexWithCoords(),
  };
  return question;
}
