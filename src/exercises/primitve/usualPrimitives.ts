import { Exercise, Question } from '#root/exercises/exercise';
import { getConstantPrimitive } from '#root/exercises/primitve/constantPrimitive';
import { getExponentialPrimitive } from '#root/exercises/primitve/exponentialPrimitive';
import { getLogarithmePrimitive } from '#root/exercises/primitve/logarithmePrimitive';
import { getPolynomialPrimitive } from '#root/exercises/primitve/polynomialPrimitive';
import { getSinCosPrimitive } from '#root/exercises/primitve/sinCosPrimitive';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const usualPrimitives: Exercise = {
  id: 'usualPrimitives',
  connector: '=',
  instruction: '',
  label: 'Primitives des fonctions de référence',
  levels: ['1', '0'],
  section: 'Intégrations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualPrimitives, nb),
  keys: ['x'],
};

export function getUsualPrimitives(): Question {
  const rand = randint(1, 6);

  switch (rand) {
    case 1:
      return getConstantPrimitive();
    case 2:
      return getPolynomialPrimitive();
    case 3:
      return getLogarithmePrimitive();
    case 4:
      return getSinCosPrimitive();
    case 5:
      return getExponentialPrimitive();
    default:
      throw Error('erreur');
  }
}
