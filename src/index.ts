import { exercises } from './exercises/exercises';
import { geometricExplicitFormulaUsage } from './exercises/sequences/geometric/geometricExplicitFormulaUsage';
import { geometricFindExplicitFormula } from './exercises/sequences/geometric/geometricFindExplicitFormula';
import { geometricFindReason } from './exercises/sequences/geometric/geometricFindReason';
import { geometricReasonUsage } from './exercises/sequences/geometric/geometricReasonUsage';
import { geometricRecurrenceFormulaUsage } from './exercises/sequences/geometric/geometricRecurrenceFormulaUsage';

const allExercises = [...exercises];

const exos = [
  geometricExplicitFormulaUsage,
  geometricFindExplicitFormula,
  geometricFindReason,
  geometricReasonUsage,
  geometricRecurrenceFormulaUsage,
];

exos.forEach((exo) => {
  console.log(exo);
  console.log(exo.generator(10));
});
export { allExercises };
