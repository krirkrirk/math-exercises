import { Exercise, Question } from 'src/exercises/exercise';
import { getDistinctQuestions } from 'src/exercises/utils/getDistinctQuestions';
import { Vector } from 'src/math/geometry/vector';
import { distinctRandTupleInt } from 'src/math/utils/random/randTupleInt';
import { NumberNode } from 'src/tree/nodes/numbers/numberNode';

export const scalarProductViaCoords: Exercise = {
  id: 'scalarProductViaCoords',
  connector: '=',
  instruction: '',
  isSingleStep: false,
  label: "Calculer un produit scalaire à l'aide des coordonnées",
  levels: ['1, 0'],
  section: 'Vecteurs',
  generator: (nb: number) => getDistinctQuestions(getScalarProductViaCoordsQuestion, nb),
};

export function getScalarProductViaCoordsQuestion(): Question {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  const u = new Vector('u', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
  const v = new Vector('v', new NumberNode(coords2[0]), new NumberNode(coords2[1]));

  return {
    instruction: `Soit $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer $${u.toTex()}\\cdot ${v.toTex()}$.`,
    startStatement: `${u.toTex()}\\cdot ${v.toTex()}`,
    answer: u.scalarProduct(v).toTex(),
  };
}
