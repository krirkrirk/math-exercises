import { addAndSubExercise } from './calcul/addAndSub';
import { addAndSubWithoutRelatives } from './calcul/addAndSubWithoutRelatives';
import { fractionAndIntegerDivision } from './calcul/fractions/fractionAndIntegerDivision';
import { fractionAndIntegerProduct } from './calcul/fractions/fractionAndIntegerProduct';
import { fractionAndIntegerSum } from './calcul/fractions/fractionAndIntegerSum';
import { fractionToPercentToDecimal } from './calcul/fractions/fractionToPercentToDecimal';
import { fractionsDivision } from './calcul/fractions/fractionsDivision';
import { fractionsProduct } from './calcul/fractions/fractionsProduct';
import { fractionsSum } from './calcul/fractions/fractionsSum';
import { simplifyFraction } from './calcul/fractions/simplifyFraction';
import { mentalAddAndSub } from './calcul/mentalCaluls.ts/mentalAddAndSub';
import { mentalDivisions } from './calcul/mentalCaluls.ts/mentalDivisions';
import { mentalMultiplications } from './calcul/mentalCaluls.ts/mentalMultiplications';
import { mentalPercentage } from './calcul/mentalCaluls.ts/mentalPercentage';
import { operationsPriorities } from './calcul/operations/operationsPriorities';
import { operationsPrioritiesWithoutRelative } from './calcul/operations/operationsPrioritiesWithoutRelative';
import { primeNumbers } from './calcul/arithmetics/primeNumbers';
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
import { fractionEquation } from './calculLitteral/equation/fractionEquation';
import { multiplicationEquation } from './calculLitteral/equation/multiplicationEquation';
import { factoIdRmq1 } from './calculLitteral/factorisation/factoIdRmq1';
import { factoIdRmq2 } from './calculLitteral/factorisation/factoIdRmq2';
import { factoIdRmq3 } from './calculLitteral/factorisation/factoIdRmq3';
import { factoType1Exercise } from './calculLitteral/factorisation/factoType1Exercise';
import { aeraConversion } from './conversion/aeraConversion';
import { capacityConversion } from './conversion/capacityConversion';
import { lengthConversion } from './conversion/lengthConversion';
import { massConversion } from './conversion/massConversion';
import { volumeCapacityConversion } from './conversion/volumeCapacityConversion';
import { volumeConversion } from './conversion/volumeConversion';
import { constanteDerivative } from './derivation/derivative/constanteDerivative';
import { firstDegreeDerivative } from './derivation/derivative/firstDegreeDerivative';
import { inverseFunctionDerivative } from './derivation/derivative/inverseFunctionDerivative';
import { powerFunctionDerivative } from './derivation/derivative/powerFunctionDerivative';
import { rootFunctionDerivative } from './derivation/derivative/rootFunctionDerivative';
import { secondDegreeDerivative } from './derivation/derivative/secondDegreeDerivative';
import { thirdDegreeDerivative } from './derivation/derivative/thirdDegreeDerivative';
import { usualDerivative } from './derivation/derivative/usualderivative';
import { derivativeNumberReading } from './derivation/derivativeNumberReading';
import { leadingCoefficient } from './geometry/cartesian/leadingCoefficient';
import { leadingCoefficientCalculV1 } from './geometry/cartesian/leadingCoefficientCalculV1';
import { leadingCoefficientCalculV2 } from './geometry/cartesian/leadingCoefficientCalculV2';
import { midpoint } from './geometry/cartesian/midpoint';
import { pythagore } from './geometry/euclidean/pythagore';
import { pythagoreCalcul } from './geometry/euclidean/pythagoreCalcul';
import { rightTriangleArea } from './geometry/euclidean/rightTriangleArea';
import { thales } from './geometry/euclidean/thales';
import { thalesCalcul } from './geometry/euclidean/thalesCalcul';
import { trigonometry } from './geometry/euclidean/trigonometry';
import { trigonometryAngleCalcul } from './geometry/euclidean/trigonometryAngleCalcul';
import { trigonometrySideCalcul } from './geometry/euclidean/trigonometrySideCalcul';
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
import { marginalAndConditionalFrequency } from './proba/marginalAndConditionalFrequency';
import { probabilityTree } from './proba/probabilityTree';

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
import { rectangleArea } from './geometry/euclidean/rectangleArea';
import { rectanglePerimeter } from './geometry/euclidean/rectanglePerimeter';
import { squareArea } from './geometry/euclidean/squareArea';
import { squarePerimeter } from './geometry/euclidean/squarePerimeter';
import { trianglePerimeter } from './geometry/euclidean/trianglePerimeter';
import { triangleAreaV2 } from './geometry/euclidean/triangleAreaV2';
import { circleArea } from './geometry/euclidean/circleArea';
import { circleCircumference } from './geometry/euclidean/circleCircumference';
import { triangleArea } from './geometry/euclidean/triangleArea';
import { distanceBetweenTwoPoints } from './geometry/cartesian/distanceBetweenTwoPoints';
import { reduceExpression } from './calculLitteral/simplifying/reduceExpression';
import { evaluateExpression } from './calculLitteral/equation/evaluateExpression';
import { proportionalityTable } from './calcul/proportionality/proportionalityTable';

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

  /**
   * equations
   */
  equationType1Exercise,
  equationType2Exercise,
  equationType3Exercise,
  equationType4Exercise,
  firstDegreeEquation,
  equationSimpleSquare,

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
  addAndSubExercise,
  addAndSubWithoutRelatives,
  operationsPriorities,
  operationsPrioritiesWithoutRelative,

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
  arithmeticExplicitFormulaUsage,
  arithmeticFindExplicitFormula,
  arithmeticFindReason,
  arithmeticReasonUsage,
  arithmeticRecurrenceFormulaUsage,
  arithmeticThresholdFind,

  /**
   * islam
   */
  applyPercent,
  globalPercent,
  reciprocalPercentage,
  averageEvolutionRate,
  usualDerivative,
  constanteDerivative,
  firstDegreeDerivative,
  secondDegreeDerivative,
  thirdDegreeDerivative,
  inverseFunctionDerivative,
  rootFunctionDerivative,
  powerFunctionDerivative,
  conditionalProbability,
  leadingCoefficient,
  derivativeNumberReading,
  probabilityTree,
  fractionToPercentToDecimal,
  marginalAndConditionalFrequency,
  mentalAddAndSub,
  mentalMultiplications,
  mentalDivisions,
  mentalPercentage,
  thales,
  thalesCalcul,
  pythagore,
  pythagoreCalcul,
  trigonometry,
  trigonometryAngleCalcul,
  trigonometrySideCalcul,
  rightTriangleArea,
  triangleArea,

  /**
   * nv generateurs
   */

  capacityConversion,
  lengthConversion,
  massConversion,
  aeraConversion,
  volumeConversion,
  volumeCapacityConversion,
  primeNumbers,
  multiplicationEquation,
  fractionEquation,
  leadingCoefficientCalculV1,
  leadingCoefficientCalculV2,
  rectangleArea,
  rectanglePerimeter,
  squareArea,
  squarePerimeter,
  triangleAreaV2,
  trianglePerimeter,
  circleArea,
  circleCircumference,
  distanceBetweenTwoPoints,
  reduceExpression,
  evaluateExpression,
  proportionalityTable,
];
