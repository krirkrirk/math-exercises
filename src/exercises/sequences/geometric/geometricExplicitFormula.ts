import { randint } from '../../../mathutils/random/randint';
import { SquareRootConstructor } from '../../numbers/reals/squareRoot';
import { Exercise, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';

export const geometricExplicitFormulaUsage: Exercise = {
  id: 'geometricExplicitFormula',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule explicite d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricExplicitFormulaUsage, nb),
};

export function getGeometricExplicitFormulaUsage(): Question {
  const rank = randint(0, 10);
  const question: Question = {
    instruction: `La suite $(u_n)$ est définie par $u_n = $. Calculer $u_{${rank}}$`,
    startStatement: 'u_n',
    answer: squareRoot.simplify().toTree().toTex(),
  };
  return question;
}
