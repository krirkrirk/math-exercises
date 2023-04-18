import { randint } from '#root/math/utils/random/randint';
import { Exercise, Question } from '../../exercise';
import { getDistinctQuestions } from '../../utils/getDistinctQuestions';
import { getConstanteDerivative } from './constanteDerivative';
import { getFirstDegreeDerivative } from './firstDegreeDerivative';
import { getInverseFunctionDerivative } from './inverseFunctionDerivative';
import { getPowerFunctionDerivative } from './powerFunctionDerivative';
import { getRootFunctionDerivative } from './rootFunctionDerivative';
import { getSecondDegreeDerivative } from './secondDegreeDerivative';
import { getThirdDegreeDerivative } from './thirdDegreeDerivative';

export const usualDerivative: Exercise = {
  id: 'usualDerivative',
  connector: '=',
  instruction: '',
  label: 'Dérivées usuelles',
  levels: ['1', '0'],
  section: 'Dérivation',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getUsualDerivative, nb),
  keys: ['x'],
};

export function getUsualDerivative(): Question {
  const rand = randint(1, 8);

  switch (rand) {
    case 1:
      return getFirstDegreeDerivative();
    case 2:
      return getSecondDegreeDerivative();
    case 3:
      return getThirdDegreeDerivative();
    case 4:
      return getInverseFunctionDerivative();
    case 5:
      return getPowerFunctionDerivative();
    case 6:
      return getRootFunctionDerivative();
    case 7:
      return getConstanteDerivative();
    default:
      throw Error('erreur');
  }
}
