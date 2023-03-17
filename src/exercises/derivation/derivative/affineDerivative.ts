import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Vector } from '#root/math/geometry/vector';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { randint } from '#root/math/utils/random/randint';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';

export const affineDerivative: Exercise = {
  id: 'affineDerivative',
  connector: '=',
  instruction: '',
  isSingleStep: false,
  label: "Calculer la dérivée d'une fonction affine",
  levels: ['1, 0'],
  section: 'Dérivation',
  generator: (nb: number) => getDistinctQuestions(getAffineDerivativeQuestion, nb),
};

export function getAffineDerivativeQuestion(): Question {
  const a = randint(-20, 20, [0]);
  const b = randint(-20, 20);
  const affine = new Affine(a, b);

  return {
    instruction: `Soit $f(x) = ${affine.toTex()}$. Déterminer la fonction dérivée $f'$ de $f$.`,
    startStatement: `f'(x)`,
    answer: a.toString(),
  };
}
