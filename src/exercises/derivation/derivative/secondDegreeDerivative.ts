import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Vector } from '#root/math/geometry/vector';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';

export const secondDegreeDerivative: Exercise = {
  id: 'secondDegreeDerivative',
  connector: '=',
  instruction: '',
  isSingleStep: false,
  label: "Calculer la dérivée d'une fonction du second degré",
  levels: ['1, 0'],
  section: 'Dérivation',
  generator: (nb: number) => getDistinctQuestions(getSecondDegreeDerivativeQuestion, nb),
};

export function getSecondDegreeDerivativeQuestion(): Question {
  const polynom = new Polynomial([randint(-20, 20, [0]), randint(-20, 20), randint(-20, 20)]);
  const answer = polynom.derivate();
  return {
    instruction: `Soit $f(x) = ${polynom.toTex()}$. Déterminer la fonction dérivée $f'$ de $f$.`,
    startStatement: `$f'(x)$`,
    answer: a.toString(),
  };
}
