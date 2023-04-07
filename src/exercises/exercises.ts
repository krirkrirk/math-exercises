import { addAndSubExercise } from './calcul/addAndSub';
import { addAndSubWithoutRelatives } from './calcul/addAndSubWithoutRelatives';
import { fractionAndIntegerDivision } from './calcul/fractions/fractionAndIntegerDivision';
import { fractionAndIntegerProduct } from './calcul/fractions/fractionAndIntegerProduct';
import { fractionAndIntegerSum } from './calcul/fractions/fractionAndIntegerSum';
import { fractionsDivision } from './calcul/fractions/fractionsDivision';
import { fractionsProduct } from './calcul/fractions/fractionsProduct';
import { fractionsSum } from './calcul/fractions/fractionsSum';
import { simplifyFraction } from './calcul/fractions/simplifyFraction';
import { operationsPriorities } from './calcul/operations/operationsPriorities';
import {
  allRoundings,
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
} from './calcul/rounding/rounding';
import { allIdentities } from './calculLitteral/distributivity/allIdentities';
import { doubleDistributivity } from './calculLitteral/distributivity/doubleDistributivity';
import { firstIdentity } from './calculLitteral/distributivity/firstIdentity';
import { secondIdentity } from './calculLitteral/distributivity/secondIdentity';
import { simpleDistributivity } from './calculLitteral/distributivity/simpleDistributivity';
import { thirdIdentity } from './calculLitteral/distributivity/thirdIdentity';
import { equationSimpleSquare } from './calculLitteral/equation/equationSimpleSquare';
import { equationType1Exercise } from './calculLitteral/equation/equationType1Exercise';
import { equationType2Exercise } from './calculLitteral/equation/equationType2Exercise';
import { equationType3Exercise } from './calculLitteral/equation/equationType3Exercise';
import { equationType4Exercise } from './calculLitteral/equation/equationType4Exercise';
import { firstDegreeEquation } from './calculLitteral/equation/firstDegreeEquation';
import { firstDegreeGeneralEquation } from './calculLitteral/equation/firstDegreeGeneralEquation';
import { factoIdRmq1 } from './calculLitteral/factorisation/factoIdRmq1';
import { factoIdRmq2 } from './calculLitteral/factorisation/factoIdRmq2';
import { factoIdRmq3 } from './calculLitteral/factorisation/factoIdRmq3';
import { factoType1Exercise } from './calculLitteral/factorisation/factoType1Exercise';
import { thirdDegreeDerivative } from './derivation/derivative/thirdDegreeDerivative';
import { usualDerivative } from './derivation/derivative/usualderivative';
import { midpoint } from './geometry/cartesian/midpoint';
import { scalarProductViaCoords } from './geometry/vectors/scalarProductViaCoords';
import { applyPercent } from './percent/applyPercent';
import { averageEvolutionRate } from './percent/averageEvolutionRate';
import { globalPercent } from './percent/globalPercent';
import { reciprocalPercentage } from './percent/reciprocalPercentage';
import { powersDivision, powersOfTenDivision } from './powers/powersDivision';
import { powersOfTenToDecimal } from './powers/powersOfTenToDecimal';
import { powersOfTenPower, powersPower } from './powers/powersPower';
import { powersOfTenProduct, powersProduct } from './powers/powersProduct';
import { scientificToDecimal } from './powers/scientificToDecimal';

import { conditionalProbability } from './proba/conditionalProbability';

import { arithmeticExplicitFormulaUsage } from './sequences/arithmetic/arithmeticExplicitFormulaUsage';
import { arithmeticFindExplicitFormula } from './sequences/arithmetic/arithmeticFindExplicitFormula';
import { arithmeticFindReason } from './sequences/arithmetic/arithmeticFindReason';
import { arithmeticReasonUsage } from './sequences/arithmetic/arithmeticReasonUsage';
import { arithmeticRecurrenceFormulaUsage } from './sequences/arithmetic/arithmeticRecurrenceFormulaUsage';
import { arithmeticThresholdFind } from './sequences/arithmetic/arithmeticThresholdFind';

import { geometricExplicitFormulaUsage } from './sequences/geometric/geometricExplicitFormulaUsage';
import { geometricFindExplicitFormula } from './sequences/geometric/geometricFindExplicitFormula';
import { geometricFindReason } from './sequences/geometric/geometricFindReason';
import { geometricReasonUsage } from './sequences/geometric/geometricReasonUsage';
import { geometricRecurrenceFormulaUsage } from './sequences/geometric/geometricRecurrenceFormulaUsage';
import { simplifySquareRoot } from './squareRoots/simpifySquareRoot';

export const exercises = [
  /**
   * calcul litteral
   */
  factoType1Exercise,
  factoIdRmq1,
  factoIdRmq2,
  factoIdRmq3,
  simpleDistributivity,
  doubleDistributivity,
  firstIdentity,
  secondIdentity,
  thirdIdentity,
  allIdentities,
  equationType1Exercise,
  equationType2Exercise,
  equationType3Exercise,
  equationType4Exercise,

  /**
   * square roots
   */
  simplifySquareRoot,

  /**
   * fractions
   */
  fractionAndIntegerDivision,
  fractionAndIntegerProduct,
  fractionAndIntegerSum,
  fractionsDivision,
  fractionsProduct,
  fractionsSum,
  simplifyFraction,

  /**
   * calcul
   */
  operationsPriorities,
  addAndSubExercise,

  /**
   * rounding
   */
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
  allRoundings,

  /**
   * geometry
   */
  midpoint,

  /**
   * vectors
   */
  scalarProductViaCoords,

  /**
   * puissances
   */
  powersDivision,
  powersPower,
  powersProduct,
  powersOfTenDivision,
  powersOfTenPower,
  powersOfTenProduct,
  scientificToDecimal,
  powersOfTenToDecimal,

  /**
   * suites
   */
  geometricExplicitFormulaUsage,
  geometricFindReason,
  geometricFindExplicitFormula,
  geometricReasonUsage,
  geometricRecurrenceFormulaUsage,

  /**
   * islam
   */
  applyPercent,
  globalPercent,
  reciprocalPercentage,
  equationSimpleSquare,

  usualDerivative,
  thirdDegreeDerivative,
  averageEvolutionRate,
  firstDegreeEquation,
  firstDegreeGeneralEquation,
  conditionalProbability,

  arithmeticExplicitFormulaUsage,
  arithmeticFindExplicitFormula,
  arithmeticFindReason,
  arithmeticReasonUsage,
  arithmeticRecurrenceFormulaUsage,
  arithmeticThresholdFind,
  addAndSubWithoutRelatives,
];
